from flask import Flask, request, jsonify
from agent.Agent import Agent
import os
import base64
from flask_cors import CORS
from dotenv import load_dotenv
from utilities.helpers import Helper

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {"origins": [os.environ["CLIENT_ORIGIN"], "https://192.168.1.67:5173"]}
    },
)


@app.route("/chat-agent", methods=["POST"])
async def chatAgent():
    try:
        # Ensure request method is POST
        if request.method != "POST":
            return jsonify({"error": "Method not allowed"}), 405

        # Parse the incoming JSON data
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        message = ""
        # Define output paths
        output_path_mp3 = os.environ["OUTPUT_PATH_MP3"]
        output_path_wav = os.environ["OUTPUT_PATH_WAV"]

        lip_sync_path = os.environ["LIPSYNC_PATH"]
        input_path_webm = os.environ["INPUT_PATH_WEBM"]

        agent = None
        helper = Helper()
        if "agentType" in data and data["agentType"] is not None:
            agentType = data["agentType"]
            match agentType:
                case "atm":
                    atm_sys_info = f"{helper.loadAgent('ATM_Agent')}"
                    agent = Agent(system_info=atm_sys_info)
                case "vend":
                    vend_sys_info = f"{helper.loadAgent('Vend_Agent')}"
                    agent = Agent(system_info=vend_sys_info)

                case __:
                    agent = None
                    return jsonify({"error": "Invalid agent type"}), 400

        if agent is None:
            raise ValueError("Agent was not specified")

        # Ensure audio field exists in the request
        if "audio" in data and data["audio"] is not None:
            # Extract the base64 audio data
            audio_base64 = data["audio"]
            if not audio_base64:
                return jsonify({"error": "Empty 'audio' field"}), 400

            # Decode and save the audio file
            with open(input_path_webm, "wb") as f:
                f.write(base64.b64decode(audio_base64))

                # Process the audio and generate text
            message = agent.generateTextFromVoice(input_path_webm)

        elif "textInput" in data:
            message = data["textInput"]

        data_list = []
        print("got here")

        data_list = helper.handleAgentAction(
            message=message,
            data_list=data_list,
            agent=agent,
            helper=helper,
            output_path_mp3=output_path_mp3,
            output_path_wav=output_path_wav,
            lip_sync_path=lip_sync_path,
        )
        # Return the response
        return jsonify({"messages": data_list})

    except Exception as e:
        error_response_datalist = []
        error_response_datalist = helper.errorResponse(error_response_datalist, e)
        print(e, "ERROR")
        return jsonify({"error": error_response_datalist}), 500


if "__main__" == __name__:
    cert_path = os.path.join(os.path.dirname(__file__), "192.168.1.67.pem")
    key_path = os.path.join(os.path.dirname(__file__), "192.168.1.67-key.pem")
    app.run(
        host="0.0.0.0", ssl_context=(cert_path, key_path)
        )

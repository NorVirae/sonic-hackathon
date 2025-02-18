from flask import Flask, request, jsonify
from agent.Agent import Agent
import os
import base64
from flask_cors import CORS
from dotenv import load_dotenv
from utilities.helpers import Helper

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.environ["CLIENT_ORIGIN"]}})


def handleAgentAction(
    message, data_list, agent, helper, output_path_mp3, output_path_wav, lip_sync_path
):
    data_list = data_list
    # Generate agent's response
    response_message = agent.predict(message)

    # get json data
    parsed_data = helper.getJsonData(response_message)

    # format response
    data_list = helper.prepResponseForClient(
        parsed_data=parsed_data,
        agent=agent,
        output_path_mp3=output_path_mp3,
        output_path_wav=output_path_wav,
        lip_sync_path=lip_sync_path,
        data_list=data_list,
    )
    if parsed_data["action"]:
        action_result = helper.handleAtmAction(parsed_data["action"])
        # call again if there are further actions
        data_list = handleAgentAction(
            action_result,
            data_list,
            agent,
            helper,
            output_path_mp3,
            output_path_wav,
            lip_sync_path,
        )
    else:
        print(data_list)
        return data_list


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
                    return
                case "vend":
                    atm_sys_info = f"{helper.loadAgent('Vend_Agent')}"
                    agent = Agent(system_info=atm_sys_info)
                    return

                case __:
                    agent = None
                    return

        if agent is None:
            raise "Agent was not specified"

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

        data_list = handleAgentAction(
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
        print(e)


if "__main__" == __name__:
    app.run()

from flask import Flask, request, jsonify
from agent.Agent import Agent
import os
import base64
from flask_cors import CORS
from dotenv import load_dotenv
from utilities.helpers import Helper

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


@app.route("/chat-agent", methods=["POST"])
async def chatAgent():
    agent = Agent()
    helper = Helper()

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

        # Generate agent's response
        response_message = agent.predict(message)

        data_list = []

        # get json data
        parsed_data = helper.getJsonData(response_message)

        # format response
        data_list = helper.prepResponseForClient(
            parsed_data=parsed_data,
            agent=agent,
            save_out_path=output_path_mp3,
            save_out_path_wav=output_path_wav,
            lip_sync_path=lip_sync_path,
            data_list=data_list,
        )
        if parsed_data["action"]:
            result = helper.handleCryptoInteraction(parsed_data["action"])
            blockchain_response = agent.predict(f"{result}")
            block_parsed_data = helper.getJsonData(blockchain_response)
            data_list = helper.prepResponseForClient(
                parsed_data=block_parsed_data,
                agent=agent,
                save_out_path=output_path_mp3,
                save_out_path_wav=output_path_wav,
                lip_sync_path=lip_sync_path,
                data_list=data_list,
            )
            print(result)

        # Return the response
        return jsonify({"messages": data_list})

    except Exception as e:
        print(e)


if "__main__" == __name__:
    app.run()

import os
import base64
import json
import subprocess
from pydub import AudioSegment
from sonic.sonic_operations import SonicOperations
import math


class Helper:
    tokens = {
        "USDT": os.environ["USDT_TOKEN_ADDRESS"],
    }

    vendorWallets = {
        "atm_vendor": os.environ["ATM_VENDOR"],
        "vend_vendor": os.environ["VEND_VENDOR"],
    }

    def __init__(self):
        """_summary_"""

    def loadAgent(agentName):
        """
        Load A Json file containin character Info
        """
        agent_file = f"/prompts/{agentName}.json"

        try:
            with open(agent_file, "r") as json_file:
                # Load the JSON data into a variable
                data = json.load(json_file)
                return data
        except FileNotFoundError:
            print(f"Error: The file at {agent_file} was not found.")
            return None
        except json.JSONDecodeError as e:
            print(f"Error: Failed to decode JSON. {e}")
            return None

    def convert_mp3_to_wav(self, input_file, output_file):
        try:
            # Load the MP3 file
            audio = AudioSegment.from_mp3(input_file)

            # Export as WAV file
            audio.export(output_file, format="wav")
            print(f"Conversion successful: {output_file}")
        except Exception as e:
            print(f"Error during conversion: {e}")

    def generate_lip_sync(self, audio_path, output_path, output_format="json"):
        """
        Generate lip sync data from an audio file using Rhubarb.

        :param audio_path: Path to the input audio file.
        :param output_path: Path to save the generated lip sync data.
        :param output_format: Format of the output file (default: "json").
        :return: True if successful, False otherwise.
        """
        try:
            # Construct the Rhubarb command
            command = ["rhubarb", audio_path, "-f", output_format, "-o", output_path]

            # Run the command
            result = subprocess.run(
                command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )

            # Output Rhubarb's response for debugging purposes (optional)
            print("Rhubarb output:", result.stdout.decode())
            return True

        except subprocess.CalledProcessError as e:
            # Print error output if the command fails
            print("Error during Rhubarb execution:", e.stderr.decode())
            return False
        except FileNotFoundError:
            print(
                "Error: Rhubarb executable not found. Make sure it is installed and added to PATH."
            )
            return False

    def load_json_file(self, file_path):
        """
        Open a JSON file and save its contents as a variable.

        :param file_path: Path to the JSON file.
        :return: The contents of the JSON file as a Python variable (dictionary or list).
        """
        try:
            with open(file_path, "r") as json_file:
                # Load the JSON data into a variable
                data = json.load(json_file)
                return data
        except FileNotFoundError:
            print(f"Error: The file at {file_path} was not found.")
            return None
        except json.JSONDecodeError as e:
            print(f"Error: Failed to decode JSON. {e}")
            return None

    def handleAtmAction(self, action):
        print(action, "Action hasbeen Carried Out")

        walletOwner = os.environ["USER_1_WALLET_ADDRESS"]
        crypto_operations = SonicOperations(
            os.environ["SONIC_TESTNET_RPC"],
            walletOwner,
            os.environ["USER_1_PRIVATE_KEY"],
        )

        match action["type"]:
            case "dispense":
                # fetch balance amount in atm
                # if amount is greater than withdrawal amount
                # call atm hardware api to dispense cash
                # else return "unable to dispense cash"
                return

            case "send":
                result = crypto_operations.transfer_tokens(
                    self.tokens[action["token"]],
                    self.vendorWallets[action["recipient"].lower()],
                    action["amount"],
                )
                return {"transactionHash": result.transactionHash.hex()}

            case _:
                return

    def audio_to_base64(self, file_path):
        """
        Converts an audio file to a Base64 string.
        :param file_path: Path to the audio file.
        :return: Base64 encoded string of the audio file.
        """
        try:
            with open(file_path, "rb") as audio_file:
                base64_audio = base64.b64encode(audio_file.read()).decode("utf-8")
            return base64_audio
        except FileNotFoundError:
            return None

    def prepResponseForClient(
        self,
        parsed_data,
        agent,
        save_out_path,
        save_out_path_wav,
        lip_sync_path,
        data_list,
    ):
        try:
            agent.generateVoice(parsed_data["response"], save_out_path)
            self.convert_mp3_to_wav(save_out_path, save_out_path_wav)
            self.generate_lip_sync(
                os.path.join(os.getcwd(), save_out_path_wav),
                os.path.join(os.getcwd(), lip_sync_path),
                "json",
            )
            lip_sync_json_data = self.load_json_file(lip_sync_path)
            base64_audio = self.audio_to_base64(save_out_path_wav)

            response_object = {
                "message": parsed_data["response"],
                "animation": parsed_data["interaction"]["animation"],
                "facialExpression": parsed_data["interaction"]["facial"],
                "audio": base64_audio,
                "lipsync": lip_sync_json_data,
                "action": parsed_data["action"],
            }
            if "transactionHash" in parsed_data:
                response_object["transactionHash"] = parsed_data["transactionHash"]

            if "atm_reciept" in parsed_data:
                response_object["atm_reciept"] = parsed_data["atm_reciept"]

            data_list.append(response_object)
            return data_list

        except (json.JSONDecodeError, ValueError) as e:
            # data_list = []
            print(e, "ERROR")
            error_audio_response_path = os.environ["AI_ERROR_VOICE"]
            error_json_lipSync_path = os.environ["AI_ERROR_LIPSYNC"]

            lip_sync_json_data = self.load_json_file(error_json_lipSync_path)
            base64_audio = self.audio_to_base64(error_audio_response_path)
            data_list.append(
                {
                    "message": "Error's Boss",
                    "animation": "Idle",
                    "facialExpression": "default",
                    "audio": base64_audio,
                    "lipsync": lip_sync_json_data,
                }
            )
            return data_list

    def getJsonData(self, response_message):
        parsed_data = json.loads(response_message)
        if not isinstance(parsed_data, object):
            raise ValueError("Expected a dictionary.")
        return parsed_data

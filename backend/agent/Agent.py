import os

from langchain_core.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)
from langchain_core.messages import SystemMessage
from groq import Groq
from langchain_groq import ChatGroq
from langchain.chains.llm import LLMChain
from utilities.helpers import Helper
from elevenlabs.client import ElevenLabs
from elevenlabs import save
import numpy
import warnings

assert numpy


sys_info = f"{Helper.loadAgent('ATM_Agent')}"


class Agent:
    chat_history = []

    def __init__(self, system_info=sys_info):
        """
        Agent Innitialization
        """
        # Get Groq API key
        groq_api_key = os.environ["GROQ_API_KEY"]
        model = os.environ["LLM_MODEL"]
        # Initialize Groq Langchain chat object and conversation
        self.groq_chat = ChatGroq(groq_api_key=groq_api_key, model_name=model)
        self.whisper = Groq(api_key=groq_api_key)

        self.system_prompt = system_info

    def predict(self, text_input):
        # If the user has asked a question,
        if text_input:
            prompt = ChatPromptTemplate.from_messages(
                [
                    SystemMessage(
                        content=self.system_prompt
                    ),  # This is the persistent system prompt that is always included at the start of the chat.
                    MessagesPlaceholder(
                        variable_name="chat_history"
                    ),  # This placeholder will be replaced by the actual chat history during the conversation. It helps in maintaining context.
                    HumanMessagePromptTemplate.from_template(
                        "{human_input}"
                    ),  # This template is where the user's current input will be injected into the prompt.
                ]
            )

            # Create a conversation chain using the LangChain LLM (Language Learning Model)
            conversation = LLMChain(
                llm=self.groq_chat,  # The Groq LangChain chat object initialized earlier.
                prompt=prompt,  # The constructed prompt template.
                verbose=False,  # TRUE Enables verbose output, which can be useful for debugging.
            )

            self.chat_history.append({"role": "human", "content": text_input})

            # Invoke the conversation with properly formatted arguments
            response = conversation.predict(
                chat_history=self.chat_history, human_input=text_input
            )

            print("RESPONSE", response)
            self.chat_history.append({"role": "ai", "content": response})

            return response

    def generateTextFromVoice(self, audio_path: str) -> str:
        """
        Records audio, saves it to a file, and transcribes it using OpenAI Whisper.
        """
        print("Loading Whisper model...")
        # model = whisper.load_model("turbo")

        print("Transcribing audio...", audio_path)
        # result = model.transcribe(audio_path, fp16=False)

        with open(audio_path, "rb") as file:
            transcription = self.whisper.audio.transcriptions.create(
                file=(audio_path, file.read()),
                model=os.environ["GROQ_WHISPER_MODEL"],
                response_format="verbose_json",
            )
            return transcription.text
        return "thank you"

    def generateVoice(
        self,
        text: str,
        audio_out_path: str = "./app/audio/out/ai_voice.mp3",
        voice="Charlotte",
    ) -> None:
        """
        Generates voice output using ElevenLabs API.
        """
        warnings.simplefilter("ignore", category=FutureWarning)
        client = ElevenLabs(
            api_key=os.environ["ELEVEN_LABS_API_KEY"],
        )
        audio = client.generate(
            text=text, voice=voice, model=os.environ["ELEVEN_LABS_MODEL"], stream=True
        )
        save(audio, audio_out_path)
        return audio

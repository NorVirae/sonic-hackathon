from fastapi import FastAPI, HTTPException, BackgroundTasks

from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import logging
import asyncio
import signal
import threading
from pathlib import Path
from src.cli import ZerePyCLI
from src.helpers.agent.helper import Helper
import os
import base64
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("server/app")


class ActionRequest(BaseModel):
    """Request model for agent actions"""

    connection: str
    action: str
    params: Optional[List[str]] = []


class ChatRequest(BaseModel):
    """Request model for agent actions"""

    name: str
    audio: str
    prompt: str


class ConfigureRequest(BaseModel):
    """Request model for configuring connections"""

    connection: str
    params: Optional[Dict[str, Any]] = {}


class ServerState:
    """Simple state management for the server"""

    def __init__(self):
        self.cli = ZerePyCLI()
        self.agent_running = False
        self.agent_task = None
        self._stop_event = threading.Event()

    def _run_agent_loop(self):
        """Run agent loop in a separate thread"""
        try:
            log_once = False
            while not self._stop_event.is_set():
                if self.cli.agent:
                    try:
                        if not log_once:
                            logger.info("Loop logic not implemented")
                            log_once = True

                    except Exception as e:
                        logger.error(f"Error in agent action: {e}")
                        if self._stop_event.wait(timeout=30):
                            break
        except Exception as e:
            logger.error(f"Error in agent loop thread: {e}")
        finally:
            self.agent_running = False
            logger.info("Agent loop stopped")

    async def start_agent_loop(self):
        """Start the agent loop in background thread"""
        if not self.cli.agent:
            raise ValueError("No agent loaded")

        if self.agent_running:
            raise ValueError("Agent already running")

        self.agent_running = True
        self._stop_event.clear()
        self.agent_task = threading.Thread(target=self._run_agent_loop)
        self.agent_task.start()

    async def stop_agent_loop(self):
        """Stop the agent loop"""
        if self.agent_running:
            self._stop_event.set()
            if self.agent_task:
                self.agent_task.join(timeout=5)
            self.agent_running = False


class ZerePyServer:
    def __init__(self):
        self.app = FastAPI(title="ZerePy Server")
        # Configure CORS
        origins = [
            "http://localhost:5173",  # Your frontend URL
            "http://localhost",
            "http://192.168.1.67:8000",  # Optionally add more origins if needed
        ]

        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,  # Allow these origins
            allow_credentials=True,
            allow_methods=["*"],  # Allow all methods
            allow_headers=["*"],  # Allow all headers
        )
        self.state = ServerState()
        self.setup_routes()

    def setup_routes(self):
        @self.app.get("/")
        async def root():
            """Server status endpoint"""
            return {
                "status": "running",
                "agent": self.state.cli.agent.name if self.state.cli.agent else None,
                "agent_running": self.state.agent_running,
            }

        @self.app.get("/agents")
        async def list_agents():
            """List available agents"""
            try:
                agents = []
                agents_dir = Path("agents")
                if agents_dir.exists():
                    for agent_file in agents_dir.glob("*.json"):
                        if agent_file.stem != "general":
                            agents.append(agent_file.stem)
                return {"agents": agents}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/agents/{name}/load")
        async def load_agent(name: str):
            """Load a specific agent"""
            try:
                self.state.cli._load_agent_from_file(name)
                return {"status": "success", "agent": name}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.get("/connections")
        async def list_connections():
            """List all available connections"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")

            try:
                connections = {}
                for (
                    name,
                    conn,
                ) in self.state.cli.agent.connection_manager.connections.items():
                    connections[name] = {
                        "configured": conn.is_configured(),
                        "is_llm_provider": conn.is_llm_provider,
                    }
                return {"connections": connections}
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.post("/agent/action")
        async def agent_action(action_request: ActionRequest):
            """Execute a single agent action"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")

            try:
                result = await asyncio.to_thread(
                    self.state.cli.agent.perform_action,
                    connection=action_request.connection,
                    action=action_request.action,
                    params=action_request.params,
                )
                return {"status": "success", "result": result}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/chat/atm/agent")
        async def chat_atm_agent(chat_request: ChatRequest):
            """Execute a single agent action"""
            if not self.state.cli.agent:
                self.state.cli._load_agent_from_file(chat_request.name)

            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")

            try:
                message = ""
                # Define output paths
                output_path_mp3 = os.path.join(
                    os.getcwd(), os.environ["OUTPUT_PATH_MP3"]
                )
                output_path_wav = os.path.join(
                    os.getcwd(), os.environ["OUTPUT_PATH_WAV"]
                )

                lip_sync_path = os.path.join(os.getcwd(), os.environ["LIPSYNC_PATH"])
                input_path_webm = os.path.join(
                    os.getcwd(), os.environ["INPUT_PATH_WEBM"]
                )

                helper = Helper()

                # print(data, "DUTS")
                # Ensure audio field exists in the request
                if chat_request.audio and chat_request.audio is not None:
                    # Extract the base64 audio data
                    audio_base64 = chat_request.audio
                    if not audio_base64:
                        raise HTTPException(
                            status_code=400, detail=str("Empty 'audio' field")
                        )

                    # Decode and save the audio file
                    with open(input_path_webm, "wb") as f:
                        f.write(base64.b64decode(audio_base64))

                    message = await asyncio.to_thread(
                        self.state.cli.agent.perform_action,
                        connection="whisper",
                        action="transcribe-audio",
                        params=[input_path_webm],
                    )

                elif "textInput" in chat_request:
                    message = chat_request.prompt

                data_list = []
                data_list = await helper.handleAgentAction(
                    message=message,
                    data_list=data_list,
                    agent=self.state.cli.agent,
                    helper=helper,
                    output_path_mp3=output_path_mp3,
                    output_path_wav=output_path_wav,
                    lip_sync_path=lip_sync_path,
                )
                # result_bal = await asyncio.to_thread(
                #     self.state.cli.agent.perform_action,
                #     connection="sonic",
                #     action="transcribe-audio",
                #     params=[
                #         "0x623787c0582026d6b13236268630Dd2c7a961BD4",
                #         "0xAF93888cbD250300470A1618206e036E11470149",
                #     ],
                # )

                # result = await self.state.cli.agent.prompt_llm(
                #     f"balance_usdt: {result_bal}"
                # )

                return {"status": "success", "messages": data_list}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/agent/start")
        async def start_agent():
            """Start the agent loop"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")

            try:
                await self.state.start_agent_loop()
                return {"status": "success", "message": "Agent loop started"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/agent/stop")
        async def stop_agent():
            """Stop the agent loop"""
            try:
                await self.state.stop_agent_loop()
                return {"status": "success", "message": "Agent loop stopped"}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

        @self.app.post("/connections/{name}/configure")
        async def configure_connection(name: str, config: ConfigureRequest):
            """Configure a specific connection"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")

            try:
                connection = self.state.cli.agent.connection_manager.connections.get(
                    name
                )
                if not connection:
                    raise HTTPException(
                        status_code=404, detail=f"Connection {name} not found"
                    )

                success = connection.configure(**config.params)
                if success:
                    return {
                        "status": "success",
                        "message": f"Connection {name} configured successfully",
                    }
                else:
                    raise HTTPException(
                        status_code=400, detail=f"Failed to configure {name}"
                    )

            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))

        @self.app.get("/connections/{name}/status")
        async def connection_status(name: str):
            """Get configuration status of a connection"""
            if not self.state.cli.agent:
                raise HTTPException(status_code=400, detail="No agent loaded")

            try:
                connection = self.state.cli.agent.connection_manager.connections.get(
                    name
                )
                if not connection:
                    raise HTTPException(
                        status_code=404, detail=f"Connection {name} not found"
                    )

                return {
                    "name": name,
                    "configured": connection.is_configured(verbose=True),
                    "is_llm_provider": connection.is_llm_provider,
                }

            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))


def create_app():
    server = ZerePyServer()
    return server.app

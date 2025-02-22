from src.server.client import ZerePyClient

client = ZerePyClient("http://0.0.0.0:8000")

# List available agents
agents = client.list_agents()

# Load an agent
client.load_agent("example")

# Execute an action
client.perform_action(
    connection="twitter",
    action="post-tweet",
    params={"text": "Hello from ZerePy!"}
)
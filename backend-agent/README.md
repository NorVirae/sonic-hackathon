# HardFi: Crypto to Cash Withdrawal ATM AI Agent

This Project is Boostrapped with Zerepy (https://github.com/blorm-network/ZerePy.git), Modified to support hardware calls and Recursive conversations using Recursive function calls for hardware and blockchain calls.

## Overview

This AI Agent system allows users to withdraw physical cash in exchange for CORAL tokens[Currently]. When a user requests a withdrawal via voice input, the AI agent processes the instruction, transfers the equivalent CORAL tokens to a vendor, and triggers a Raspberry Pi-based cash dispenser the user scanned to release the requested amount.

## How It Works

1. **Voice Input (WebM File):**
   - The user provides a voice instruction via the frontend (e.g., "Withdraw 5 dollars").
   - The WebM file is sent to the backend for processing.

2. **Speech-to-Text Processing:**
   - The WebM file is transcribed using the GROQ Whisper model.
   - The AI agent extracts the withdrawal amount from the transcribed text.

3. **Crypto Transaction Processing:**
   - The equivalent CORAL token amount is transferred from the user's wallet to the vendor's wallet.
   - The transaction is processed on Sonic, ensuring fast and efficient execution.

4. **Cash Dispensing:**
   - Upon successful transaction confirmation, the AI agent calls an API connected to a Raspberry Pi device.
   - The Raspberry Pi triggers the cash dispenser to release the requested amount.

## Requirements

### System Requirements
- Python 3.11 or higher
- Poetry 1.5 or higher

### Environment Variables
Ensure the following environment variables are properly configured:

```env
  The required env variable are provide in the /backend-agent/.env.example
```

## Installation

1. Install Poetry for dependency management:
   
   Follow the official instructions: [Poetry Installation Guide](https://python-poetry.org/docs/#installing-with-the-official-installer)

2. Clone the repository:

   ```bash
   git clone https://github.com/NorVirae/sonic-hackathon.git
   ```

3. Navigate to the directory:

   ```bash
   cd backend-agent
   ```

4. Install dependencies:

   ```bash
   poetry install --no-root
   ```

## Installing Rhubarb Lip Sync

To enable lip sync functionality, install Rhubarb Lip Sync as follows(the agent uses subprocess to call rhubarb app):

### Windows
1. Download the latest release of Rhubarb Lip Sync from the [official GitHub repository](https://github.com/DanielSWolf/rhubarb-lip-sync/releases).
2. Extract the ZIP file to a desired location.
3. Add the extracted folder to your system `PATH` (optional but recommended for easier access).

### macOS (via Homebrew)
```bash
brew install rhubarb-lip-sync
```

### Linux
1. Download the latest release from [GitHub](https://github.com/DanielSWolf/rhubarb-lip-sync/releases).
2. Extract the files and move them to `/usr/local/bin` for global access:
   ```bash
   sudo mv rhubarb /usr/local/bin/
   ```
3. Ensure Rhubarb is executable:
   ```bash
   chmod +x /usr/local/bin/rhubarb
   ```

### Verification
To verify the installation, run:
```bash
rhubarb --version
```
If installed correctly, the version number will be displayed.

## Usage
1. cd 
1. Run the application:

   ```bash
   poetry run python main.py
   ```

## Configuring the AI Agent

To enable the crypto-to-cash withdrawal feature, at the 
"/backend-agent/agents" folder. 

There is a atm.json that has got all the configurations, that enable the agent to carry out this task:

```json
{
  // json
}
```

## API Integration

### Communicating with the AI Agent

The frontend communicates with the AI agent using the following API route:

#### Endpoint: `/chat/atm/agent`
- **Method:** `POST`
- **Payload:**

```json
{
  "name": "UserName",
  "prompt": "Withdraw 5 dollars",
  "audio": "base64_encoded_audio"
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Request processed successfully"
}
```

### Cash Dispensing API (Raspberry Pi) RPC calls

#### Endpoint: `/dispense`
- **Method:** `POST`
- **Payload:**

```json
{
  "vendor_id": "ATM_VENDOR",
  "amount": 5
}
```

- **Response:**

```json
{
  "status": "success",
  "message": "Cash dispensed successfully"
}
```

## Conclusion
This modified version of ZerePy allows users to withdraw physical cash using CORAL tokens. By integrating Sonic for transaction execution, GROQ for voice processing, and Raspberry Pi for cash dispensing, the system ensures a seamless and efficient crypto-to-cash withdrawal experience.

## Future Enhancements
- Lightening Fast Interactions by hosting Live servers
- Multi-currency support for withdrawals
- Biometric authentication for added security
- AI-powered fraud detection mechanisms
- Enhanced vendor management system


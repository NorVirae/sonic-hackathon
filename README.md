# HARDFI: 3D Interactive Crypto to Cash Withdrawal ATM AI Agent
## Table of Contents
- [Overview](#overview)
- [How It Works](#how-it-works)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Hardware Setup](#hardware-setup)
- [API Integration](#api-integration)
- [Future Enhancements](#future-enhancements)

---

## Overview
This system enables users to withdraw physical cash using CORAL tokens Note: we are working on supporting mutltiple tokens in the future. When a user requests a withdrawal via voice input, the AI agent processes the instruction, transfers the equivalent CORAL tokens to a vendor, and triggers a Raspberry Pi-based cash dispenser to release the requested amount.

![alt text](image.png)

## Demo Video
[![Watch the video](https://img.youtube.com/vi/YQTuKQv2V7s/0.jpg)](https://www.youtube.com/watch?v=YQTuKQv2V7s)


## How It Works
1. **Voice Input (WebM File)**
   - User provides a voice instruction (e.g., "Withdraw 5 dollars").
   - The WebM file is sent to the backend for processing.

2. **Speech-to-Text Processing**
   - The GROQ Whisper model transcribes the WebM file.
   - The AI extracts the withdrawal amount from the text.

3. **Crypto Transaction Processing**
   - The equivalent CORAL token amount is transferred to the vendor.
   - Transactions are executed via Sonic blockchain.

4. **Cash Dispensing**
   - The AI agent calls an API linked to a Raspberry Pi.
   - The Raspberry Pi triggers a cash dispenser to release the amount.

---

## Backend Agent Setup
The Backend Project is A Zerepy AI agent Boostrap
```git clone https://github.com/blorm-network/ZerePy.git``` to get the project

##### Visit for detailed Info on the Backend-agent
([backend-agent-docs](https://github.com/NorVirae/sonic-hackathon/blob/main/backend-agent/README.md))

### System Requirements
- Python 3.11+
- Poetry 1.5+

### Installation
1. **Install Poetry** ([Guide](https://python-poetry.org/docs/#installing-with-the-official-installer))
1. **Install Conda** ([Guide](https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html))

2. **Clone the repository:**
   ```bash
   git clone https://github.com/NorVirae/sonic-hackathon.git
   ```
3. **Navigate to the backend directory:**
   ```bash
   cd backend-agent
   ```

4. **Create your virtual Env:**
   ```bash
    conda create --name my_env python=3.11
   ```

5. **Activate Conda:**
```bash
    conda acitvate my_env
```

6. **Install dependencies:**
   ```bash
   poetry install --no-root
   ```

### Running the Backend
```bash
poetry run python main.py
```

### Configuring the AI Agent
The configuration is stored in `/backend-agent/agents/atm.json`, which contains transaction settings and ATM behavior.



---

## Frontend Setup
### Prerequisites
- Node.js (Latest LTS recommended)
- Yarn

##### Visit for detailed Info on the frontend
([frontend-docs](https://github.com/NorVirae/sonic-hackathon/blob/main/frontend/README.md))

### Installation
1. **Install Yarn (if not installed):**
   ```sh
   npm install -g yarn
   ```
2. **Navigate to the frontend directory:**
   ```sh
   cd frontend
   ```
4. **Create .env file and update with ENV VARS on /env.example**
   ```sh
   VITE_API_URL=<BACKEND-AGENT-API-URL>
   ```
3. **Install dependencies:**
   ```sh
   yarn install
   ```
4. **Start the development server:**
   ```sh
   yarn dev
   ```

### QR Code Setup
To generate a QR code linking to the ATM system:
1. Open `/frontend/src/pages/CreateQRCode.jsx`
2. Modify the QRCode component's `value` to point to `/atm`.
3. Visit `http://<your-ip>:port/create-qr` to generate a QR code.

---


## Hardware Setup
##### visit for detailed Info on the Hardware
([hardware-docs](https://github.com/NorVirae/sonic-hackathon/blob/main/hardware/README.md))

**Project code location:**
   ```sh
   cd hardware
   ```
### Components
- **Raspberry Pi Zero 2W:** Runs a Flask server and processes transactions.
- **Arduino Uno:** Controls servos for dispensing cash.
- **360-degree Continuous Rotation Servos (x2):** Dispenses cash.

### Wiring Connections
- **Raspberry Pi to Arduino:** USB serial communication.
- **Arduino to Servos:**
  - Servo 1: Pin `9`
  - Servo 2: Pin `10`
  - Power: `5V` and `GND`

### Running the Hardware
1. **Upload the Arduino script:**
   - Open the script in Arduino IDE.
   - Select `Arduino Uno` as the board.
   - Upload the script.

2. **Start the Flask server:**
   ```sh
   python app.py
   ```
3. **Expose API publicly (optional, using Ngrok):**
   ```sh
   ngrok http 5000
   ```

---

## API Integration
### Communicating with the AI Agent
#### Endpoint: `/chat/atm/agent`
- **Method:** `POST`
- **Payload:**
  ```json
  {
    "name": "atm" ,//gets the agent file "atm.json"
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

### Cash Dispensing API (Raspberry Pi)
### 1. `/fetch/balance` (POST)
**Returns the current balance of the ATM.**

#### Response:
```json
{
  "status": "success",
  "balance": 50
}
```

### 2. `/control` (POST)
**Controls the servos based on user input.**

#### Request Body:
```json
{
  "direction": "1",  // 1 for forward, 2 for backward
  "speed": 90,  // Speed value (0-180)
  "rotate_time": 3000  // Duration in milliseconds
}
```

#### Response:
```json
{
  "status": "success",
  "message": "Moving 1 at speed 90 for 3000 ms"
}
```


---

## Future Enhancements
- Lightening Fast Interactions by hosting Live servers
- Multi-currency support
- Biometric authentication
- AI-powered fraud detection
- Enhanced vendor management

This documentation covers the complete setup for the ZerePy AI-powered crypto ATM. For more details, refer to the source code and additional documentation files.


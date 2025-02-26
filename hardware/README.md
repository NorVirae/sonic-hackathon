# HARDFI Hardware Documentation
**Project code location:**
   ```sh
   cd hardware
   ```
## Overview
Hard FI crypto ATM system consists of a Raspberry Pi Zero 2W, an Arduino Uno, and two 360-degree servos. The system facilitates crypto withdrawals by converting digital currency transactions into physical cash dispensing. The Raspberry Pi Zero 2W manages transaction processing and communicates with the Arduino Uno, which controls servo motors responsible for dispensing cash.

---

## Hardware Components

### 1. Raspberry Pi Zero 2W
- Serves as the central processing unit of the ATM.
- Runs a Flask server that communicates with the Arduino Uno.
- Handles API calls and processes transaction requests.
- Interfaces with external payment processing systems for crypto transactions.
- Communicates with the Arduino via serial communication.

### 2. Arduino Uno
- Controls the servo motors responsible for dispensing cash.
- Receives movement commands from the Raspberry Pi through serial communication.
- Parses received commands and controls servo speeds and directions accordingly.

### 3. 360-degree Continuous Rotation Servos (x2)
- Used for dispensing cash by rotating in a controlled manner.
- Controlled via PWM signals from the Arduino Uno.
- Operate at speed values between 0 and 180 degrees (90 being the stop position).

### 4. Serial Communication Setup
- The Raspberry Pi communicates with the Arduino via USB serial interface.
- The Arduino processes the serial input and converts it into servo movement.
- The baud rate is set to `9600` to ensure stable data transfer.

---

## Wiring Diagram & Pin Connections

### 1. Raspberry Pi Zero 2W to Arduino Uno
- Connect Raspberry Pi USB port to Arduino’s USB port for serial communication.
- The Raspberry Pi runs a Python-based Flask server that sends control signals to the Arduino.

### 2. Arduino Uno to Servo Motors
- **Servo 1:** Connected to Pin `9` on Arduino.
- **Servo 2:** Connected to Pin `10` on Arduino.
- **Power:** Servos are powered by the Arduino's `5V` and `GND` pins.
- **PWM Control:** Servo angles are controlled using the `Servo.write(angle)` function in the Arduino code.

---

## Operational Workflow

### 1. Transaction Processing
1. A user initiates a crypto withdrawal request.
2. The Raspberry Pi validates the transaction via API.
3. Once validated, the Flask server sends movement commands (direction, speed, and duration) to the Arduino.
4. The Arduino processes these commands and controls the servos accordingly.
5. Cash is dispensed based on the calculated amount.

### 2. Servo Control Logic
- **Direction 1 (Forward):** One servo rotates clockwise, the other counterclockwise.
- **Direction 2 (Backward):** The servos rotate in opposite directions.
- **Speed Control:** The speed is set between `0-180`, where `90` is neutral (stop).
- **Duration Control:** The servos rotate for a specific time before stopping.

---

## API Endpoints

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

## How to Run the Arduino Code
1. Install the Arduino IDE from [Arduino's official website](https://www.arduino.cc/).
2. Connect the Arduino Uno to your computer via USB.
3. Open the provided Arduino script in the Arduino IDE.
4. Select the correct board (`Arduino Uno`) and port from the `Tools` menu.
5. Click `Upload` to flash the code onto the Arduino.
6. Open the Serial Monitor (set baud rate to `9600`) to debug or monitor commands.

---

## How to Set Up and Run the Flask Server
1. Clone the repository:
```sh
git clone <repo-url>
cd <repo-folder>
```
2. Create a virtual environment and activate it:
```sh
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate  # On Windows
```
3. Install dependencies:
```sh
pip install -r requirements.txt
```
4. Run the Flask server:
```sh
python app.py
```
5. The Flask API should now be running at `http://0.0.0.0:5000`.

---

## Using Ngrok for Public API Access
**To expose the Flask API to the internet, use Ngrok for tunneling.**

### 1. Install Ngrok:
```sh
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```
Alternatively, download it from [Ngrok's official site](https://ngrok.com/download).

### 2. Authenticate Ngrok:
```sh
ngrok authtoken <your-ngrok-auth-token>
```

### 3. Run Ngrok to expose Flask API:
```sh
ngrok http 5000
```

### 4. Copy the generated public URL and use it to access your API remotely.

---

## Hardware Considerations & Future Improvements
- **Power Management:** Ensure the servos receive adequate power to prevent stalling.
- **Cash Handling Mechanism:** Design a holder for precise dispensing.
- **Error Handling:** Implement status feedback from Arduino to Raspberry Pi for real-time monitoring.
- **Security Features:** Integrate additional authentication mechanisms to prevent unauthorized use.

This documentation provides an overview of the hardware components and their role in the crypto ATM system. For further details, refer to the source code and integration guides.


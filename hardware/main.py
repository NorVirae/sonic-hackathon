from flask import Flask, request, jsonify
import serial
import time
import glob

app = Flask(__name__)
balance = 50
# Function to detect the Arduino serial port dynamically
def find_arduino_port():
    possible_ports = glob.glob("/dev/ttyACM*") + glob.glob("/dev/ttyUSB*")
    return possible_ports[0] if possible_ports else None

# Function to initialize the serial connection
def init_serial():
    arduino_port = find_arduino_port()
    if arduino_port:
        return serial.Serial(arduino_port, 9600, timeout=1)
    return None

# Initialize the Arduino connection
arduino = init_serial()

@app.route('/fetch/balance', methods=['POST'])
def fetch_balance():
    global balance
    return jsonify({"status": "success", "balance": balance})

@app.route('/control', methods=['POST'])
def control_servo():
    global arduino
    global balance

    if not arduino or not arduino.is_open:
        arduino = init_serial()
        if not arduino:
            return jsonify({"error": "Arduino not found"}), 500

    try:
        # Get direction, speed, and duration from request
        data = request.json
        direction = str(data.get("direction", ""))
        speed = int(data.get("speed", 90))  # Default speed is 90 (stop)
        rotate_time = int(data.get("rotate_time", 0))

        if direction not in ["1", "2"] or rotate_time <= 0 or speed < 0 or speed > 180:
            return jsonify({"error": "Invalid input"}), 400

        # Send command to Arduino
        command = f"{direction},{speed},{rotate_time}\n"
        arduino.write(command.encode())  # Convert to bytes and send
        arduino.flush()
        arduino = init_serial()
        balance -= (rotate_time / 1000)

        return jsonify({"status": "success", "message": f"Moving {direction} at speed {speed} for {rotate_time} ms"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

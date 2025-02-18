from flask import Flask, request, jsonify
import Adafruit_PCA9685

app = Flask(__name__)

# Initialize the PCA9685 using the default address (0x40)
pwm = Adafruit_PCA9685.PCA9685()

# Set frequency to 50hz, good for servos.
pwm.set_pwm_freq(50)

# Servo pulse length (min and max) for 0 to 180 degrees
SERVO_MIN = 150  # Min pulse length out of 4096
SERVO_MAX = 600  # Max pulse length out of 4096

def set_servo_angle(channel, angle):
    pulse = int(SERVO_MIN + (angle / 180.0) * (SERVO_MAX - SERVO_MIN))
    pwm.set_pwm(channel, 0, pulse)

@app.route('/move_servo', methods=['POST'])
def move_servo():
    data = request.json
    channel = data.get('channel')
    angle = data.get('angle')
    
    if channel is None or angle is None:
        return jsonify({"error": "Missing channel or angle"}), 400
    
    if not (0 <= angle <= 180):
        return jsonify({"error": "Angle must be between 0 and 180"}), 400
    
    set_servo_angle(channel, angle)
    return jsonify({"status": "success", "channel": channel, "angle": angle})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
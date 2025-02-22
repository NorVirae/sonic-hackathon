#include <Servo.h>

// Create servo objects
Servo servo1;  
Servo servo2;  

// Pin definitions
const int SERVO1_PIN = 9;  
const int SERVO2_PIN = 10;  

void setup() {
  servo1.attach(SERVO1_PIN);
  servo2.attach(SERVO2_PIN);
  
  Serial.begin(9600);
  Serial.println("Dual 360 Degree Servo Control with Speed");
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');  // Read full input line
    input.trim();  // Remove whitespace

    int firstComma = input.indexOf(',');
    int secondComma = input.indexOf(',', firstComma + 1);

    if (firstComma != -1 && secondComma != -1) {
      String dirStr = input.substring(0, firstComma);
      String speedStr = input.substring(firstComma + 1, secondComma);
      String timeStr = input.substring(secondComma + 1);

      int direction = dirStr.toInt();
      int speed = speedStr.toInt();
      int duration = timeStr.toInt();

      if (speed < 0 || speed > 180) {
        Serial.println("Error: Speed out of range (0-180)");
        return;
      }

      if (direction == 1) {  // Forward
        servo1.write(180 - speed);
        servo2.write(speed);
        Serial.println("Moving forward at speed " + String(speed));
      } 
      else if (direction == 2) {  // Backward
        servo1.write(speed);
        servo2.write(180 - speed);
        Serial.println("Moving backward at speed " + String(speed));
      } 
      else {
        Serial.println("Invalid direction");
        return;
      }

      delay(duration);
      servo1.write(90);  // Stop
      servo2.write(90);
      Serial.println("Stopped");
    }
  }
}

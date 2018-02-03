# IoT_NodeMCU_ESP8266
This repository contains source code necessary to launch an Node.js server and NodeMCU with ESP8266 and DHT22. 

#### Our server domain: http://szustakowses.nazwa.pl/
#### Our server address to save data: http://szustakowses.nazwa.pl/saveData?temp=[some_value]&humidity=[some_value]

### Simple diagram of our system:
![Alt text](Images/sys_scheme.png?raw=true "Scheme")

## Nginx
HTTP proxy server that redirects all requests from the address "szustakowses.nazwa.pl" on port 80 to the address of the Node.js server implemented on port 3400.

## Node.js 
This is a design environment based on Google's V8 JavaScript engine. In this environment, we create a web server, server scripts and any auxiliary functions of web applications.

## Express
This module acts as a web server and extends the Node.js environment to provide several key components to handle web requests.

## MongoDB
It is an efficient NoSQL database with very efficient scalability. In this database we collect data such as temperature and humidity, which are sent from the NodeMCU module by HTTP request - GET.

## ESP8266 NodeMCU
NodeMCU is an open source IoT platform. It includes firmware which runs on the ESP8266 Wi-Fi SoC. 

### How to program NodeMCU by Arduino IDE
1. Firstly download and open the Arduino IDE
2. Go to files and click on the preference in the Arduino IDE
3. Copy the below code in the Additional boards Manager
http://arduino.esp8266.com/stable/package_esp8266com_index.json
click OK to close the preference Tab.
4. After completing the above steps , go to Tools and board, and then select board Manager
5. Navigate to esp8266 by esp8266 community and install the software for Arduino.
6. Program NodeMCU_ESP8266 with Arduino IDE using our code in folder NodeMCU.

Module collects data from the DHT22 sensor and sends them with a GET request to the WWW server. The correct data recording is signaled by blinking of the green diode and failure by red. In addition, the current temperature status is signaled by the color of the RGB diode.

### GET Request
```c++
...
const char* nodejs_ip = "szustakowses.nazwa.pl";
....
res_status = send_get(cl, "saveData?temp=" + temperature + "&humidity=" + humidity);
...
bool send_get(WiFiClient cl, String msq_GET){
  HTTPClient http;
  http.begin("http://" + (String)nodejs_ip + "/" + (String)msq_GET);
  ...
```

### Board scheme:
![Alt text](Images/BoardScheme.png?raw=true "Board_scheme")

### DHT22
Temperature and Humidity Sensor. Here are the pin definitions:

| Pin  | Symbol         | NodeMCU pin | Descriptions                               |
| ---: |     :---:      |   :---:  |                                          :--- |
| 1    | VCC            |  3V3        |    Power supply 3.3V from NodeMCU             |
| 2    | DOUT           |   D1 + 3V3      |    D1 - Data output, 3V3 - 4,7kΩ Resistor to Power   |
| 3    | NC             |  -        | Not use                                    |
| 4    | GND            |  G        |Ground                               |

### Led RGB
RGB diode with common anode is activated by pwm signal on particular pins corresponding to the color of light.
```c++
void setup() {
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);
}
  //Only red color is powered
  analogWrite(red, 0);
  analogWrite(green, 1000);
  analogWrite(blue, 1000);
```

| Pin  | Symbol     | NodeMCU pin | Descriptions |
| ---: |     :---:  |  :---:  |        :--- |
| 1    | RED        |  D3  |Resistor 150Ω  |
| 2    | GND        |  G |Ground    |
| 3    | BLUE       |  D5  |Resistor 100Ω     |
| 4    |   GREEN    |  D4  |Resistor 100Ω     |

## Server environment
![Alt text](Images/sys.jpg?raw=true "sys.jpg")

### How to install
1. Install Nginx on your server and copy our configuration file "Nginx/conf.d/szustakowses.nazwa.pl.conf" to your conf.d folder.
2. Install Node JS and ExpressJS via npm
3. Install MongoDB
4. Install and use FusionChart Library
5. Copy our files from Node.js folder to your server
6. Run and send some data from NodeMCU

### Our database:
![Alt text](Images/DB_console.png?raw=true "DB_console.png")

### Our chart:
![Alt text](Images/chart.jpg?raw=true "chart.jpg")


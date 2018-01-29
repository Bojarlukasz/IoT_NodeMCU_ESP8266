# IoT_NodeMCU_ESP8266

## Node.js 
This is a design environment based on Google's V8 JavaScript engine. In this environment, we create a web server, server scripts and any auxiliary functions of web applications.

## MongoDB
It is an efficient NoSQL database with very efficient scalability. In this database we collect data such as temperature and humidity, which are sent from the NodeMCU module by HTTP request - GET.

## Express
This module acts as a web server and extends the Node.js environment to provide several key components to handle web requests.

## Nginx
HTTP proxy server that redirects all requests from the address "szustakowses.nazwa.pl" to the address of the Node.js server implemented on port 3400.

## ESP8266 NodeMCU
NodeMCU is an open source IoT platform. It includes firmware which runs on the ESP8266 Wi-Fi SoC. 
Module collects data from the DHT22 sensor and sends them with a GET request to the WWW server. The correct data recording is signaled by blinking of the green diode and failure by red. In addition, the current temperature status is signaled by the color of the RGB diode.

## DHT22
Temperature and Humidity Sensor. Here are the pin definitions:

| Pin  | Symbol | Descriptions |
| ---: |     :---:      |          :--- |
| 1    | VCC            | Power supply 3.3V from NodeMCU   |
| 2    | DOUT       | Data output, connected to the pin SDA.     |
| 3    | NC       | Not use     |
| 4    | GND      |Ground     |

## Simple diagram of system:

![Alt text](Images/scheme.png?raw=true "Scheme")


#include <DHT.h>
#include "DHT.h"
#define DHTTYPE DHT22 

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

#define LED D2
#define LEDG D0

#define DHT22_PIN D1

#define red D3
#define green D4
#define blue D5

DHT dht(DHT22_PIN, DHTTYPE);

WiFiServer server(80);
WiFiClientSecure sslClient;

bool res_status = false;

//dht22
int status_led = 0;
String temperature = ""; 
String humidity = ""; 

const unsigned long dhtMinutes = 1 * 60 * 1000UL; // 5 min

int led_rgb_activated = 1;
int LIMIT_ODCZYTOW = 6;

const char* ssid = "your_ssid";
const char* password = "your_password";

const char* nodejs_ip = "your_server_ip_address";
const int nodejs_port = 80; // your_port_number

void setup() {
  Serial.begin(115200);
  pinMode(LED, OUTPUT);
  pinMode(LEDG, OUTPUT);

  digitalWrite(LED, LOW);
  digitalWrite(LEDG, LOW);

  //Led RGB
  pinMode(red, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(blue, OUTPUT);
  
  dht.begin();
  
  // Connect to WiFi network
  Serial.println();
  Serial.print("Connecting to: ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
 
  // Start the server
  server.begin();
  Serial.println("Server started at...");
  Serial.println(WiFi.localIP());
  start_led();
}
 
void loop() { 
  
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
  }else{
    Serial.println("Client visit Website !");
  }  
 
  // Read the first line of the request
  String req = client.readStringUntil('\r');
  client.flush();
 
  // Return the response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: text/html");
  client.println("Connection: close");
  client.println(""); 

  client.println("<!DOCTYPE HTML>");
  client.println("<HTML>");
  client.println("<head>");
   
  if (req.indexOf("/ledoff") != -1)  {
      status_led=0;
      digitalWrite(LED, LOW);
      Serial.println("LED OFF");
      client.println("<h1>OFF</h1>");
    }
  else if(req.indexOf("/ledon") != -1)
    {
      status_led=1;
      digitalWrite(LED,HIGH);
      Serial.println("LED ON");
      client.println("<h1>ON</h1>");
    }
  
  client.println("</body>");
  client.println("</html>");

 static unsigned long lastSampleTimeDht = 0 - dhtMinutes;
 unsigned long now = millis();
 if (now - lastSampleTimeDht >= dhtMinutes){
  lastSampleTimeDht += dhtMinutes;

  //Reading DHT22
  Serial.println("__GET - DHT22");
  res_status = read_dht22(client);

  signalizes_status(res_status);
  
 }
  delay(10);
 
}


void start_led(){
  for(int i=0; i<=6; i++){
  digitalWrite(LEDG, HIGH);
  delay(100);
  digitalWrite(LEDG, LOW);
  delay(100);
  }
  digitalWrite(LEDG, HIGH);
  delay(500);
  digitalWrite(LEDG, LOW);
}

void signalizes_status(bool stat){
  if(stat){
    digitalWrite(LEDG, HIGH);
    delay(200);
    digitalWrite(LEDG, LOW);
    delay(200);
    digitalWrite(LEDG, HIGH);
    delay(200);
    digitalWrite(LEDG, LOW);
  }else{
    digitalWrite(LED, HIGH);
    delay(200);
    digitalWrite(LED, LOW);
    delay(200);
    digitalWrite(LED, HIGH);
    delay(200);
    digitalWrite(LED, LOW);
  }
  
}
 




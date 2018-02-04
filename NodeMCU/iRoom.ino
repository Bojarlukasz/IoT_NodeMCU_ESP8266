#include <DHT.h>
#include "DHT.h"

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define LED D2
#define LEDG D0

#define red D3
#define green D4
#define blue D5

#define DHTTYPE DHT22 
#define DHT22_PIN D1

DHT dht(DHT22_PIN, DHTTYPE);

WiFiServer server(80);

bool res_status = false;

//dht22
int status_led = 0;
String temperature = ""; 
String humidity = ""; 

const unsigned long dhtMinutes = 1 * 60 * 1000UL;
const unsigned long dhtMinutes2 = 15 * 1000UL;

int led_rgb_activated = 1;
int LIMIT_ODCZYTOW = 6;

const char* ssid = "_your_wifi_ssid_";
const char* password = "_your_password_to_wifi_";

const char* nodejs_ip = "szustakowses.nazwa.pl";
const int nodejs_port = 80;

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

 static unsigned long lastSampleTime = 0 - dhtMinutes2;
 unsigned long now2 = millis();
 if (now2 - lastSampleTime >= dhtMinutes2){
  lastSampleTime += dhtMinutes2;

  led_on_off(nodejs_ip);
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

void led_on_off(String nodejs_ip){
  HTTPClient http;
      http.begin("http://" + (String)nodejs_ip + "/switchState");
      http.addHeader("Content-Type", "text/plain");
      http.GET();   //Send the request
      String payload = http.getString();  //Get the response payload
      Serial.println(payload);    //Print request response payload
      http.end();
      Serial.println(payload);
  if(payload == "ON"){
    digitalWrite(LED, HIGH);
  }else{
    digitalWrite(LED, LOW);
  }
 
}



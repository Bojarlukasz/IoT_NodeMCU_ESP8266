bool read_dht22(WiFiClient cl){
  //Reading DHT22
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  
  rgb(t);
  
  humidity = String(h);
  temperature = String(t);
  Serial.println(humidity + " %");
  Serial.println(temperature + " *C");
  
  res_status = send_get(cl, "GET /saveData?temp=" + temperature + "&humidity=" + humidity + " HTTP/1.1");

  return res_status;
}



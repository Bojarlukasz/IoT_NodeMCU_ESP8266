bool send_get(WiFiClient cl, String msq_GET){
  
  if(msq_GET != ""){
    String ip = "";

   if(cl.connect(nodejs_ip, nodejs_port)) {
      
      Serial.println("connected to Nodejs");
      
        //doesnt work on mobile phone wifi-router
      //cl.println("GET /" + msq_GET + " HTTP/1.1");
      //cl.println("Host: " + (String)nodejs_ip);
      //cl.println("Connection: close");
      //cl.println();
      //String req = cl.readStringUntil('\r');
      //cl.flush();
      //Serial.println(req);

      HTTPClient http;
      http.begin("http://" + (String)nodejs_ip + "/" + (String)msq_GET);
        //http.setAuthorization("user", "password");
        //http.addHeader("Content-Type", "application/x-www-form-urlencoded");
        //http.POST("title=foo&body=bar&userId=1");
      http.addHeader("Content-Type", "text/plain");
      int httpCode = http.GET();   //Send the request
      String payload = http.getString();  //Get the response payload
      Serial.println(httpCode);   //Print HTTP return code
      Serial.println(payload);    //Print request response payload
      http.end();

      if(httpCode == 200){
        return true;
      }else{
        return false;
      }
      
      
    } else {
      Serial.println("connection failed - Nodejs");
      return false;
    }

  }

}

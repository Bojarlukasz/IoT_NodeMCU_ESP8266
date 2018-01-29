bool send_get(WiFiClient cl, String who, String msq_GET){
  
  if(msq_GET != "" and who != ""){
    String ip = "";

   if(cl.connect(nodejs_ip, nodejs_port)) {
      
      Serial.println("connected to Nodejs");
      cl.println(msq_GET);
      cl.println("Host: " + (String)nodejs_ip);
      cl.println("Connection: close");
      cl.println();

      String req = cl.readStringUntil('\r');
      cl.flush();

      Serial.println(req);

      if(req == "HTTP/1.1 200 OK"){
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

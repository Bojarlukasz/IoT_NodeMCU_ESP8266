void rgb(float temp){
  
  if(led_rgb_activated == 1){
    
    if(temp >= 22.0){
      analogWrite(red, 0);
      analogWrite(green, 1000);
      analogWrite(blue, 1000);
    }else if(temp < 22.0 && temp >= 20.9){
      analogWrite(red, 0);
      analogWrite(green, 0);
      analogWrite(blue, 1000);
    }else if(temp < 20.9 && temp >= 20.0){
      analogWrite(red, 1000);
      analogWrite(green, 0);
      analogWrite(blue, 1000);
    }else if(temp < 20.0 && temp >= 19.0){
      analogWrite(red, 1000);
      analogWrite(green, 0);
      analogWrite(blue, 0);
    }else if(temp < 19.0 && temp >= 17.0){
      analogWrite(red, 1000);
      analogWrite(green, 1000);
      analogWrite(blue, 0);
    }else if(temp < 17.0){
      analogWrite(red, 0);
      analogWrite(green, 1000);
      analogWrite(blue, 0);
    }
    
  }
  
}


var tempStyle = document.createElement('div').style,
vendors       = ['webkit','Moz','ms','O'],
vendor        = '', 
lastTime      = 0,
tempV         = '';

for (i = 0; i < vendors.length; i++ ) {
  tempV = vendors[i];
  if (!vendor && (tempV + 'Transform') in tempStyle ) {
      vendor = tempV;
  }
  tempV = tempV.toLowerCase();
  
  if(!window.requestAnimationFrame) {
      window.requestAnimationFrame = window[tempV+'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[tempV+'CancelAnimationFrame'] 
                         || window[tempV+'CancelRequestAnimationFrame'];
  }
}

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime(),
            timeToCall = Math.max(0, 16 - (currTime - lastTime)),
            id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

if (!window.cancelAnimationFrame){
  window.cancelAnimationFrame = function(id) { clearTimeout(id); };
}
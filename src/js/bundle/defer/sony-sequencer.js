// Sony Sequencer 
// ------------
//
// * **Description:** A utility to allow control of method execution
// * **Version:** 0.1
// * **Modified:** 01/01/2013
// * **Author:** Telly Koosis, Tyler Madison
// * **Dependencies:** None
//
// *Example Usage:*
//
//     var self = this, // scope
//         self.speed  = 200, // speed in ms
//         theSequence = new Sequencer(); // instance
//  
//     // first action
//     theSequence.add( self, self.methodName1, self.speed ); 
//
//     // second action
//     theSequence.add( self, self.methodName2, self.speed + 100 ); 
//
//     // last action
//     // functionParameters = {"foo":"bar"}
//     theSequence.add( self, self.methodLast, self.speed, functionParameters ); 
//
//     // start the sequence
//     theSequence.start();


(function(window, undefined){

  function Sequencer(){
    var t = this;
    t.queue = null;
    t.timer = -1;
  }

  Sequencer.prototype.add = function(s , m , d , a) {
    var t = this;
    if( t.queue === null ) { t.queue = [];}
    t.queue.push({ scope: s, method: m, throttle: d, args: a });
  };

  Sequencer.prototype.start = function() {
    var t = this;
    if(t.timer === -1){
      if(t.queue.length > 0){
        var o = t.queue.shift();
        t.timer = setTimeout(function(){
          var restartTime = o.method.apply(o.scope , o.args);
          if(restartTime === undefined){
            t.timer = -1;
            t.start();
          }else{
            t.timer = -1;
            setTimeout(function(){t.start();} , restartTime);
          }
        } , o.throttle);
      }else{
        t.destroy();
      }
    }
  };

  Sequencer.prototype.stop = function(){
    var t = this;
    clearTimeout(t.timer);
    t.timer = -1;
  };

   Sequencer.prototype.destroy = function(){
    var t = this;
    t.queue = [];
    t.queue = null;
   };

   window.Sequencer = Sequencer;


  })(window, undefined);
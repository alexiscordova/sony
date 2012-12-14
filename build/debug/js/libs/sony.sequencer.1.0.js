// ------------ Sony Sequencer ------------
// Module: Sony Sequencer
// Version: 1.0
// Modified: 2012-12-14 by Tyler Madison, Telly Koosis
// Dependencies: N/A at this point
// -------------------------------------------------------------------------

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
          var restartTime = o.scope[o.method].apply(o.scope , o.args);
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
   
          
  /************************************************************************      
  //USAGE

  var sq = new Sequencer;

  //scope , methodName , delay , args
  sq.add({someMethod : function(){console.log('I was called in a queue 1' , arguments); return 2000;}} , 'someMethod' ,500,[1,2,3,4]);
  sq.add({someMethod : function(){console.log('I was called in a queue 2' , arguments);}} , 'someMethod' ,2500,[1,2,3,4]);
  sq.add({someMethod : function(){console.log('I was called in a queue 3' , arguments);}} , 'someMethod' ,5000,[1,2,3,4]);
  sq.add({someMethod : function(){console.log('I was called in a queue 4' , arguments);}} , 'someMethod' ,500,[1,2,3,4]);

  sq.start();

  console.log("Sequencer »",'startted');
  ************************************************************************ */

  })(window, undefined);
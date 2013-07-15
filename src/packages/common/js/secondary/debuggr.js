
// Puts an element on the page for debugging browsers without consoles
// by Glen

define(function() {

  var Debuggr = function() {
    return this.init();
  };

  var instance = null;
  var proto = Debuggr.prototype;

  proto.init = function initDebugLog() {

    // Create element
    var debuggr = document.createElement('div');
    debuggr.style.cssText = 'position:fixed;z-index:500;top:0;left:0;min-height:30px;width:300px;background-color:#272822;color:white;font-family:Menlo, monospace;';
    debuggr.id = 'debuggr';
    document.body.appendChild( debuggr );

    // Save it
    this.element = debuggr;

    // Initial log
    this.log('awesome debugger initialized');

    return this;
  };

  proto.log = function debugLog( str ) {
    this.element.innerHTML = str;
    return this;
  };

  proto.remove = function removeDebugLog() {
    document.body.removeChild( this.element );
  };

  Debuggr.getInstance = function() {
    if ( !instance ) {
      return new Debuggr();
    } else {
      return instance;
    }
  };

  return Debuggr.getInstance();
});


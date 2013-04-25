/*jshint debug:true */

define(function(require){

  var AlertModule = require('modules/cookie-policy/alert-module');

  // Initialize the Alert Module. Without any options will open all alerts
  // within the page. You can call specific alerts using the alertSelector
  // option. 
  //
  // ex. $.fn.AlertModule({
  //   alertSelector : '#mySpecialAlertName'
  // })

  $.fn.sonyAlert();

});

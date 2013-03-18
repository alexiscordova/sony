
define(function(require){

  var ProductSummary = require('modules/product-summary-d1-d2/product-summary-d1-d2');

  // Initialize Modules that don't require additional configuration.
  ProductSummary.init();

  // Return up a level if desired.
  return {
    ProductSummary: ProductSummary
  };
});

define(function(require){

  var ProductDetails = require('modules/product-details-d5/product-details-d5');

  // Initialize Modules that don't require additional configuration.
  ProductDetails.init();

  return {
    ProductDetails: ProductDetails
  };
});
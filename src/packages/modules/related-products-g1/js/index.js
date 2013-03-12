
define(function(require){

  var RelatedProducts = require('modules/related-products-g1/related-products-g1');

  // Initialize Modules that don't require additional configuration.
  RelatedProducts.init();

  // Return up a level if desired.
  return {
    RelatedProducts: RelatedProducts
  };
});
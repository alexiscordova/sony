define(function(require){

  var CountryRegionSelection = require('modules/country-region-selection-z10/country-region-selection-z10');

  // Initialize Modules that don't require additional configuration.
  $(document).ready(function () {
    CountryRegionSelection.init();
  });

  // Return up a level if desired.
  return {
    CountryRegionSelection: CountryRegionSelection
  };
});

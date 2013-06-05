
// Secondary Touts (SecondaryTouts) Module
// --------------------------------------------
//
// * **Class:** SecondaryTouts
// * **Version:** 0.1
// * **Modified:** 04/04/2013
// * **Author:** George Pantazis
// * **Dependencies:** jQuery 1.7+

define(function(require){

  'use strict';

  var $ = require('jquery'),
      iQ = require('iQ'),
      enquire = require('enquire'),
      Settings = require('require/sony-global-settings');

  // This key-value mapping is used to show default values (as key) and their
  // desired mobile equivalents (as the matching values). Assigned to relevant
  // elements by `setupAlternateSizes`.

  var mobileSizeAlternates = {
    'align-left-center': 'align-left-bottom',
    'align-right-top': 'align-left-top',
    'align-right-center': 'align-left-bottom',
    'align-right-bottom': 'align-left-bottom',
    'align-center-center': 'align-left-top'
  };

  var module = {
    'init': function() {
      $('.secondary-tout').each(function(){
        new SecondaryTouts(this);
      });
    }
  };

  var SecondaryTouts = function(element){

    var self = this;

    self.$el = $(element);
    self.$images = self.$el.find('.st-image');
    self.$items = self.$el.find('.st-item');

    self.spanClasses = 'span12 span8 span6 span4';
    self.contentWidthClasses = 'content-12 content-8 content-6 content-4';

    self.init();

    self.$images.on('iQ:imageLoaded', function(){
      $(this).closest('.st-item').addClass('on');
    });

    // This is a hack; iQ fails unpredictably if multiple modules attempt to
    // run iQ.update() to load in their newly-created assets. This is a deep issue
    // in iQ that will probably require a thorough refactor of that class.

    setTimeout(function(){
      self.$el.find('.st-image').addClass('iq-img');
      iQ.reset();
      self.$el.trigger('SecondaryTouts:ready');
    }, 1000);

    if ( self.$items.parents().hasClass('no-grid-at-767') && !Settings.$html.hasClass('lt-ie10') ){

      enquire.register("(min-width: 768px)", function() {
        self.renderDesktop();
        self.assignDefaultLayouts();
      });
        enquire.register("(min-width: 481px) and (max-width: 767px)", function() {
        self.renderEvenColumns(12);
        self.assignDefaultLayouts();
      });
      enquire.register("(max-width: 480px)", function() {
        self.renderEvenColumns(12);
        self.assignMobileLayouts();
      });

    } else {
      self.renderDesktop();
    }
  };

  SecondaryTouts.prototype = {

    constructor: SecondaryTouts,

    init: function() {
      var self = this;

      self.$items.each(function(){

        var $this = $(this),
            matchedClasses = this.className.split(' ').filter(function(a){
              return a.search('span') === 0;
            });

        $this.data('contentWidthContainers', $this.find('.content-12, .content-8, .content-6, .content-4'));
        $this.data('originalWidth', matchedClasses[0].split('span')[1]);
      });

      self.setupLinkClicks();
      self.setupAlternateSizes();
    },

    // Create or restore the default slide layout.

    renderDesktop: function(which) {

      var self = this;

      self.$items.each(function(){

        var $this = $(this),
            originalWidth = $this.data('originalWidth');

        $this.removeClass(self.spanClasses).addClass('span' + originalWidth);

        $this.data('contentWidthContainers')
             .add($this)
             .removeClass(self.contentWidthClasses)
             .addClass('content-' + originalWidth);
      });
    },

    // Set all items to a specific column width.

    renderEvenColumns: function(colPerItem) {

      var self = this;

      self.$items.each(function(){

        var $this = $(this);

        if ( $this.data('originalWidth') === '12' ) {
          return;
        }

        $this.removeClass(self.spanClasses).addClass('span' + colPerItem);

        $this.data('contentWidthContainers')
             .add($this)
             .removeClass(self.contentWidthClasses)
             .addClass('content-' + colPerItem);
      });
    },

    // Given the `mobileSizeAlternates keyval mapping, cache any mapped value
    // with its original and mobile layouts, and push matched elements into
    // an object for later access by the enquire callbacks.

    setupAlternateSizes: function() {

      var self = this;

      self.$itemsEvaluatedOnResize = $();

      for ( var i in mobileSizeAlternates ) {

        var $matched = self.$el.find('.' + i);

        self.$itemsEvaluatedOnResize = self.$itemsEvaluatedOnResize.add($matched);

        $matched.data('originalLayout', i);
        $matched.data('mobileLayout', mobileSizeAlternates[i]);
      }
    },

    // At the mobile breakpoint, remove `originalLayout` classes assigned by `setupAlternateSizes()`
    // and assign `mobileLayout` classes.

    assignMobileLayouts: function() {

      var self = this;

      self.$itemsEvaluatedOnResize.each(function(){
        var $this = $(this);

        $this.removeClass($this.data('originalLayout')).addClass($this.data('mobileLayout'));
      });
    },

    // At the mobile breakpoint, remove `mobileLayout` classes assigned by `setupAlternateSizes()`
    // and assign `originalLayout` classes.

    assignDefaultLayouts: function() {

      var self = this;

      self.$itemsEvaluatedOnResize.each(function(){
        var $this = $(this);

        $this.removeClass($this.data('mobileLayout')).addClass($this.data('originalLayout'));
      });
    },

    // `.primary-link` specifies an overall click state, which is overriden if you click on a
    // *separate* link within the slide (closestLink, below).

    setupLinkClicks: function() {

      var self = this,
          clickContext;

      self.$el.hammer().on('tap.secondarytouts', '.st-item:not(.carousel)', function(e){

        var $this = $(this),
            destination = $this.find('.primary-link').attr('href'),
            closestLink = $(e.gesture.target).closest('a').attr('href');

        if ( !closestLink && !destination ) {
          return;
        }

        if ( closestLink && closestLink !== destination ) {
          destination = closestLink;
        }

        window.location = destination;
      });
    }
  };

  return module;

});

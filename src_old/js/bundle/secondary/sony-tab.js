/* Modified from Twitter Bootstrap Tabs */

(function ($, undefined) {

  'use strict';


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.$el = $(element);
    this.showHash = this.$el.data('hash') || false;
  };

  Tab.prototype = {

    constructor: Tab,

    show: function ( showHash ) {
      var self = this,
          $this = self.$el,
          selector = $this.attr('data-target'),
          previous,
          $prevPane,
          e;

      self.$target = self.$target || $('[data-tab="' + selector + '"]');
      showHash = showHash === false ? false : true;

      // Don't do anything if this tab is already active
      if ( !self.$target.length || self.$target.hasClass('active') || $this.parent('li').hasClass('active') ) {
        return;
      }

      // Trigger show event on both tab and pane
      previous = $this.parent().find('.active:last')[0];
      $prevPane = self.$target.parent().find('> .active');
      e = new $.Event({
        type: 'show',
        relatedTarget: previous,
        prevPane: $prevPane,
        pane: self.$target
      });
      $this.add(self.$target).trigger(e);

      if ( e.isDefaultPrevented() ) {
        return;
      }

      // Show active tab
      self.activate( $this, $this.parent() );

      // Show active tab pane
      self.activate( self.$target, self.$target.parent(), function () {
        // Trigger shown event on both tab and pane
        $this.add(self.$target).trigger({
          type: 'shown',
          relatedTarget: previous,
          prevPane: $prevPane,
          pane: self.$target
        });

        // Defer this, it doesn't need to happen immediately
        setTimeout(function() {
          // Add tab selector hash to history and url
          if ( self.showHash && showHash ) {
            self.hash(selector);
          }
        }, 0);

      }, true);
    },

    activate: function ( $element, $container, callback, isPane ) {
      var $active = $container.find('> .active'),
          transition = callback && $.support.transition && $active.hasClass('fade');

      function next() {
        var dummy;
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active');

        $element
          .addClass('active');

        if ( isPane ) {
          $active.addClass('off-screen');
          $element.removeClass('off-screen');
        }

        if ( transition ) {
          dummy = $element[0].offsetWidth; // reflow for transition
          $element.addClass('in');
        } else {
          $element.removeClass('fade');
        }

        if ( $element.parent('.dropdown-menu') ) {
          $element.closest('li.dropdown').addClass('active');
        }

        // Execute callback if one exists
        if ( callback ) {
          callback();
        }
      }

      if ( transition ) {
        $active.one($.support.transition.end, next);
      } else {
        next();
      }

      $active.removeClass('in');
    },

    hash: function(hash, $target) {
      var fake;

      hash = hash.replace(/^#/, '');

      if ( $target && $target.length ) {
        $target.attr( 'id', '' );
      }

      // We need the exact scroll top of the window because
      // that's where the browser will scroll us to
      fake = $( '<div/>' ).css({
          position: 'absolute',
          visibility: 'hidden',
          top: $(window).scrollTop() + 'px'
        })
        // Set its id
        .attr( 'id', hash )
        // Get the DOM node from jQuery
        [0];

      // Use native append over jQuery
      document.body.appendChild( fake );
      window.location.hash = hash;
      document.body.removeChild( fake );

      if ( $target && $target.length ) {
        $target.attr( 'id', hash );
      }

    }
  };


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    var args = Array.prototype.slice.call( arguments, 1 );
    return this.each(function () {
      var $this = $(this),
          tab = $this.data('tab');

      if ( !tab ) {
        tab = new Tab(this);
        $this.data( 'tab', tab );
      }

      if ( typeof option === 'string' ) {
        tab[ option ].apply( tab, args );
      }
    });
  };

  $.fn.tab.Constructor = Tab;


 /* TAB DATA-API
  * ============ */

  $(window).on('hashchange', function() {
    var target = window.location.hash ? window.location.hash.substring(1) : $('[data-target]').first().attr('data-target'),
        $target = $('[data-target="' + target + '"]'),
        isAlreadyActive = $target.hasClass('active'),
        showHash = !!window.location.hash;

    if ( !isAlreadyActive ) {
      $target.tab( 'show', showHash );
    }
  });

  // Should be called after everything is initialized
  // $(window).trigger('hashchange');

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

})(jQuery);
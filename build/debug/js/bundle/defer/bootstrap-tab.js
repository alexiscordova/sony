/* Modified from Twitter Bootstrap Tabs */

(function ($, undefined) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.$el = $(element);
    this.showHash = this.$el.data('hash') || true;
  };

  Tab.prototype = {

    constructor: Tab,

    show: function () {
      var self = this,
          $this = self.$el,
          selector = $this.attr('data-target'),
          previous,
          $prevPane;

      if ( !selector ) {
        selector = $this.attr('href');
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
      }

      self.$target = self.$target || $('[data-tab="' + selector + '"]');

      // Don't do anything if this tab is already active
      if ( self.$target.hasClass('active') || $this.parent('li').hasClass('active') ) {
        return;
      }

      // Trigger show event on both tab and pane
      previous = $this.parent().find('.active:last')[0];
      $prevPane = self.$target.parent().find('.active:last');
      $this.add(self.$target).trigger({
        type: 'show',
        relatedTarget: previous,
        prevPane: $prevPane,
        pane: self.$target
      });

      // if ( e.isDefaultPrevented() ) { return; }

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
      }, true);


      if ( this.showHash ) {
        this.hash(selector);
      }
    },

    activate: function ( $element, $container, callback, isPane ) {
      var $active = $container.find('> .active'),
          transition = callback && $.support.transition && $active.hasClass('fade');

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active');

        $element
          .addClass('active');

        if ( isPane ) {
          // $active.hide();
          // $element.show();
          $active.addClass('off-screen');
          $element.removeClass('off-screen');
        }

        if ( transition ) {
          $element[0].offsetWidth; // reflow for transition
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
        var $fake;

        hash = hash.replace(/^#/, '');

        if ( $target && $target.length ) {
          $target.attr( 'id', '' );
        }

        $fake = $( '<div/>' ).css({
            position: 'absolute',
            visibility: 'hidden',
            top: $(window).scrollTop() + 'px'
          })
          .attr( 'id', hash )
          .appendTo( document.body );

        window.location.hash = hash;
        
        $fake.remove();

        if ( $target && $target.length ) {
          $target.attr( 'id', hash );
        }

    },
  };


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this),
          tab = $this.data('tab');

      if ( !tab ) {
        tab = new Tab(this);
        $this.data( 'tab', tab );
      }

      if ( typeof option === 'string' ) {
        tab[ option ]();
      }
    });
  };

  $.fn.tab.Constructor = Tab;


 /* TAB DATA-API
  * ============ */

  $(window).on('hashchange', function() {
    if ( window.location.hash ) {
      $('[data-target="' + window.location.hash.substring(1) + '"]').tab('show');
    }
  });

  $(window).trigger('hashchange');

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

}(window.jQuery));
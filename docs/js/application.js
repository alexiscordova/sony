// THIS IS JUST DOCS JAVASCRIPT!
// ++++++++++++++++++++++++++++++++++++++++++

// Shamelessly stealing debouncing from underscore
var _ = {};
_.debounce = function(func, wait, immediate) {
  var timeout, result;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(context, args);
    return result;
  };
};

!function ($) {

  $(function() {

    var $window = $(window);

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault();
    });

    // side bar
    // $('.bs-docs-sidenav').affix({
    //   offset: {
    //     top: function () { return $window.width() <= 980 ? 290 : 210 }
    //   , bottom: 270
    //   }
    // })

    // make code pretty
    window.prettyPrint && prettyPrint();

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this),
          method = $this.attr('checked') ? 'addClass' : 'removeClass';
      $(this).parents('.add-on')[method]('active');
    });


    // hide the top of the page.
    $('#hide-pre-small-screen-content-w a').click(function(){
      $('#hide-pre-small-screen-content-w').hide();
      $('#pre-small-screen').hide();
      $('#show-hidden-sections-btn-w').show();
      $('body').addClass('limit-paragraph-widths');
      setTimeout(function(){
        $(window).scrollTop($('#show-hidden-sections-btn-w').offset().top - 50);
      },5);
    });
    // unhide the top of the page.
    $('#show-hidden-sections-btn-w a').click(function(){
      $('#show-hidden-sections-btn-w').hide();
      $('#pre-small-screen').show();
      $('#hide-pre-small-screen-content-w').show();
      $('body').removeClass('limit-paragraph-widths');
      setTimeout(function(){
        $(window).scrollTop($('#small-screen-grids').offset().top - 50);
      },5);
    });

    // add tooltips to show-grid columns to display class names.
    $('.show-grid').each(function(){
      $(this).tooltip({
        selector: '[class*="span"]',
        title: function () { return $(this).attr('class'); }
      });
    });


    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: 'a[rel=tooltip]'
    });

    $('.tooltip-test').tooltip();
    $('.popover-test').popover();

    // popover demo
    $('a[rel=popover]')
      .popover()
      .click(function(e) {
        e.preventDefault();
      });

    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this);
        btn.button('loading');
        setTimeout(function () {
          btn.button('reset');
        }, 3000);
      });

    // carousel demo
    $('#myCarousel').length > 0 && $('#myCarousel').carousel();


    function moduleSearch() {
      var collapsedClass = 'collapsed',
          // doc = document,
          $searchInput = $('#module-search'),
          $links = $('.module-nav a'),
          // $datalist = $('#module-list'),
          $hrs = $('.module-nav hr'),
          // frag = doc.createDocumentFragment(),
          // options = [],

      keyup = function() {
        // Value they've entered
        var val = this.value.toLowerCase();

        // Filter elements based on if their string exists in the product model
        $links.each(function( i, el ) {
          var $el = $( el ),
              text = el.title.toLowerCase(),
              passes = text.indexOf(val) !== -1;

          if ( passes ) {
            if ( $el.hasClass( collapsedClass ) ) {
              $el.removeClass( collapsedClass );
            }
          } else {
            if ( !$el.hasClass( collapsedClass ) ) {
              $el.addClass( collapsedClass );
            }
          }

        });

        if ( val ) {
          if ( !$hrs.hasClass( collapsedClass ) ) {
            $hrs.addClass( collapsedClass );
          }
        } else {
          if ( $hrs.hasClass( collapsedClass ) ) {
            $hrs.removeClass( collapsedClass );
          }
        }
      },

      debouncedKeyup = _.debounce( keyup, 50 );

      if ( !$searchInput.length ) {
        return;
      }

      // options = $links.map(function() {
      //   return this.title;
      // });

      // $.each( options, function( i, title ) {
      //   var option = doc.createElement( 'option' );
      //   option.value = title;
      //   frag.appendChild( option );
      // });

      // $datalist[0].appendChild( frag );

      $searchInput.on( 'keyup change', debouncedKeyup );
    }

    moduleSearch();

  //   // javascript build logic
  //   var inputsComponent = $('#components.download input')
  //     , inputsPlugin = $("#plugins.download input")
  //     , inputsVariables = $("#variables.download input")

  //   // toggle all plugin checkboxes
  //   $('#components.download .toggle-all').on('click', function (e) {
  //     e.preventDefault()
  //     inputsComponent.attr('checked', !inputsComponent.is(':checked'))
  //   })

  //   $('#plugins.download .toggle-all').on('click', function (e) {
  //     e.preventDefault()
  //     inputsPlugin.attr('checked', !inputsPlugin.is(':checked'))
  //   })

  //   $('#variables.download .toggle-all').on('click', function (e) {
  //     e.preventDefault()
  //     inputsVariables.val('')
  //   })

  //   // request built javascript
  //   $('.download-btn').on('click', function () {

  //     var css = $("#components.download input:checked")
  //           .map(function () { return this.value })
  //           .toArray()
  //       , js = $("#plugins.download input:checked")
  //           .map(function () { return this.value })
  //           .toArray()
  //       , vars = {}
  //       , img = ['glyphicons-halflings.png', 'glyphicons-halflings-white.png']

  //   $("#variables.download input")
  //     .each(function () {
  //       $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
  //     })

  //     $.ajax({
  //       type: 'POST'
  //     , url: /\?dev/.test(window.location) ? 'http://localhost:3000' : 'http://bootstrap.herokuapp.com'
  //     , dataType: 'jsonpi'
  //     , params: {
  //         js: js
  //       , css: css
  //       , vars: vars
  //       , img: img
  //     }
  //     })
  //   })
  // })



// Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
// $.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
//   var url = opts.url;

//   return {
//     send: function(_, completeCallback) {
//       var name = 'jQuery_iframe_' + jQuery.now()
//         , iframe, form

//       iframe = $('<iframe>')
//         .attr('name', name)
//         .appendTo('head')

//       form = $('<form>')
//         .attr('method', opts.type) // GET or POST
//         .attr('action', url)
//         .attr('target', name)

//       $.each(opts.params, function(k, v) {

//         $('<input>')
//           .attr('type', 'hidden')
//           .attr('name', k)
//           .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
//           .appendTo(form)
//       })

//       form.appendTo('body').submit()
//     }
//   }
  });

}(window.jQuery)
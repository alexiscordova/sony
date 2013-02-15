// THIS IS JUST DOCS JAVASCRIPT!
// ++++++++++++++++++++++++++++++++++++++++++

!function ($) {

  $(function(){

    var $window = $(window)

    // Disable certain links in docs
    $('section [href^=#]').click(function (e) {
      e.preventDefault()
    })

    // side bar
    // $('.bs-docs-sidenav').affix({
    //   offset: {
    //     top: function () { return $window.width() <= 980 ? 290 : 210 }
    //   , bottom: 270
    //   }
    // })

    // make code pretty
    window.prettyPrint && prettyPrint()

    // add-ons
    $('.add-on :checkbox').on('click', function () {
      var $this = $(this)
        , method = $this.attr('checked') ? 'addClass' : 'removeClass'
      $(this).parents('.add-on')[method]('active')
    })


    // hide the top of the page.
    $('#hide-pre-small-screen-content-w a').click(function(){
      $('#hide-pre-small-screen-content-w').hide();
      $('#pre-small-screen').hide();
      $('#show-hidden-sections-btn-w').show();
      $('body').addClass("limit-paragraph-widths");
      setTimeout(function(){
        $(window).scrollTop($('#show-hidden-sections-btn-w').offset().top - 50);
      },5);
    })
    // unhide the top of the page.
    $('#show-hidden-sections-btn-w a').click(function(){
      $('#show-hidden-sections-btn-w').hide();
      $('#pre-small-screen').show();
      $('#hide-pre-small-screen-content-w').show();
      $('body').removeClass("limit-paragraph-widths");
      setTimeout(function(){
        $(window).scrollTop($('#small-screen-grids').offset().top - 50);
      },5);
    })

    // keep the viewport within view when resizing, even when above content is breaking to more/fewer rows & pushing down the rest.
    // disabled until it can be better tested.
    /*
    if ($('#docs-scaffolding').length){
      var resizing = false;
      var resizingInt = false;
      var $closestEl = $();
      var lookingForClosestEl = false;

      $(window).resize(function() {

        // if not resizing for a moment, reset all the resize variables to return to natural scrolling.
        // otherwise after resizing once, you'd always scroll back to that offset position.
        !!resizingInt && clearInterval(resizingInt);
        resizingInt = setInterval(function(){
          resizing = false;
          resizingInt = false;
          $closestEl = $();
          lookingForClosestEl = false;
        },2000);


        if (!resizing){

          resizing = true;

          // find the element whose top is closest to the scrolltop
          lookingForClosestEl = true;
          var scrollTop = $(window).scrollTop();
          var closestSt = $('body').outerHeight(); // start out w.the tallest possible scrolltop offset - the page height.

          $('h2, h3, h4, h5, h6').each(function(){
            var thSt = $(this).offset().top; // how far this el is from the page top
            var thStOffset = scrollTop - thSt; // how far this el is from the viewport top

            if (thStOffset < closestSt && lookingForClosestEl){
              if (thStOffset > 20){ // if it's greater than 0, keep going.
                closestSt = thSt;
              } else {
                lookingForClosestEl = false;
                $closestEl = $(this);
              }
            }
          })
        } else {

        }

        $(window).scrollTop($closestEl.offset().top - 30);
      });
    }
    */


    // add tooltips to show-grid columns to display class names.
    $('.show-grid').each(function(){
      $(this).tooltip({
        selector: '[class*="span"]'
      , title: function () { return $(this).attr("class") }
      })
    })


    // tooltip demo
    $('.tooltip-demo').tooltip({
      selector: "a[rel=tooltip]"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    // popover demo
    $("a[rel=popover]")
      .popover()
      .click(function(e) {
        e.preventDefault()
      })

    // button state demo
    $('#fat-btn')
      .click(function () {
        var btn = $(this)
        btn.button('loading')
        setTimeout(function () {
          btn.button('reset')
        }, 3000)
      })

    // carousel demo
    $('#myCarousel').carousel()

    // javascript build logic
    var inputsComponent = $("#components.download input")
      , inputsPlugin = $("#plugins.download input")
      , inputsVariables = $("#variables.download input")

    // toggle all plugin checkboxes
    $('#components.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsComponent.attr('checked', !inputsComponent.is(':checked'))
    })

    $('#plugins.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsPlugin.attr('checked', !inputsPlugin.is(':checked'))
    })

    $('#variables.download .toggle-all').on('click', function (e) {
      e.preventDefault()
      inputsVariables.val('')
    })

    // request built javascript
    $('.download-btn').on('click', function () {

      var css = $("#components.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , js = $("#plugins.download input:checked")
            .map(function () { return this.value })
            .toArray()
        , vars = {}
        , img = ['glyphicons-halflings.png', 'glyphicons-halflings-white.png']

    $("#variables.download input")
      .each(function () {
        $(this).val() && (vars[ $(this).prev().text() ] = $(this).val())
      })

      $.ajax({
        type: 'POST'
      , url: /\?dev/.test(window.location) ? 'http://localhost:3000' : 'http://bootstrap.herokuapp.com'
      , dataType: 'jsonpi'
      , params: {
          js: js
        , css: css
        , vars: vars
        , img: img
      }
      })
    })
  })

// Modified from the original jsonpi https://github.com/benvinegar/jquery-jsonpi
$.ajaxTransport('jsonpi', function(opts, originalOptions, jqXHR) {
  var url = opts.url;

  return {
    send: function(_, completeCallback) {
      var name = 'jQuery_iframe_' + jQuery.now()
        , iframe, form

      iframe = $('<iframe>')
        .attr('name', name)
        .appendTo('head')

      form = $('<form>')
        .attr('method', opts.type) // GET or POST
        .attr('action', url)
        .attr('target', name)

      $.each(opts.params, function(k, v) {

        $('<input>')
          .attr('type', 'hidden')
          .attr('name', k)
          .attr('value', typeof v == 'string' ? v : JSON.stringify(v))
          .appendTo(form)
      })

      form.appendTo('body').submit()
    }
  }
})

}(window.jQuery)
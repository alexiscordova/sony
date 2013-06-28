
// Sony Modal (SonyModal) Module
// --------------------------------------------
//
// * **Class:** SonyModal
// * **Version:** 0.1
// * **Author:** George Pantazis
//
// This is a wrapper for bootstrap's `.modal()` method, creating grid-aligned modals that
// automatically self-destruct when closed.
//
// *Example Usage:*
//
//      var Modals = require('secondary/index').sonyModal;
//
// create a modal with the text 'foo'.
//
//      Modals.create('foo');
//
// Create a modal with a simple DOM string (parsed by jQuery).
//
//      Modals.create( "<a href='#foo'>bar</a>" );
//
// Create a modal using an existing element. Note that this element will be
// copied to the modal, then put back at the end of its original parent during the
// modal's `destroy` sequence.
//
//      Modals.create( $('#foo') );

define(function(require){

  'use strict';

  var $ = require('jquery'),
      bootstrap = require('bootstrap');

  var SonyModal = function(){

    var self = this;
    self.init();
  };

  // Private methods
  // ---------------

  SonyModal.prototype = {

    constructor: SonyModal,

    init: function() {

      var self = this,
          modal = document.createElement('div'),
          container = document.createElement('div'),
          grid = document.createElement('div'),
          closeButton = document.createElement('button'),
          closeButtonIcon = document.createElement('i');

      modal.className = 'sony-modal modal hide fade';
      container.className = 'container';
      grid.className = 'grid modal-inner';
      closeButton.className = 'box-close';
      closeButtonIcon.className = 'fonticon-10-x-skinny';

      closeButton.setAttribute('data-dismiss', 'modal');

      closeButton.appendChild(closeButtonIcon);
      grid.appendChild(closeButton);
      container.appendChild(grid);
      modal.appendChild(container);

      self.$modal = $(modal);
      self.activeModals = [];

      return self;
    },

    // Destroy a specific `$modal` by removing it from the DOM and removing references to it.

    destroy: function($modal) {

      var self = this;

      $modal.data('contentParent').append( $modal.data('content') );
      $modal.remove();

      self.activeModals.splice( self.activeModals.indexOf($modal), 1 );
    }
  };

  var sonyModal = new SonyModal();

  // Public methods
  // --------------

  var module = {

    // Create a modal with the provided `content`. Fire callback `cb` when the modal is ready.

    'create': function(content, cb) {

      var self = this,
          $modal;

      $modal = sonyModal.$modal.clone(true);

      // Cache the content and its parent into `$modal`'s data so that it may be placed back
      // whence it came during the `destroy` phase.

      $modal.data('content', $(content));
      $modal.data('contentParent', $(content).parent());
      $modal.find('.modal-inner').append(content);

      $('body').append($modal);

      $modal.on('show', function(){
        self.center();
      });

      $modal.on('hidden', function() {
        sonyModal.destroy($modal);
        $modal = null;
      });

      $modal.on('shown', function() {
        if ( typeof cb === 'function' ) {
          cb();
        }
      });

      // Activate and store the modal.

      sonyModal.activeModals.push( $modal );

      $modal.modal();

      return self;
    },

    // Center all active modals in the window.

    'center': function() {

      var self = this;

      for ( var i = 0; i < sonyModal.activeModals.length; i++ ) {

        var $modal = sonyModal.activeModals[i],
            $modalContent = $modal.find('.modal-inner');

        $modal.css({
          marginTop: $modalContent.height() / -2
        });
      }
    }
  };

  return module;
});

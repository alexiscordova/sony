(function($) {
	/**
	 *
	 * Sony Carousel Tabbed navigation
	 * @version 1.0:
	 * 
	 */ 
	$.extend($.scProto, {
		_initTabs: function() {
			var self = this;
			if(self.st.controlNavigation === 'tabbednav') {
				
				
				var itemHTML = '<div class="scNavItem scTab"><span class="">Tab Name</span></div>';
				self.ev.one('scAfterPropsSetup', function() {

					self._controlNavEnabled = true;
					self.slider.addClass('scWithBullets');
					var out = '<div class="scNav scTabs">';
					for(var i = 0; i < self.numSlides; i++) {
						out += itemHTML;
					}
					out += '</div>';
					out = $(out);
					self._controlNav = out;
					self._controlNavItems = out.children();
					self.slider.append(out);

					self._controlNav.click(function(e) {
						var item = $(e.target).closest('.scNavItem');
						if(item.length) {
							self.goTo(item.index());
						}
					});
				});

	
				self.ev.on('scOnUpdateNav', function() {
					var id = self.currSlideId,
						currItem;
						//prevItem;
						
					if(self._prevNavItem) {
						self._prevNavItem.removeClass('scNavSelected');
					}
					currItem = $(self._controlNavItems[id]);

					currItem.addClass('scNavSelected');
					self._prevNavItem = currItem;
				});
			}
		}
	});
	$.scModules.tabbednav = $.scProto._initTabs;
})(jQuery);

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
			if(self.st.controlNavigation === 'thumbnav') {


				return; //need to build this out
				
				var itemHTML = '<div class="scNavItem scBullet"><span class=""></span></div>';
				self.ev.one('scAfterPropsSetup', function() {

					self._controlNavEnabled = true;
					self.slider.addClass('scWithBullets');
					var out = '<div class="scNav scBullets">';
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

				self.ev.on('scOnAppendSlide', function(e, parsedSlide, index) {
					if(index >= self.numSlides) {
						self._controlNav.append(itemHTML);
					} else {
						self._controlNavItems.eq(index).before(itemHTML);
					}
					self._controlNavItems = self._controlNav.children();
				});
				self.ev.on('scOnRemoveSlide', function(e, index) {
					var itemToRemove = self._controlNavItems.eq(index);
					if(itemToRemove) {
						itemToRemove.remove();
						self._controlNavItems = self._controlNav.children();
					}
					
				});	

				self.ev.on('scOnUpdateNav', function() {
					var id = self.currSlideId,
						currItem,
						prevItem;
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

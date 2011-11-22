(function($) {
	$.fn.fixedPosition = function(options) {
		// Default thresholds & swipe functions
		var defaults = {
		};
		
		var options = $.extend(defaults, options);
		
		if (!this) return false;
		
		$(window).scroll(function(event){
		    //console.log(event);
		});
		
		return this.each(function() {
		    var me = $(this);
		    //me.hide();
		});
	};
})(jQuery);
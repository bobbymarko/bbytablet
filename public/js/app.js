var touchMove = false;
$(document).ready(function(){
	$("input[type=text], input[type=search], input[type=tel], input[type=number], input[type=email]").addClear({top:1,right:10});

	new FastClick(document.body);
	
	$("#add-new-list").click(function(e){ // adding a list via the account menu
		var list = prompt("Wish List Name","Bobby's Wish List");
		if (list) $(this).closest('li').before('<li><a href="wishlist.html">'+list+'</a></li>');
		e.preventDefault();
	});

	
	$('.icon-link>a, .dropdown-link>a').live('click',function(e){
	    e.preventDefault();
	    
	    target = $(this).attr('href');
	    $target = $(target);
	    
	    //if we have a multi-level dropdown we have to ensure we open to the primary menu
	    if ($target.children('.dropdown-secondary-menu').length > 0){ 
	      $target.find('.dropdown-primary-menu').first().show();
	      $target.find('.dropdown-secondary-menu').hide();
	    }
	    
	    if ($target.is(':visible')){
	     // if the target menu is visible then hide it
        closeOpenDropdowns();
	    }else{
	     // if the target menu is not being shown then show it
        closeOpenDropdowns();
        $(this).closest('li').addClass('active-link')
        $target.show();
	    }
	    
	    document.addEventListener('touchmove', didScroll, false);
	    //document.addEventListener('touchend', tapToClose, false);
	    
	});
	
  $('a[href^="#"]','.dropdown-menu').click(function(e){
    e.preventDefault();
    var parent = $(this).closest('.dropdown-menu');
    var primary = $(this).closest('.dropdown-primary-menu');
    var secondary = $(this).closest('.dropdown-secondary-menu');
    var tertiary = $(this).closest('.dropdown-tertiary-menu');
    
    if ($(this).hasClass('dropdown-back')){
      // we are moving back one level
      if (tertiary.length > 0){
      	transitionMenu(parent.children('.dropdown-secondary-menu').first(), secondary, parent, 'backward');
      }else if (secondary.length > 0){
				transitionMenu(parent.children('.dropdown-primary-menu').first(), secondary, parent, 'backward');
      }
    }else if (primary.length > 0) { 
      // we are in the initial dropdown
      transitionMenu($($(this).attr('href')), primary, parent, 'forward')
    }else if (secondary.length > 0){
    	// we are in a secondary dropdown
    	transitionMenu($($(this).attr('href')), secondary, parent, 'forward')
    }
  });

});

function transitionMenu(target, previousMenu, parent, direction){
	if (direction == "forward"){
		previousMenu.addClass('to-left');
		parent.css({height:target.height()});
		target.show().addClass('from-right');
	} else if (direction == "backward"){
		previousMenu.addClass('to-right');
		target.show().addClass('from-left');
		parent.css({height:target.height()});
	}
	
	setTimeout(function(){ //timeout set to duration of animation
		previousMenu.hide();
		parent.css({height:'auto'});
		removeAnimationClasses();
	},200);
}

$('.close-btn').click(function(e){
	e.preventDefault();
	$(this).closest('div').remove();
});

function removeAnimationClasses(){
	$('.to-right').removeClass('to-right');
	$('.from-left').removeClass('from-left');
	$('.to-left').removeClass('to-left');
	$('.from-right').removeClass('from-right');
}

function closeOpenDropdowns(){
	$('.dropdown-menu').hide(); // remove all other open dropdown menus
	$('.active-link').removeClass('active-link'); // remove all other toggled dropdown menu buttons
}

function getParameterByName(name)
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function didScroll(e){
	touchMove = event.touches[0].pageX !== 0 || event.touches[0].pageX !== 0 ? true : false; // if we move then set touchMove to true
}

function tapToClose(e){
	 // only close dropdown if we're not tapping within it, or hitting the toggle button and ensure we're not tapping to scrol.
	 if ($(e.target).closest('.dropdown-link').length == 0 && $(e.target).closest('.icon-link').length == 0 && !touchMove){
		 closeOpenDropdowns();
		 document.removeEventListener('touchmove', didScroll, false);
		 document.removeEventListener('touchend', tapToClose, false);
	 }
	 touchMove = false;
}

/**
 * FastClick: Set up handling of fast clicks
 *
 * On touch WebKit (eg Android, iPhone) onclick events are usually 
 * delayed by ~300ms to ensure that they are clicks rather than other
 * interactions such as double-tap to zoom.
 *
 * To work around this, add a document listener which converts touches
 * to clicks on a global basis, excluding scrolls and gestures.  The 
 * default click events are then cancelled to prevent double-clicks.
 *
 * This function automatically adapts if no action is required (eg if 
 * touch events are not supported), and also handles functionality such
 * as preventing actions in the page while the section selector
 * is displaying.
 *
 * One alternative is to use ontouchend events for everything, but that
 * prevents non-touch interaction, and
 * requires checks everywhere to ensure that a touch wasn't a 
 * scroll/swipe/etc.
 *
 * ------
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the 
 * "Software"), to deal in the Software without restriction, including 
 * without limitation the rights to use, copy, modify, merge, publish, 
 * distribute, sublicense, and/or sell copies of the Software, and to 
 * permit persons to whom the Software is furnished to do so, subject 
 * to the following conditions:
 * 
 * The below copyright notice and this permission notice shall be 
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS 
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
 * SOFTWARE.
 *
 * @licence MIT License (http://www.opensource.org/licenses/mit-license.php)
 * @copyright (c) 2011 Assanka Limited
 * @author Rowan Beentje <rowan@assanka.net>, Matt Caruana Galizia <matt@assanka.net>
 */

var FastClick = (function() {

	// Determine whether touch handling is supported
	var touchSupport = 'ontouchstart' in window;

	return function(layer) {
		if (!(layer instanceof HTMLElement)) {
			throw new TypeError('Layer must be instance of HTMLElement');
		}

		// Set up event handlers as required
		if (touchSupport) {
			layer.addEventListener('touchstart', onTouchStart, true);
			layer.addEventListener('touchmove', onTouchMove, true);
			layer.addEventListener('touchend', onTouchEnd, true);
			layer.addEventListener('touchcancel', onTouchCancel, true);
		}
		layer.addEventListener('click', onClick, true);

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (layer.onclick instanceof Function) {
			layer.addEventListener('click', layer.onclick, false);
			layer.onclick = '';
		}

		// Define touch-handling variables
		var clickStart = { x: 0, y: 0, scroll: 0 }, trackingClick = false;
	
		// On touch start, record the position and scroll offset.
		function onTouchStart(event) {
			trackingClick = true;
			clickStart.x = event.targetTouches[0].clientX;
			clickStart.y = event.targetTouches[0].clientY;
			clickStart.scroll = window.pageYOffset;
			
			theTarget = event.target;
			if (event.target.nodeType == 3) theTarget = event.target.parentNode;

			var className = theTarget.tagName.toLowerCase();
			if (className == 'a' || className == 'input' || className == 'label' || className == 'select')
				theTarget.className += ' pressed';
			return true;
		}
	
		// If the touch moves more than a small amount, cancel any derived clicks.
		function onTouchMove(event) {
			if (trackingClick) {
				if (Math.abs(event.targetTouches[0].clientX - clickStart.x) > 10 || Math.abs(event.targetTouches[0].clientY - clickStart.y) > 10) {
					trackingClick = false;
					var cur_columns = document.getElementsByClassName('pressed');
					for (var i = 0; i < cur_columns.length; i++) {
						cur_columns[i].className = cur_columns[i].className.replace(/ ?pressed/gi, '');
					}
					//event.target.className = event.target.className.replace(/ ?pressed/gi, '');
				}
			}
	
			return true;
		}
	
		// On touch end, determine whether to send a click event at once.
		function onTouchEnd(event) {
			var targetElement, clickEvent;
			tapToClose(event); //close some dropdown menus if open
			// If the touch was cancelled (eg due to movement), or if the page has scrolled in the meantime, return.
			if (!trackingClick || Math.abs(window.pageYOffset - clickStart.scroll) > 5) {
				return true;
			}
	
			// Derive the element to click as a result of the touch.
			targetElement = document.elementFromPoint(clickStart.x, clickStart.y);
	
			// If the targeted node is a text node, target the parent instead.
			if (targetElement.nodeType === Node.TEXT_NODE) {
				targetElement = targetElement.parentNode;
			}
	
			// Unless the element is marked as only requiring a non-programmatic click, synthesise a click
			// event, with an extra attribute so it can be tracked.
			if (!(targetElement.className.indexOf('clickevent') !== -1 && targetElement.className.indexOf('touchandclickevent') === -1)) {
				clickEvent = document.createEvent('MouseEvents');
				//event.target.className = event.target.className.replace(/ ?pressed/gi, '');
				var cur_columns = document.getElementsByClassName('pressed');
				for (var i = 0; i < cur_columns.length; i++) {
					cur_columns[i].className = cur_columns[i].className.replace(/ ?pressed/gi, '');
				}
				clickEvent.initMouseEvent('click', true, true, window, 1, 0, 0, clickStart.x, clickStart.y, false, false, false, false, 0, null);
				clickEvent.forwardedTouchEvent = true;
				targetElement.dispatchEvent(clickEvent);
			}
	
			// Prevent the actual click from going though - unless the target node is marked as requiring
			// real clicks or if it is a SELECT, in which case only non-programmatic clicks are permitted
			// to open the options list and so the original event is required.
			if (!(targetElement instanceof HTMLSelectElement) &&
				targetElement.className.indexOf('clickevent') === -1) {
				event.preventDefault();
			} else {
				return false;
			}
		}

		function onTouchCancel(event) {
			trackingClick = false;
		}
	
		// On actual clicks, determine whether this is a touch-generated click, a click action occurring 
		// naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
		// an actual click which should be permitted.
		function onClick(event) {
			if (!window.event) {
				return true;
			}
	
			var allowClick = true;
			var targetElement;
			var forwardedTouchEvent = window.event.forwardedTouchEvent;
	
			// For devices with touch support, derive and check the target element to see whether the
			// click needs to be permitted; unless explicitly enabled, prevent non-touch click events
			// from triggering actions, to prevent ghost/doubleclicks.
			if (touchSupport) {
				targetElement = document.elementFromPoint(clickStart.x, clickStart.y);
				if (!targetElement ||  
					(!forwardedTouchEvent && targetElement.className.indexOf('clickevent') == -1)) {
					allowClick = false;
				}
			}

			// If clicks are permitted, return true for the action to go through.
			if (allowClick) {
				return true;
			}
	
			// Otherwise cancel the event
			event.stopPropagation();
			//event.preventDefault(); // this is causing issues with form submissions getting cancelled.

			// Prevent any user-added listeners declared on FastClick element from being fired.
			event.stopImmediatePropagation();

			return false;
		}
	}

})();
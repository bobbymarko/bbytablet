/*
 * jSwipe - jQuery Plugin
 * http://plugins.jquery.com/project/swipe
 * http://www.ryanscherf.com/demos/swipe/
 *
 * Copyright (c) 2009 Ryan Scherf (www.ryanscherf.com)
 * Licensed under the MIT license
 *
 * $Date: 2009-07-14 (Tue, 14 Jul 2009) $
 * $version: 0.1.2
 * 
 * This jQuery plugin will only run on devices running Mobile Safari
 * on iPhone or iPod Touch devices running iPhone OS 2.0 or later. 
 * http://developer.apple.com/iphone/library/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
 */
(function($) {
	$.fn.touchDraggable = function(options) {
		
		// Default thresholds & swipe functions
		var defaults = {
			threshold: {
				x: 30,
				y: 10
			},
			swipeLeft: function() { alert('swiped left') },
			swipeRight: function() { alert('swiped right') }
		};
		
		var options = $.extend(defaults, options);
		
		if (!this) return false;
		
		return this.each(function() {
			
			var me = $(this);
			var helper;
			var dragTimer;
			
			// Private variables for each element
			var originalCoord = { x: 0, y: 0 }
			var finalCoord = { x: 0, y: 0 }
			var tapOffset = { x: 0, y: 0}
			
			var isDragging = false;
			var isCloned = false;
			
			var position, offsetCoord;
			
			// Store coordinates as finger is swiping
			function touchMove(event) {
			    if (isDragging){
			        if (isCloned){
                        event.preventDefault();
                        finalCoord.x = event.targetTouches[0].pageX - offsetCoord.x - tapOffset.x
                        finalCoord.y = event.targetTouches[0].pageY - offsetCoord.y - tapOffset.y
                        helper.css('-webkit-transform','translate3d('+finalCoord.x+'px,'+finalCoord.y+'px,0)');
                    }else{

                    }
				}else{
				    console.log('we are not dragging');
				    clearTimeout(dragTimer);
				}
			}
			
			function touchEnd(event) {
			    event.preventDefault();
				console.log('Ending swipe gesture...')
				//helper.remove();
				if (helper) helper.css('-webkit-transition-duration','200ms').css('-webkit-transform','translate3d(0,0,0)').css('opacity',0).bind('webkitTransitionEnd',removeElement);
				clearTimeout(dragTimer);
                isDragging = false;
                isCloned = false;
                $('.overlay').remove();
                myScroll.enable();
			}
			
			function removeElement(el){
                $(el.target).remove();
			}
			
			// Swipe was started
			function touchStart(event) {
			    
				console.log('Starting swipe gesture...')

				dragTimer = setTimeout(function(){
				    event.preventDefault();
				    isDragging = true;
				    $('<div class="overlay"></div>').appendTo('body').css({height:$(document).height()});
				    $('<div class="drop-target"></div>').appendTo('body');
                    position = me.offset();
                    offsetCoord = { x: position.left, y: position.top }
                    
                    originalCoord.x = event.targetTouches[0].pageX
                    originalCoord.y = event.targetTouches[0].pageY
                    
                    tapOffset.x = originalCoord.x - offsetCoord.x;
                    tapOffset.y = originalCoord.y - offsetCoord.y;
                    
                    helper = me.clone().appendTo('body').addClass('product-tile-helper').css({top:offsetCoord.y, left:offsetCoord.x});
                    isCloned = true;
                    myScroll.disable();
                    
				},400);
				
				
			}
			
			// Swipe was canceled
			function touchCancel(event) { 
				console.log('Canceling swipe gesture...')
			}
			
			function cancelEvent(event){
			    event.preventDefault();
			}
			
			function onClick(event){
			    if (isDragging){
			        event.preventDefault();
			        //setTimeout(function(){
                        alert('dragging');
			        //}, 400);
			    } else {
			        event.preventDefault();
			        alert('not dragging');
			    }
			}
			
			// Add gestures to all swipable areas
			this.addEventListener("touchstart", touchStart, false);
			this.addEventListener("touchmove", touchMove, false);
			this.addEventListener("touchend", touchEnd, false);
			this.addEventListener("touchcancel", touchEnd, false);
		    me.bind("mousedown", cancelEvent);
		    me.bind("mouseup", onClick);
		    me.bind("click", cancelEvent);
		});
	};
})(jQuery);
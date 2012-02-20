var touchMove = false;
$(document).ready(function(){
	$("input[type=text], input[type=search], input[type=tel], input[type=number], input[type=email]").addClear({top:1,right:10});
	
	var bdy = document.getElementsByTagName('body');
	new FastClick(bdy[0]);
	
	$('#masthead .icon-link>a, .dropdown-link>a').click(function(e){
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
        //closeOpenDropdowns();
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
	 if ($(e.target).closest('.dropdown-menu').length == 0 && $(e.target).closest('.icon-link').length == 0 && !touchMove){
		 closeOpenDropdowns();
		 document.removeEventListener('touchmove', didScroll, false);
		 document.removeEventListener('touchend', tapToClose, false);
	 }
	 touchMove = false;
}

function FastClick(el) {
	this.el = el || document.getElementById(el);
	this.moved = false;
	this.startX = 0;
	this.startY = 0;
	this.coordinates = [];
	//	 if (window.Touch)
	this.el.addEventListener('touchstart', this, false);
	this.el.addEventListener('click', this, false);
}

FastClick.prototype = {
	handleEvent: function(e) {
		switch(e.type) {
			case 'touchstart': this.onTouchStart(e); break;
			case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
			case 'click': this.onMouseClick(e); break;
		}
	},
	onTouchStart: function(e) {
		e.stopPropagation();
		this.moved = false;
		this.target = document.elementFromPoint(
			e.changedTouches[0].clientX,
			e.changedTouches[0].clientY);
		if (this.target.nodeType == 3) this.target = this.target.parentNode;
		var className = this.target.tagName.toLowerCase();
		if (className == 'a' || className == 'input' || className == 'label' || className == 'select')
			this.target.className += ' pressed';
		this.startX = e.touches[0].clientX;
		this.startY = e.touches[0].clientY;
		this.el.addEventListener('touchmove', this, false);
		this.el.addEventListener('touchend', this, false);
	},
	onTouchMove: function(e) {
		//if finger moves more than 10px flag to cancel
		//code.google.com/mobile/articles/fast_buttons.html
		if (Math.abs(e.touches[0].clientX - this.startX) > 10 ||
			Math.abs(e.touches[0].clientY - this.startY) > 10) {
			this.moved = true;
			this.target.className = this.target.className.replace(/ ?pressed/gi, '');
		}
	},
	onTouchEnd: function(e) {
		e.preventDefault();
		e.stopPropagation();
		tapToClose(e); //close some dropdown menus if open
		this.preventGhostClick(this.startX, this.startY);
		this.el.removeEventListener('touchmove', this, false);
		this.el.removeEventListener('touchend', this, false);
		if(!this.moved && this.target){
			var evt = document.createEvent('MouseEvents');
			this.target.className = this.target.className.replace(/ ?pressed/gi, '');
			evt.initMouseEvent('click', true, true);
			this.target.dispatchEvent(evt);
		}
		//reset
		this.target = undefined;
		this.startX = 0;
		this.startY = 0;
		this.moved = false;
	},
	onTouchCancel: function(e) {
		//reset
		this.target = undefined;
		this.startX = 0;
		this.startY = 0;
		this.moved = false;
	},
	preventGhostClick: function(x, y) {
		this.coordinates.push(x, y);
		var self = this;
		setTimeout(self.popArr, 2500);
	},
	popArr: function() {
		if (this.coordinates) this.coordinates.splice(0, 2);
	},
	onMouseClick: function(e) {
		for (var i = 0; i < this.coordinates.length; i += 2) {
			var x = this.coordinates[i];
			var y = this.coordinates[i + 1];
			if (Math.abs(e.clientX - x) < 25 && Math.abs(e.clientY - y) < 25) {
				e.stopPropagation();
				e.preventDefault();
			}
		}
	}
};
$(document).ready(function(){
	$("input[type=text]").addClear({top:1,right:10});
	
	
	var touchMove = false;
	
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
        closeOpenDropdowns();
	    }else{
	     // if the target menu is not being shown then show it
        closeOpenDropdowns();
        $(this).closest('li').addClass('active-link')
        $target.show();
	    }
	    
	    document.addEventListener('touchmove', didScroll, false);
	    document.addEventListener('touchend', tapToClose, false);
	    
	});
	
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

});

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
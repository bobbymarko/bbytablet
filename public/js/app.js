$(document).ready(function(){
	$("input[type=text]").addClear({top:1,right:10});
	
	
	var touchMove = false;
	
	$('.icon-link>a').click(function(e){
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
	   // only close dropdown if we're not tapping within it
	   if ($(e.target).closest('.dropdown-menu').length == 0 && !touchMove){
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
    
    if ($(this).hasClass('dropdown-back')){
      // we are moving back one level
      primary = parent.children('.dropdown-primary-menu').first();
      var secondary = $(this).closest('.dropdown-secondary-menu');
      secondary.addClass('to-right');
      primary.show().addClass('from-left');
      parent.css({height:primary.height()});
      
      setTimeout(function(){ //timeout set to duration of animation
        secondary.hide();
        parent.css({height:'auto'});
        removeAnimationClasses();
      },200);
    }else if (primary.length > 0) { 
      // we are in the initial dropdown
      var target = $($(this).attr('href'));
      primary.addClass('to-left');
      parent.css({height:target.height()});
      $($(this).attr('href')).show().addClass('from-right');
      
      setTimeout(function(){ //timeout set to duration of animation
        primary.hide();
        parent.css({height:'auto'});
        removeAnimationClasses();
      },200);
    } 
  });
  
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
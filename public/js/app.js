$(document).ready(function(){
	$("input[type=text]").addClear({top:1,right:10});
	
	
	$('.icon-link>a').click(function(e){
	    e.preventDefault();
	    
	    target = $(this).attr('href');
	    $target = $(target);
	    
	    if ($target.is(':visible')){
        $('.active-link').removeClass('active-link');
        $target.hide();
	    }else{
        $('.dropdown-menu').hide();
        $('.active-link').removeClass('active-link');
        $(this).closest('li').addClass('active-link')
        $target.show();
	    }
	    
	});
	
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
        $('.to-right').removeClass('to-right');
        $('.from-left').removeClass('from-left');
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
        $('.to-left').removeClass('to-left');
        $('.from-right').removeClass('from-right');
      },200);
    } 
  });
  
  $('.close-btn').click(function(e){
    e.preventDefault();
    $(this).closest('div').remove();
  });

});
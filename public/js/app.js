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
    
    var primary = $(this).closest('.dropdown-primary-menu');
    if (primary.length > 0) { //are we in the initial dropdown?
      primary.hide();
      $($(this).attr('href')).show();
    }
  });

});
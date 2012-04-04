var myScroll;
var currentPage = 1;
var loading = false;

$(function(){
		var searchTerm = getParameterByName('search');
		loadProducts();
		
		if (searchTerm){
		$('.search-field', '#masthead').val(getParameterByName('search'));
		$('h1','.title-bar').html('<span id="total-search-results"></span> results for "'+searchTerm+'"');
		$('.back-btn', '.title-bar').text('Home').attr('href','/');
		}
		
		$('#load-more').click(function(e){
				loadProducts();
				$(this).addClass('loading');
				e.preventDefault();
		});
		
		$(window).scroll(function(){
			if ($(window).scrollTop() > $(document).height() - $(window).height() - 500){
				loadProducts();
			}
		});
		
		if (Modernizr.appleios) {
			$('label[for]').live('click',function(e) { //making clicking the label check the checkbox on ios.
				var checkbox = $('#'+$(this).attr('for'));
				if (checkbox.prop('checked')){
					checkbox.prop('checked',false);
					checkbox.trigger('click');
				}else{
					checkbox.prop('checked',true);
					checkbox.trigger('click');
				}
				e.stopPropagation();
			});
		}
		
		//fixed positioning needs to be implemented like this http://jquerymobile.com/demos/1.0.1/docs/toolbars/index.html#/demos/1.0.1/docs/toolbars/bars-fixed.html
		if (!Modernizr.positionfixed){
			document.body.addEventListener('touchmove', function(e) {
				$('#compare-bar').css('opacity',0);
			}, false);
			document.body.addEventListener('touchend', function(e) {
				$('#compare-bar').css('opacity',1);
			}, false);
			$(window).scroll(function(){
				fixToBottom($('#compare-bar'));
			});	
		}
		
		var inCompare = [];
		$('input[type="checkbox"]','.product-meta').live('click',function(){
			var $this = $(this);
			var productTile = $this.closest('.product-tile');
			if ($this.is(':checked')){
				if (inCompare.length < 4){
					inCompare.push(productTile);
				}else{
					alert('You may compare up to four items at a time.');
					$(this).prop('checked',false);
				}
			} else{ // remove from compare when unchecked
				inCompare = removeFromCompare(inCompare, productTile.attr('data-sku'))
			}
			showCompare(inCompare);
		});
		
		$('.remove','#compare-bar').live('click', function(e){
			var sku = $(this).closest('li').attr('data-sku');
			removeFromCompare(inCompare, sku);
			//$(this).closest('li').children('.image-wrapper').children('img').remove();
			//$(this).remove();
			$(this).closest('li').remove();
			$('ul','#compare-bar').append('<li><div class="image-wrapper"></div></li>');
			// need to fix ordering of items
			console.log('#compare-'+sku);
			$('#compare-'+sku).prop('checked',false);
			e.preventDefault();
		});
		
		$('.compare-btn').live('click', function(e){
			if (inCompare.length < 2){
				alert('You need at least 2 items to compare. Please add another.');
			}else{
				var toCompare = [];
				$.each(inCompare, function(index, item){
					toCompare.push($(item).attr('data-sku'));
				});
				window.location = $(this).attr('href') + '?skus=' + toCompare.join(',');
			}
			e.preventDefault();
		});
		
});

function  fixToBottom(element){
	element.css({'top':$(window).scrollTop()+$(window).height()-element.outerHeight()});
}

function showCompare(products){
	if ($('#compare-bar').length == 0 && products.length > 0){
		$("<div id='compare-bar'><p class='compare-instructions'><strong>Compare up to 4 items</p><ul></ul><a href='/compare.html' class='button secondary compare-btn inactive'>Compare</a><a href='#' class='clear-compare'>Clear</a></div>").appendTo('body');
		if (!Modernizr.positionfixed){
			fixToBottom($('#compare-bar'));
		}
	}else{
		$('ul','#compare-bar').empty();
	}
	if (products.length !== 1) {
			$('.compare-btn').removeClass('inactive');
	}
	$.each(products, function(index, item){
		$('ul','#compare-bar').append('<li data-sku="'+$(item).attr('data-sku')+'"><div class="image-wrapper"><img src="' + $('.product-gallery li:first-child img', item).attr('src') + '" alt=""/></div><a href="#" class="remove">&times;</a></li>');
	});
	var placeholderCount = 4-products.length;
	while(placeholderCount > 0){
		$('ul','#compare-bar').append('<li><div class="image-wrapper"></div></li>');
		placeholderCount--;
	};
	
}

function removeFromCompare(inCompare, sku){
	var removeMe = false;
	$.each( inCompare, function(i, v) {
		if( $(v).attr('data-sku') == sku ) {
			removeMe = i;
		}
	});
	inCompare.splice(removeMe,1);
	console.log(inCompare.length);
	if (inCompare.length == 0) $('#compare-bar').remove();
	if (inCompare.length == 1) $('.compare-btn','#compare-bar').addClass('inactive');
	return inCompare;
}

function loadProducts(){
	if (!loading && currentPage){
		loading = true;
		$('#products').append('<article class="product-tile" id="loading-tile"><div><a class="product-mask"></a><a class="product-gallery"><ul><li><img src="images/loading_48x48.gif" /></li></ul></a></div></div>');
		var query = getParameterByName('search') || "hdtv";
		var url = "http://api.remix.bestbuy.com/v1/products(search="+query+")?page="+currentPage+"&apiKey=amfnpjxnz6c9wzfu4h663z6w&PID=5695620&format=json&sort=salesRankMediumTerm.asc";
		$.jsonp({
			url: url,
			cache: true,
			pageCache: true,
			callback: "work",
			callbackParameter: "callback",
			success: function(data) {
			$('#total-search-results').text(data.total);
  			console.log('search results', data);
				loading = false;
				$('#loading-tile').remove();
				if (data.products.length == 0){
					currentPage = 0;
					return;
				}
				$.each(data.products, function(index, skus){
						if(!skus.customerReviewCount){
							skus.customerReviewCount = 0;
						}
						
						$('#productTemplate').tmpl(skus).appendTo('#products');
				});
				currentPage++;
				
				$('.product-gallery').each(function(){
					if (!$(this).attr('style')){ // ignore gallery if already swipified
						var width = $(this).width();
						
						var images = $('ul',this).children();
						if (images.length > 1){
							var positionMarker = "";
							$.each(images, function(){
								positionMarker += "<em>&bull;</em>"
							});
							$(this).next('.gallery-position').html(positionMarker);
							$(this).next('.gallery-position').children('em').first().addClass('on');
							var slider = new Swipe(this, {
								callback: function(e, pos, el) {
												var i = bullets.length;
												while (i--) {
														bullets[i].className = ' ';
												}
												bullets[pos].className = 'on';
												
												$('span', $(el).closest('div')).each(function(){
													$(this).after('<img src="' + $(this).attr('data-image') + '" alt="" />');
													$(this).remove();
												});
										}
								}),
								bullets = $(this).next('.gallery-position').children('em');
							
							$(this).css('width',width + 'px');
							
						}
					}
				});
				
				/* reconfigure slider width on window size change */
				$(window).bind('resize',function(e){
					$('.product-gallery').each(function(){
						$(this).css('width', $(this).closest('.product-tile').width());
					});
				});
				
			}
		});
	}
}

function formatNumber(n) {
    if (!isFinite(n)) {
        return n;
    }

    var s = ""+n, abs = Math.abs(n), _, i;

    if (abs >= 1000) {
        _  = (""+abs).split(/\./);
        i  = _[0].length % 3 || 3;

        _[0] = s.slice(0,i + (n < 0)) +
               _[0].slice(i).replace(/(\d{3})/g,',$1');

        s = _.join('.');
    }

    return s;
}
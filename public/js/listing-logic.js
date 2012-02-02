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
			if ($(window).scrollTop() > $(document).height() - $(window).height() - 200){
				loadProducts();
			}
		});
		
		if (Modernizr.appleios) {
			$('label[for]').live('click',function(e) { //making clicking the label check the checkbox on ios.
				e.stopPropagation();
			});
		}
		
		//fixed positioning needs to be implemented like this http://jquerymobile.com/demos/1.0.1/docs/toolbars/index.html#/demos/1.0.1/docs/toolbars/bars-fixed.html
		if (!Modernizr.positionfixed){
			$(window).scroll(function(){
				$('#compare-bar').css({'top':$(window).scrollTop()+$(window).height()-$('#compare-bar').height()});
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
					alert('You can only compare 4 items at a time.');
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

function showCompare(products){
	if ($('#compare-bar').length == 0 && products.length > 0){
		$("<div id='compare-bar'><p class='compare-instructions'><strong>Compare up to 4 items in:</strong><br/><a href='/listing.html'>Boomboxes, CD Players & Radios</a></p><ul></ul><a href='/compare.html' class='button secondary compare-btn inactive'>Compare</a><a href='#' class='clear-compare'>Clear</a></div>").appendTo('body');
		console.log(products.length);
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
		var url = "http://api.remix.bestbuy.com/v1/products(search="+query+")?page="+currentPage+"&apiKey=amfnpjxnz6c9wzfu4h663z6w&format=json";
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
						// TODO: need to handle orientation change
						var width = $(this).width();
						//var slider = new Swipe(this);
						var images = $('img',this);
						if (images.length > 1){
							var positionMarker = "";
							$.each(images, function(){
								positionMarker += "<em>&bull;</em>"
							});
							$(this).next('.gallery-position').html(positionMarker);
							$(this).next('.gallery-position').children('em').first().addClass('on');
							var slider = new Swipe(this, {
								callback: function(e, pos) {
												var i = bullets.length;
												while (i--) {
														bullets[i].className = ' ';
												}
												bullets[pos].className = 'on';
										}
								}),
								bullets = $(this).next('.gallery-position').children('em');
							
							$(this).css('width',width + 'px');
						}
					}
				});
			}
		});
	}
}
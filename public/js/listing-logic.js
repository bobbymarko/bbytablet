var myScroll;
var currentPage = 1;
var loading = false;

$(function(){
		//$('#masthead, #footer').fixedPosition();
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
		
		if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
			$('label[for]').live('click',function() {
				e.stopPropagation();
			});
		}
});

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
			console.log(data);
				loading = false;
				$('#loading-tile').remove();
				if (data.products.length == 0){
					currentPage = false;
					return;
				}
				$.each(data.products, function(index, skus){
						console.log(skus);
						if (skus.shortDescription){
							skus.shortDescription = skus.shortDescription.split(';');
							skus.shortDescription = $.map(skus.shortDescription, function(n,i){
									if (i<4){
											return "<li>"+n.trim()+"</li>";
									}else{
											return false;
									}
							});
						}
						
						if(!skus.customerReviewCount){
							skus.customerReviewCount = 0;
						}
						
						$('#productTemplate').tmpl(skus).appendTo('#products');
						currentPage++;
				});
				
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
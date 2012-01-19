var myScroll;
var currentPage = 1;
var loading = false;

$(function(){
		//$('#masthead, #footer').fixedPosition();
		loadProducts();
		
		$('.search-field', '#masthead').val(getParameterByName('search'));
		
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
});

function loadProducts(){
	if (!loading && currentPage){
		loading = true;
		$('#products').append('<article class="product-tile" id="loading-tile"><div><a class="product-mask"></a><a class="product-image"><img src="images/loading_16x16.gif" /></a></div></div>');
		var query = getParameterByName('search') || "tablet";
		var url = "http://api.remix.bestbuy.com/v1/products(search="+query+")?page="+currentPage+"&apiKey=amfnpjxnz6c9wzfu4h663z6w&format=json";
		$.jsonp({
			url: url,
			cache: true,
			pageCache: true,
			callback: "work",
			callbackParameter: "callback",
			success: function(data) {
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
						$('#productTemplate').tmpl(skus).appendTo('#products');
						currentPage++;
				});
				
				$('.product-gallery').each(function(){
					// need to handle orientation change
					var width = $(this).width();
					var slider = new Swipe(this);
					$(this).css('width',width + 'px');
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
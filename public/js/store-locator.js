var game = urldecode(gup('game')) || urldecode("borderlands");
var num_of_products = 0;
var products = '';
var map, lat, lng;
var pins = [];
var pinInfobox;
$(document).ready(function(){
	initialize_map();
	$('#map-wrapper').sap({
			distanceFromTheTop: 0
	});
	$('#location-search').submit(function(e){
		var location = $('input[type="text"]', '#location-search').val();
		console.log(location);
		
		var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?q="+location+"&output=json&jsonp=GeocodeCallback&key=Aqr6275wM4y6fWWci0PTYC4FXKFTBx1XoGsAlUUZP0zW2Dbhw8KENIGKVwnNyD7D";
		
		CallRestService(geocodeRequest);

		e.preventDefault();
	});
	
	
	$('#stores').delegate('li', 'hover',function(){
		console.log(map.entities);
		index = $(this).index('li');
		Microsoft.Maps.Events.invoke(pins[index],'mouseup');
	});
	
	
});

function CallRestService(request) 
{
	var script = document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("src", request);
	document.body.appendChild(script);
}
function GeocodeCallback(result) 
{   
	console.log(result);

	lat = result.resourceSets[0].resources[0].point.coordinates[0];
	lng = result.resourceSets[0].resources[0].point.coordinates[1];
	console.log(lat,lng);
	initialize_map();
}


function initialize_map() {
	// Set the map options
	var mapOptions = {credentials:"Aqr6275wM4y6fWWci0PTYC4FXKFTBx1XoGsAlUUZP0zW2Dbhw8KENIGKVwnNyD7D"};

	// Initialize the map
	map = new Microsoft.Maps.Map(document.getElementById("map-canvas"), mapOptions);

	// Initialize the location provider
	if(!lat){
	var geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);
	// Get the user's current location
	var location = geoLocationProvider.getCurrentPosition({successCallback:get_coords});
	} else {
		get_stores();
	}
}

function get_coords(args){
	lat = args.position.coords.latitude;
	lng = args.position.coords.longitude;
	get_stores();
}

function get_stores(){
	var url = "http://api.remix.bestbuy.com/v1/stores(area(" + lat + "," + lng + ",100))?format=json&page=1&apiKey=amfnpjxnz6c9wzfu4h663z6w";
	$.jsonp({
		url: url,
		cache: true,
		pageCache: true,
		callback: "work",
		callbackParameter: "callback",
	  url: url,
	  success: function(data, textStatus, jqXHR){
		console.log(data);
		map.entities.clear();
		pins = [];
		$('#stores ul').empty();
		$.each(data.stores, function(i,e){

			var store = this;
			var store_number = i+1;
			var location = new Microsoft.Maps.Location(this.lat, this.lng)
			pins.push(new Microsoft.Maps.Pushpin(location, {text: store_number.toString()})); 
			pinInfobox = new Microsoft.Maps.Infobox(pins[i].getLocation(), {title: 'My Pushpin', visible: false});
			map.entities.push(pins[i]);
			map.entities.push(pinInfobox);
			Microsoft.Maps.Events.addHandler(pins[i], 'mouseup', function(e){ 
				pinInfobox.setOptions({ visible:true, title:store.name, description:store.address });
				pinInfobox.setLocation(pins[i].getLocation());
				map.setView({center:pins[i].getLocation()});
			});
			$( "#storeTemplate" ).tmpl( this ).appendTo( "#stores ul" );

		});
	  }
	});
}

function gup( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
	return "";
  else
	return results[1];
}

function urldecode(str){
	return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

(function($){$.fn.sap=function(options){var defaults={distanceFromTheTop:0};options=$.extend(defaults,options);var $objizzle=$(this);if(!$objizzle.length)return;var oldTop=$objizzle.offset().top;var width=$objizzle.width()+'px';var $shim=$('<div class="sap-shimy-shim"></div>');var theWindow=$(window);var theDoc=$(document);theWindow.scroll(function(){var top=theWindow.scrollTop();if((top+options.distanceFromTheTop+$objizzle.height())<(theDoc.height()-theWindow.height())&&(top+options.distanceFromTheTop)>$objizzle.offset().top){$objizzle.css({position:'fixed',width:width,top:options.distanceFromTheTop+'px'});$shim.css({width:width,height:$objizzle.height()});$objizzle.before($shim)}else if(top+options.distanceFromTheTop<oldTop){$shim.remove();$objizzle.css({position:'static',width:width,top:''})}})}}(jQuery));

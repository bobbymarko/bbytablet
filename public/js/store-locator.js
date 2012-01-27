var map, lat, lng;
var pins = [];
var pinInfobox;
$(document).ready(function(){
	$('#store-search').val(getParameterByName('store-search'));
	initialize_map();
	
	$(window).resize(function(){
		resizeMap();
	});
	
	$('a','#stores').live('click', function(e){
		$(this).closest('li').addClass('current-item').siblings().removeClass('current-item');
		console.log(map.entities);
		index = $(this).closest('li').index();
		console.log(index);
		Microsoft.Maps.Events.invoke(pins[index],'mouseup');
		e.preventDefault();
	});
	
	$('.infobox-close').live('click', function(e){
		$('li','#stores').removeClass('current-item');
		e.preventDefault();
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

function resizeMap(){
	$('#map-canvas').css('height',$('.sidebar').height());
}

function initialize_map() {
	// Set the map options
	var mapOptions = {credentials:"Aqr6275wM4y6fWWci0PTYC4FXKFTBx1XoGsAlUUZP0zW2Dbhw8KENIGKVwnNyD7D"};
	// Initialize the map
	map = new Microsoft.Maps.Map(document.getElementById("map-canvas"), mapOptions);
	// Initialize the location provider
	if(!lat){
		if (getParameterByName('store-search')){
			console.log(getParameterByName('store-search'));
			var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?q="+getParameterByName('store-search')+"&output=json&jsonp=GeocodeCallback&key=Aqr6275wM4y6fWWci0PTYC4FXKFTBx1XoGsAlUUZP0zW2Dbhw8KENIGKVwnNyD7D";
			CallRestService(geocodeRequest);
		}else{
			var geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(map);
			// Get the user's current location
			var location = geoLocationProvider.getCurrentPosition({successCallback:get_coords});
		}
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
		// add marker at current location
		currentLocation = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lng), {icon:"images/current-location.png"}); 

		// Get the existing options.
		var options = map.getOptions();
		// Set the zoom level of the map
		options.zoom = 11;
		options.center = new Microsoft.Maps.Location(lat, lng);
		map.setView(options);

		map.entities.push( currentLocation );
		pins = [];
		$('#stores ul').empty();
		$.each(data.stores, function(i,e){
			var store = this;
			var store_number = i+1;
			var store_lat = this.lat;
			var store_lng = this.lng;
			var location = new Microsoft.Maps.Location(store_lat, store_lng);
			pins.push(new Microsoft.Maps.Pushpin(location, {text: store_number.toString()})); 
			pinInfobox = new Microsoft.Maps.Infobox(pins[i].getLocation(), {title: 'My Pushpin', visible: false});
			map.entities.push(pins[i]);
			map.entities.push(pinInfobox);
			Microsoft.Maps.Events.addHandler(pins[i], 'mouseup', function(e){
				$('#stores li').eq(i).addClass('current-item').siblings().removeClass('current-item');
				var storeDescription = '<div class="column"><p>' + store.address + '<br/>' + store.city + ', ' + store.region + ' ' + store.fullPostalCode + '<br/>';
				storeDescription += '<a href="http://maps.google.com/maps?saddr='+lat+','+lng+'&daddr='+store_lat+','+store_lng+'">Get Directions</a></p></div>';
				storeDescription += '<div class="column"><p><strong>Phone:</strong> ' + store.phone + '<br/>';
				storeDescription += '<a href="http://deals.bestbuy.com">View Store\'s Weekly Ad</a></p></div>';
				storeDescription += '<div class="store-hours"><strong>Store Hours</strong><table><thead><tr><td>Mon</td><td>Tue</td><td>Wed</td><td>Thurs</td><td>Fri</td><td>Sat</td><td>Sun</td></tr></thead><tbody><tr><td>10-9</td><td>10-9</td><td>10-9</td><td>10-9</td><td>10-10</td><td>10-10</td><td>10-8</td></tr></tbody></table></div>';
				pinInfobox.setOptions({showCloseButton: true, visible:true, title:store.name + ', ' + store.region, description: storeDescription, offset: new Microsoft.Maps.Point(0,28), width:310, height:180 });
				pinInfobox.setLocation(pins[i].getLocation());
				map.setView({center:pins[i].getLocation()});
			});
			$( "#storeTemplate" ).tmpl( this ).appendTo( "#stores ul" );
		});
		resizeMap();
	  }
	});
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
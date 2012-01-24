var game = urldecode(gup('game')) || urldecode("borderlands");
var num_of_products = 0;
var products = '';
var map, lat, lng;
var pins = [];
var pinInfobox;
$(document).ready(function(){
	initialize_map();
	
	$('#location_search').submit(function(e){
		var location = $('input[type="text"]').val();
		console.log(location);
		
		var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?q="+location+"&output=json&jsonp=GeocodeCallback&key=Aqr6275wM4y6fWWci0PTYC4FXKFTBx1XoGsAlUUZP0zW2Dbhw8KENIGKVwnNyD7D";
		
		CallRestService(geocodeRequest);
		 
	/*	$.ajax({
				url: "",
				dataType: "jsonp",
				success: function( data ) {
					console.log(data.resourceSets[0].resources[0].point.coordinates);
				}
			});*/
		e.preventDefault();
	});
	
	
	$('#stores').delegate('li', 'hover',function(){
		console.log(map.entities);
		index = $(this).index('li');
	//	console.log(index);
//		pins[index].trigger('click');
		Microsoft.Maps.Events.invoke(pins[index],'mouseup');
	});
	
	/*$( "#game" ).autocomplete({
		source: function( request, response ) {
			$.ajax({
				url: "http://api.remix.bestbuy.com/v1/products(search=" + request.term + "&type=game)?format=json&apiKey=amfnpjxnz6c9wzfu4h663z6w",
				dataType: "jsonp",
				success: function( data ) {
					response( $.map( data.products, function( item ) {
						return {
							label: item.name,
							value: item.name,
							icon: item.thumbnailImage,
							value: item.tradeInValue
						}
					}));
				}
			});
		},
		minLength: 2,
		position:{offset:"0 5"}
	}).data( "autocomplete" )._renderItem = function( ul, item ) {
		if (item.value)
		return $( "<li></li>" )
			.data( "item.autocomplete", item )
			.append( "<a><span class='thumbnail'><img src='" + item.icon + "'/></span>" + item.label + "</a>" + "<div class='tradein_value'>Trade-In Value: <span>" + item.value +"</span></div>" )
			.appendTo( ul );
	};*/
	
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
//	get_stores();
//var pin = new Microsoft.Maps.Pushpin(center, {draggable: true}); 
//new Microsoft.Maps.Location(latVal, longVal)
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

/**
* hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
* <http://cherne.net/brian/resources/jquery.hoverIntent.html>
* 
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian(at)cherne(dot)net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}})(jQuery);
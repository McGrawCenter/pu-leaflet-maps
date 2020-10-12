	/*******************************
	* geojson doesn't support circles. Process the geojson to deal with this
	*******************************/

	function geojsonToLayers(geojson) {
	  const layers = [];
	  L.geoJSON(geojson, {
		      pointToLayer: (feature, latlng) => {
			if (feature.properties.radius) {
			  return new L.Circle(latlng, feature.properties.radius);
			} else {
			  return new L.Marker(latlng);
			}
		      },
		      onEachFeature: (feature, layer) => {
			layers.push(layer);
		      }
	  });
	 return layers;
	}




 function doLeaflet(map_id, geojson, zoom) {
 
	  //var map = L.map('MapLocation', { center: [39.73, -104.99], zoom: 10});
	  var map = L.map(map_id, { center: [39.73, -104.99], zoom: 10})

	  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	  }).addTo(map);

	  map.attributionControl.setPrefix(false);
	  var t = geojsonToLayers(geojson);
	  console.log(t);
	  var mylayer = L.featureGroup(t).addTo(map);
	  map.fitBounds(mylayer.getBounds());
	  
 }








jQuery( document ).ready(function() {



console.log('loaded');



  // if there is a big map
/*
  if(jQuery("#MapLocations").length > 0) { 

	  var map = L.map('MapLocations').setView([55,67], 3);

	  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	  }).addTo(map);

	  map.attributionControl.setPrefix(false);

	  var markers = 

	   jQuery.ajax({
		    url: vars.site_url+"?a=puleaf-markers",
		    type: 'GET',
		    async: true,
		    success: function(data) {
			var markers = [];
			jQuery.each(data, function(i,v){
			   var latlng = L.latLng(v.latitude,v.longitude);
			   var marker = new L.marker(latlng, {}).bindPopup("<h5><a href='"+v.url+"'>"+v.post_title+"</a></h5>");
			   markers.push(marker);
			});
			var group = new L.featureGroup(markers);
			group.addTo(map);
			map.fitBounds(group.getBounds());
		    }
		});
  }
*/

});




 function doLeaflet(map_id, coordinate_arr, zoom, title) {
 

 	  console.log(coordinate_arr);

	  var map = L.map(map_id).setView(coordinate_arr, zoom);

	  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	  }).addTo(map);

	  map.attributionControl.setPrefix(false);

	  var marker = new L.marker(coordinate_arr, {}).bindPopup("<b style='margin-bottom:10px;'>"+title+"</b>");
	  map.addLayer(marker);
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



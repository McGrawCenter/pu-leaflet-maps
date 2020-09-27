jQuery( document ).ready(function() {

/*

  jQuery(".puleaf-center").click(function(event){
    var latLngs = [ marker.getLatLng() ];
    var markerBounds = L.latLngBounds(latLngs);
    map.fitBounds(markerBounds);
  });




  jQuery(".puleaf-clear").click(function(event){
    $("#Zoom").val('');
    $("#Latitude").val('');
    $("#Longitude").val('');
  });


  if(vars.mapdata.lat != '' && vars.mapdata.lng != '') {
    var home_coords = [vars.mapdata.lat,vars.mapdata.lng];
    var zoom = vars.mapdata.zoom;
  }
  else {
    var home_coords = [40.346086213021394,285.34687042236334 ];
    var zoom = 3;
  }
  


  var map = L.map('MapLocation').setView(home_coords, zoom);
    */
    
    
  // tile layers
  //http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}
  //https://{s}.tile.osm.org/{z}/{x}/{y}.png
  

  
  
  
  var home_coords = [39.952718, -75.164093 ];
  var zoom = 13;
  
  var map = L.map('MapLocation').setView(home_coords, zoom);
  L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.attributionControl.setPrefix(false);
  
  	/*
       var geojsonFeature = {
	    "type": "Feature",
	    "properties": {
		"name": "Coors Field",
		"amenity": "Baseball Stadium",
		"popupContent": "This is where the Rockies play!"
	    },
	    "geometry": {
		"type": "Point",
		"coordinates": [ -75.164093, 39.952718 ]
	    }
	};   
	*/
	var featureLayer = JSON.parse(vars.mapdata.geoJson);

	var mylayer = L.geoJSON(featureLayer).addTo(map);
	map.fitBounds(mylayer.getBounds());

  
     // FeatureGroup is to store editable layers
     //var drawnItems = new L.FeatureGroup();
     //map.addLayer(drawnItems);
     
     var drawControl = new L.Control.Draw({
	 edit: {
	     featureGroup: mylayer
	 }
     });
     map.addControl(drawControl);
     
     

  map.on('draw:created', function (e) {


    var type = e.layerType,
        layer = e.layer;

    mylayer.addLayer(layer);
    console.log(mylayer);
    console.log(e);
    
    
    var geojson = mylayer.toGeoJSON();
    jQuery('#GeoJSON').val(JSON.stringify(geojson));

    
  });

/*

  map.on('draw:edited', function () {
    // Update db to save latest changes.

    jQuery('#featurelayer').val(toGeoJSON(drawnItems));
    console.log(drawnItems);
  });

  map.on('draw:deleted', function () {
    // Update db to save latest changes.
    jQuery('#featurelayer').val(toGeoJSON(drawnItems));
    console.log(drawnItems);
  });
  
*/
  
  

  
  /*

  var marker = new L.marker(home_coords, {
    draggable: 'true'
  });

  */

/*
  marker.on('dragend', function(event) {
    var position = marker.getLatLng();
    var zoom = map.getZoom();

    marker.setLatLng(position, {
      draggable: 'true'
    }).bindPopup(position).update();

    $("#Zoom").val(zoom);
    $("#Latitude").val(position.lat);
    $("#Longitude").val(position.lng).keyup();
  });


  map.on('zoomend', function() {
      var position = marker.getLatLng();
      var zoom = map.getZoom();

      jQuery("#Zoom").val(zoom);
      jQuery("#Latitude").val(position.lat);
      jQuery("#Longitude").val(position.lng);
  });


  map.on('dblclick', function(e) {
    var position = [e.latlng.lat,e.latlng.lng];
    var zoom = map.getZoom();
    marker.setLatLng(position, {
      draggable: 'true'
    }).bindPopup(position).update();

    jQuery("#Zoom").val(zoom);
    jQuery("#Latitude").val(position.lat);
    jQuery("#Longitude").val(position.lng);

  });


  jQuery("#Latitude, #Longitude").change(function() {
    var position = [parseInt($("#Latitude").val()), parseInt($("#Longitude").val())];
    marker.setLatLng(position, {
      draggable: 'true'
    }).bindPopup(position).update();
    map.panTo(position);
  });

  map.addLayer(marker);


  */


});



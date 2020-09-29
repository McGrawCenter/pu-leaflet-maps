jQuery( document ).ready(function() {


    
  // tile layers
  //http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}
  //https://{s}.tile.osm.org/{z}/{x}/{y}.png
  

	console.log(vars.mapdata);
  
  
	var home_coords = [39.952718, -75.164093 ];
	var zoom = 13;

	var map = L.map('MapLocation').setView(home_coords, zoom);

	L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	map.attributionControl.setPrefix(false);

	if(vars.mapdata.geojson == "") {
	  var mylayer = new L.FeatureGroup();
	}
	else {
	  var featureLayer = JSON.parse(vars.mapdata.geojson);
	  var mylayer = L.geoJSON(featureLayer).addTo(map);
	  map.fitBounds(mylayer.getBounds());
	}

       
      
       
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
    var geojson = mylayer.toGeoJSON();
    jQuery('#GeoJSON').val(JSON.stringify(geojson));


  });


  map.on('draw:edited', function (e) {
    var type = e.layerType,
        layer = e.layer;
    mylayer.removeLayer(layer);
    var geojson = mylayer.toGeoJSON();
    jQuery('#GeoJSON').val(JSON.stringify(geojson));
  });

  map.on('draw:deleted', function (e) {
    var type = e.layerType,
        layer = e.layer;
    mylayer.removeLayer(layer);
    var geojson = mylayer.toGeoJSON();
    jQuery('#GeoJSON').val(JSON.stringify(geojson));
  });
  


});




jQuery( document ).ready(function() {




function createLayersFromJson(data) {
  const layers = [];
  
  jQuery.each(data, function(geo,id){
    L.geoJSON(geo, {
      pointToLayer: (feature, latlng) => {
        if (feature.properties.radius) {
          return new L.Circle(latlng, feature.properties.radius);
        } else {
          return new L.Marker(latlng);
        }
      },
      onEachFeature: (feature, layer) => {
        layer.push(layer);
      },
    });
  });
  
  return layers;
};










    
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

	if(vars.mapdata.geojson == "") {
	  var mylayer = new L.FeatureGroup();
	}
	else {
	  //var geojson = JSON.parse(vars.mapdata.geojson);
	  //console.log(geojson);
	  //var featureLayer = createLayersFromJson(geojson);
	  var featureLayer = JSON.parse(vars.mapdata.geojson);
	  var mylayer = L.geoJSON(featureLayer).addTo(map);
	  //featureLayer.addTo(map);
	  map.fitBounds(mylayer.getBounds());
	}

       
      
       
     var drawControl = new L.Control.Draw({
	 edit: {
	     featureGroup: mylayer
	 }
     });
     
     map.addControl(drawControl);
     
     
	function addRadius(geojson,radius){
	 var index = geojson.features.length - 1;
	 geojson.features[index].properties.radius = radius;
	 return geojson;
	}      
     


	map.on('draw:created', function (e) {
	  var type = e.layerType,
	  layer = e.layer;

	  mylayer.addLayer(layer);
	  var geojson = mylayer.toGeoJSON();
	  /*
 	  if(type == 'circle' || type == 'circlemarker') {
	    geojson = addRadius(geojson,layer._mRadius);
	  }
	  */
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




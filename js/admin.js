jQuery( document ).ready(function() {


  // possible tile layers
  //http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}
  //http://www.google.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}
  //http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}
  //https://{s}.tile.osm.org/{z}/{x}/{y}.png
  
  
        var mylayer;


	/*******************************
	* geojson doesn't support circles. Process the geojson to deal with this
	*******************************/

	function geojsonToLayers(geojson) {
	  const layers = [];
	  L.geoJSON(geojson, {
		      pointToLayer: (feature, latlng) => {
		      	if (feature.properties.radius && feature.properties.radius == 10) {
			  return new L.CircleMarker(latlng, feature.properties.radius);
			} 
			else if (feature.properties.radius) {
			  return new L.Circle(latlng, feature.properties.radius);
			} 
			else {
			  return new L.Marker(latlng);
			}
		      },
		      onEachFeature: (feature, layer) => {
			layers.push(layer);
		      }
	  });
	 return layers;
	}


 	/*******************************
	* set up the map
	*******************************/

	var home_coords = [39.952718, -75.164093 ];
	var zoom = 13;

	
	var map = L.map('MapLocation', { center: [39.73, -104.99], zoom: 10});

	L.tileLayer('http://www.google.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

 	map.attributionControl.setPrefix(false);     
 	
	/*******************************
	* if there is data from WP meta, create a featuregroup
	*******************************/

	var geojson = JSON.parse(vars.mapdata.geojson);
	
	if(geojson.features.length  < 1) {
	  mylayer = new L.FeatureGroup().addTo(map);
	}
	else {
	  var geojson = JSON.parse(vars.mapdata.geojson);

	  var t = geojsonToLayers(geojson);

	  mylayer = L.featureGroup(t).addTo(map);
	  map.fitBounds(mylayer.getBounds());
	}
 	 
      
	/*******************************
	* create and add the drawing controls
	*******************************/      
       
 	var drawControl = new L.Control.Draw({
	  edit: {
	     featureGroup: mylayer
	  }
	});
     
        map.addControl(drawControl);
     


	/*******************************
	* add radius for circles as a property of the geojson
	*******************************/
	function addRadius(geojson,radius){
	 var index = geojson.features.length - 1;
	 geojson.features[index].properties.radius = radius;
	 return geojson;
	}      
     

	/*******************************
	* Leaflet draw control events
	*******************************/
	map.on('draw:created', function (e) {
	  var type = e.layerType,
	  layer = e.layer;

	  mylayer.addLayer(layer);
	  console.log(mylayer);
	  var geojson = mylayer.toGeoJSON();

 	  if(type == 'circle') {
 	    var radius = layer._mRadius;
	    geojson = addRadius(geojson,radius);
	  }
 	  if(type == 'circlemarker') {
 	    var radius = 10;
	    geojson = addRadius(geojson,radius);
	  }

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




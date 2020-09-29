jQuery( document ).ready(function() {




function createLayersFromJson(geojson) {
  const layers = [];
  
  jQuery.each(geojson.features, function(i,geo){
  	    //console.log(geo);
  	    var l = L.geoJSON(geo)
  	    console.log(l);
  	    /*
	    L.geoJSON(geo, {
	      pointToLayer: (feature, latlng) => {
		if (feature.properties.radius) {
		  return new L.Circle(latlng, feature.properties.radius);
		} else {
		  return new L.Marker(latlng);
		}
	      },
	      onEachFeature: (feature, layer) => {
		layers.push(layer);
	      },
	    });
	    */
  });
  return layers;
};




function testing(geojson) {
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

    
  // tile layers
  //http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}
  //http://www.google.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}
  //http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}
  //https://{s}.tile.osm.org/{z}/{x}/{y}.png
 
  
  
	var home_coords = [39.952718, -75.164093 ];
	var zoom = 13;

	
	var map = L.map('MapLocation', { center: [39.73, -104.99], zoom: 10});

	L.tileLayer('http://www.google.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

 	map.attributionControl.setPrefix(false);     
 	
 	
	if(vars.mapdata.geojson == "") {
	  var mylayer = new L.FeatureGroup();
	}
	else {
	  var geojson = JSON.parse(vars.mapdata.geojson);
	  var t = testing(geojson);
	  var mylayer = L.featureGroup(t).addTo(map);
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

 	  if(type == 'circle' || type == 'circlemarker') {
	    geojson = addRadius(geojson,layer._mRadius);
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




jQuery( document ).ready(function() {



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

  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.attributionControl.setPrefix(false);

  var marker = new L.marker(home_coords, {
    draggable: 'true'
  });



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





});



jQuery( document ).ready(function() {


console.log(vars);

console.log("WHAT");

  jQuery(".puleaf-button").click(function(event){
    var latLngs = [ marker.getLatLng() ];
    var markerBounds = L.latLngBounds(latLngs);
    map.fitBounds(markerBounds);
  });




  if(vars.coordinates[0] != '' && vars.coordinates[1] != '') {
    var home_coords = [vars.coordinates[0],vars.coordinates[1]];
    var zoom = vars.coordinates[2];
  }
  else {
    var home_coords = [40.346086213021394,285.34687042236334 ];
    var zoom = 3;
  }



  var map = L.map('MapLocation').setView(home_coords, zoom);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
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

      $("#Zoom").val(zoom);
      $("#Latitude").val(position.lat);
      $("#Longitude").val(position.lng);
  });


  $("#Latitude, #Longitude").change(function() {
    var position = [parseInt($("#Latitude").val()), parseInt($("#Longitude").val())];
    marker.setLatLng(position, {
      draggable: 'true'
    }).bindPopup(position).update();
    map.panTo(position);
  });

  map.addLayer(marker);





});



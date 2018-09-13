<?php 
    /*
    Plugin Name: PU Leaflet Maps
    Plugin URI: http://www.princeton.edu
    Description: Add Leaflet maps to posts
    Author: Ben Johnston - benj@princeton.edu
    Version: 1.0
    */




/**************** REGISTER AND ENQUEUE SCRIPTS AND CSS ***************/

function puleaf_scripts()
{
  global $post;

  wp_register_script('leaflet-js', plugins_url('/js/leaflet.js', __FILE__), array('jquery'),'1.1', true);
  wp_enqueue_script('leaflet-js');

  wp_register_style('leaflet-css', plugins_url('css/leaflet.css',__FILE__ ));
  wp_enqueue_style('leaflet-css');

  wp_register_script('puleaf-simple', plugins_url('/js/script.js', __FILE__), array('jquery'),'1.1', false);
  wp_enqueue_script('puleaf-simple');

  global $post;
  if($post) {
    $lat = get_post_meta($post->ID, '_latitude', true);
    $lon = get_post_meta($post->ID, '_longitude', true);
    $data = array('post_id'=> $post->ID, 'plugin_url' => plugin_dir_url( __FILE__ ), 'lat' => $lat, 'lon' => $lon);
    wp_localize_script( 'puleaf-simple', 'vars', $data);
  }

}
add_action( 'wp_enqueue_scripts', 'puleaf_scripts' );






function puleaf_admin_scripts()
{
  global $post;

  wp_register_script('leaflet-js', plugins_url('/js/leaflet.js', __FILE__), array('jquery'),'1.1', true);
  wp_enqueue_script('leaflet-js');

  wp_register_style('leaflet-css', plugins_url('css/leaflet.css',__FILE__ ));
  wp_enqueue_style('leaflet-css');

  wp_register_style('puleaf-css', plugins_url('css/style.css',__FILE__ ));
  wp_enqueue_style('puleaf-css');

  wp_register_script('puleaf', plugins_url('/js/admin.js', __FILE__), array('jquery'),'1.1', true);
  wp_enqueue_script('puleaf');

  global $post;
  if(!$puleafletmapdata =  unserialize(get_post_meta($post->ID, '_puleafletmap', true))) {
    $puleafletmapdata = array(40.3461,-74.65304,5,0);
  }
    $d = array('plugin_url' => plugin_dir_url( __FILE__ ), 'coordinates' => $puleafletmapdata);
    wp_localize_script( 'puleaf', 'vars', $d);
}
add_action( 'admin_enqueue_scripts', 'puleaf_admin_scripts' ); 




/************************************
* Create a metabox
************************************/
function puleaf_meta_boxes() {
  add_meta_box('puleaf-map-editor',  esc_html__( 'Add a location', 'add-a-location' ), 'puleaf_map_editor_metabox',  array('page','post'), 'normal','default');
}
add_action( 'add_meta_boxes', 'puleaf_meta_boxes' );




/************************************
* Callback generating the html of the metabox
************************************/
function puleaf_map_editor_metabox() {
global $post;
$data = unserialize(get_post_meta($post->ID, '_puleafletmap', true));
?>
   <div id="MapLocation" style='width:100%; height:350px;background:grey;'></div>
   Latitude: <input class='coordinates' id="Latitude" placeholder="Latitude" name="Location.Latitude" value='<?php echo $data[0]; ?>'  />
   Longitude: <input class='coordinates' id="Longitude" placeholder="Longitude" name="Location.Longitude" value='<?php echo $data[1]; ?>'  />
<?php
  if($data[3]) { $checked = "checked='checked'"; } else { $checked = ""; }
?>
   <input type='checkbox' name='Location.CustomZoom' id='zoomcheckbox' value='1' <?php echo $checked; ?>/> Save zoom level <input type='text' id="Zoom" name='Location.ZoomLevel' value='<?php echo $data[2]; ?>' />
   <input type='button' class='puleaf-button' value='Center Map' style='float:right;'/>
<?php
}




/************************************
* Save the metabox
************************************/
function puleaf_save_postdata($post_id)
{

  if($_POST) {
    $post_id = $_POST['ID'];
    if ( array_key_exists('Location_Latitude', $_POST) && array_key_exists('Location_Longitude', $_POST) ) {
	if($_POST['Location_Latitude'] != "" || $_POST['Location_Longitude'] != "") {
	  $puleaf_info = array($_POST['Location_Latitude'], $_POST['Location_Longitude'], $_POST['Location_ZoomLevel'], $_POST['Location_CustomZoom']);
          update_post_meta( $post_id, '_puleafletmap', serialize($puleaf_info) );

	}
    }
  }
}

add_action('save_post', 'puleaf_save_postdata');


/************************************
* Show map on post
************************************/
function puleaf_content_filter($content) {
  global $post;
  $digits = 5;
  $rand = rand(pow(10, $digits-1), pow(10, $digits)-1);

  if ($info = unserialize(get_post_meta($post->ID,'_puleafletmap', true))) {

    $html = "<div id='{$rand}map' style='width:100%; height:350px;background:grey;margin:20px 0px'></div>";
    $html .= "<script>jQuery( document ).ready(function() { var coordinates = [{$info[0]},$info[1]];doLeaflet('{$rand}map',coordinates,'{$info[2]}'); });</script>";

    return $html.$content;
  }
  else {return $content; }
}

add_filter( 'the_content', 'puleaf_content_filter' );




/************************************
* Big map shortcode
************************************/
function puleaf_insert_bigmap( $atts ){
  if(isset($atts['width'])) { $width = $atts['width']; } else { $width = '500px'; }
  if(isset($atts['height'])) { $height = $atts['height']; } else { $height = '350px'; }
  $content = "<div id='MapLocations' style='width:{$width}; height:{$height};background:grey;'></div>";
  return $content;
}
add_shortcode( 'puleaf-bigmap', 'puleaf_insert_bigmap' );




/************************************
* JSON list of markers
************************************/
function markers_json( $atts ){

  if(isset($_GET['a']) && $_GET['a']=='puleaf-markers') {
    $content = array();
    $args = array(
    'post_status' => 'publish',
    'numberposts' => -1
    );
   if($posts = get_posts($args)) {
     foreach($posts as $post) {
       if($data = unserialize(get_post_meta($post->ID,'_puleafletmap',true))) {
	$o = new StdClass();
	$o->post_title = $post->post_title;
	$o->latitude = $data[0];
	$o->longitude = $data[1];
	$o->url = get_permalink($post->ID);
	$content[] = $o;
       }
     }
   }
   header('Content-Type: application/json');
   echo json_encode($content);
   die();
  }

}
add_action( 'init', 'markers_json' );



<?php 
    /*
    Plugin Name: PU Leaflet Maps Advanced
    Plugin URI: http://www.princeton.edu
    Description: Add Leaflet maps to pages and posts with markers, lines, rectangles, circles, etc.
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






function puleaf_admin_scripts( $hook )
{
  global $post;
  
  if ( $hook == 'post-new.php' || $hook == 'post.php' ) {

	  wp_register_script('leaflet-js', plugins_url('/js/leaflet.js', __FILE__), array('jquery'),'1.1', true);
	  wp_enqueue_script('leaflet-js');

	  wp_register_style('leaflet-css', plugins_url('css/leaflet.css',__FILE__ ));
	  wp_enqueue_style('leaflet-css');

	  wp_register_style('puleaf-css', plugins_url('css/style.css',__FILE__ ));
	  wp_enqueue_style('puleaf-css');

	  wp_register_script('puleaf', plugins_url('/js/admin.js', __FILE__), array('jquery'),'1.1', true);
	  wp_enqueue_script('puleaf');
	  
	  wp_register_style('leaflet-draw-css', plugins_url('js/leafletDraw/leaflet.draw.css',__FILE__ ));
	  wp_enqueue_style('leaflet-draw-css');
	  
	  
	  $includes = array(
		"Leaflet.draw.js",
		"Leaflet.Draw.Event.js",
		"Toolbar.js",
		"Tooltip.js",
		"ext/GeometryUtil.js",
		"ext/LatLngUtil.js",
		"ext/LineUtil.Intersect.js",
		"ext/Polygon.Intersect.js",
		"ext/Polyline.Intersect.js",
		"ext/TouchEvents.js",
		"draw/DrawToolbar.js",
		"draw/handler/Draw.Feature.js",
		"draw/handler/Draw.SimpleShape.js",
		"draw/handler/Draw.Polyline.js",
		"draw/handler/Draw.Marker.js",
		"draw/handler/Draw.Circle.js",
		"draw/handler/Draw.CircleMarker.js",
		"draw/handler/Draw.Polygon.js",
		"draw/handler/Draw.Rectangle.js",
		"edit/EditToolbar.js",
		"edit/handler/EditToolbar.Edit.js",
		"edit/handler/EditToolbar.Delete.js",
		"Control.Draw.js",
		"edit/handler/Edit.Poly.js",
		"edit/handler/Edit.SimpleShape.js",
		"edit/handler/Edit.Rectangle.js",
		"edit/handler/Edit.Marker.js",
		"edit/handler/Edit.CircleMarker.js",
		"edit/handler/Edit.Circle.js"
	  );
	  foreach($includes as $filename) {
	    $slug = str_replace(".","_",$filename);
	    wp_register_script( $slug , plugins_url("js/leafletDraw/".$filename, __FILE__  ), array('jquery'),'1.1', true);
	    wp_enqueue_script( $slug );
	  }
	  

	  $screen = get_current_screen();

	  if( $screen->post_type == 'page' || $screen->post_type == 'post'){

	    global $post;
	   //delete_post_meta($post->ID, '_puleafletmap'); //GeoJSON
	    if(!$puleafletmapdata =  json_decode(get_post_meta($post->ID, '_puleafletmap', true))) {
	      $puleafletmapdata = array('zoom'=>5,'geojson'=>'');
	    }

	    $d = array('plugin_url' => plugin_dir_url( __FILE__ ), 'mapdata' => $puleafletmapdata);
	    wp_localize_script( 'puleaf', 'vars', $d);
	  }
   } // if hook is edit-post
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

if($data = get_post_meta($post->ID, '_puleafletmap', true)) {
  $data = json_decode($data);
}
else {
  $data = new StdClass();
  $data->geojson = "";
  $data->zoom = 5;
}

?>
   <div id="MapLocation" style='width:100%;height:370px;background:grey;'></div>

   <input type='hidden' id="Zoom" name='Leaflet.Zoom' value='<?php echo $data->zoom; ?>' />
   <!--<input type='text' id="GeoJSON" name='Leaflet.GeoJSON' value='<?php echo $data->geojson; ?>'/>-->

   
   <input type='button' class='puleaf-clear' value='Clear Location'/> 
   <input type='button' class='puleaf-center' value='Center Map'/>
   <br />
      <textarea type='text' id="GeoJSON" name='Leaflet.GeoJSON' style='width:100%;height:300px;'><?php echo $data->geojson; ?></textarea>


<?php
}




/************************************
* Save the metabox
************************************/
function puleaf_save_postdata($post_id)
{

  if($_POST) {
  
    $post_id = $_POST['ID'];

    if ( array_key_exists('Leaflet_Zoom', $_POST) && array_key_exists('Leaflet_GeoJSON', $_POST) ) {
    
        $puleaf_info = array(
        	"geojson"=>$_POST['Leaflet_GeoJSON'],
        	"zoom"=>$_POST['Leaflet_Zoom']
        );
        update_post_meta( $post_id, '_puleafletmap', json_encode($puleaf_info) );

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
  

  if ($data = json_decode(get_post_meta($post->ID,'_puleafletmap', true))) {
    
    $html = "<div id='{$rand}map' style='width:100%; height:350px;background:grey;margin:20px 0px'></div>";
    $html .= "<script>jQuery( document ).ready(function() { var coordinates = [{$data->lat},{$data->lng}];doLeaflet('{$rand}map',coordinates,'{$data->zoom}','{$data->title}'); });</script>";

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


/******************************************
* 
******************************************/

add_action( 'admin_footer', 'leaflet_draw_javascript_includes' ); 

function leaflet_draw_javascript_includes() {

?>


<?php
}


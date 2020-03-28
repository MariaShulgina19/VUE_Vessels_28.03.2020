<template>

<div id="Frame" class="Franme"> 
   <div id="Map" class="Map" v-on:click="addPopUp" v-on:mousemove="updateCoordinate"> 
          <!-- <mySource v-on:click="ShowMMSI"> Here is mySource</mySource> -->

    <!-- pop up -->
      <p>here is message{{ message }}; Coordinates {{x}} : {{y}}; {{ mousePosTest}},  clicked coordinate {{x1}} : {{y1}};</p> 
          <div id="mouse-position">
            <p>  Lon Lan Position</p>
          </div>

          <div id="popup" class="ol-popup" v-show="isOpen" > 
            <!-- <a href="#" id="popup-closer" class="ol-popup-closer" ></a> -->
              <a href="#" id="popup-closer" class="ol-popup-closer" v-on:click="closePopUp"></a>
                <div id="popup-content"  >
                  <p>{{ message }}</p>    
                </div>
          </div> 
  </div>
<!-- showing coordinates when mouse is moving -->
  <div id="mouse-position"></div>
    <!-- <form>
      <label>Projection </label>
      <select id="projection">
        <option value="EPSG:4326">EPSG:4326</option>
        <option value="EPSG:3857">EPSG:3857</option>
      </select>
      <label>Precision </label>
      <input id="precision" type="number" min="0" max="12" value="4"/>
    </form> -->
</div>
</template>

<script>

import Map from 'ol/Map';
import Overlay from 'ol/Overlay'; //18.03
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as proj from 'ol/proj'; 

//for Mouse Position control 19.03
 import {defaults as defaultControls} from 'ol/control';
 import MousePosition from 'ol/control/MousePosition';
// import ZoomToExtent from 'ol/control/ZoomToExtent';
 
 
 import {createStringXY} from 'ol/coordinate';

// import {toLonLat} from 'ol/proj';
// import {fromLonLat} from 'ol/proj';
//  import {toStringHDMS} from 'ol/coordinate';
//  import * as coordinate from 'ol/coordinate';
// import * as olCoordinate from 'ol/coordinate';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
// import newlist from './components/AllShips.vue'
// import {defaults as defaultControls, ZoomToExtent} from 'ol/control';

//  import newlist from './AllShips.vue'
//  import allShipsList from './AllShipsFromPosition.vue'
  // import pako from 'pako';

export default {
  name: 'Map',
  // components: { //?
  //   AllShips},
  props: {
    msg7: String,
    
    
  },
  data() {
    return {
     
      
      myMap: null,
      myOverlay: null,
      popup: null,

      myVectorLayer:null,

      markers: null, 
      markers2: null, 
      myFeature: [],
      myFeatureItem: null,
      // container : this.popup,
     container :document.getElementById('popup'),
      // content :null,
     content :document.getElementById('popup-content'),
      //  closer: null,
     closer: document.getElementById('popup-closer'),

      message: null,
      myCoordinate: null,
      hdms:null,
      isOpen:false,

      //for Mouse controll
       mousePositionControl:null,
       mousePosTest:null,
       x:0,
       y:0,
       x1:0,
       y1:0,
      // projectionSelect : document.getElementById('projection'),
      // precisionInput : document.getElementById('precision')
      // MyNewStyle:null
      
    }
  },



  


  methods:{

        updateCoordinate:function(event){
          this.x=event.clientX;
          
          this.y=event.clientY;
            //  this.mousePosTest = toLonLat(event.coordinate) // event.coordinate doesn work? Could not place pop up
        },
      
      
        addPopUp: function(evt){

      
            //Here shall be popup with data, but hasFeatureAtPixel = undefined?

             // if (this.myMap.hasFeatureAtPixel(evt.pixel) === true) { //Is there a feature at the given pixel?
              //  var coordinate = event.coordinate;
              this.x1=evt.clientX;
          
               this.y1=evt.clientY;

                this.message= ' you clicked on the map ' + this.x1 +':'+this.y1;
                //  this.popup.setPosition(coordinate);
                this.isOpen = !this.isOpen;
                  //  } else {
                  //      this.popup.setPosition(undefined);
                  //     //  this.closer.blur();
                  //  }

         },

        closePopUp:function(){
          this.popup.setPosition(undefined);
          this.message= ' you clicked ruutu ' //closing because has been clicked on the map
          this.isOpen = false;
        //  this.closer.blur();
        //  return false;
        }
  },
  
  mounted() {
   


    //taking coordinates from local storage
    this.markers=JSON.parse(window.localStorage.getItem('newlist'))
    console.log('markers from local storage' + this.markers)

    // taking coordinates2 from local storage
    this.markers2=JSON.parse(window.localStorage.getItem('allShipsList'))
    console.log('markers2 from local storage' + this.markers2)
    
    // this.mousePosTest=JSON.parse(this.mousePositionControl)


    
    this.$nextTick(function () {

  

      
      // function initMap(){
   this.myMap = new Map({
        target: 'Map',
        //to show coordinates on the map

        controls: defaultControls().extend([this.mousePositionControl  = new MousePosition({
                  coordinateFormat: createStringXY(4),
                  projection: 'EPSG:4326',
                  // comment the following two lines to have the mouse position
                  // be placed within the map.
                  className: 'custom-mouse-position', //CSS class name.
                  target: document.getElementById('mouse-position'),//Specify a target if you want the control to be rendered outside of the map's viewport.
                  undefinedHTML: '&nbsp;' //Markup to show when coordinates are not available (e.g. when the pointer leaves the map viewport).
                  })],
                    // [
                    // new ZoomToExtent({
                    //       extent: 
                    //        [23.03862, 63.859912]
                          
                    //     })

                    // ]

                  
                  ),

        layers: [
          new TileLayer({
            source: new OSM(),
            url: "map.osm",
          })
                ],
          // adding overlay with popup with mmsi
              // overlays: [this.overlay],    

              //OVERLAYES CAN BE ADDED HERE FOR EX:
            //  overlays: [ this.myOverlay= 
            //     new Overlay({
            //     element: this.container,
            //     // position: proj.fromLonLat([23.03862, 63.859912]),
            //       })
            //   ] , 
          //  The view allows to specify the center, resolution, and rotation of the map.
        view: new View({
          center: proj.fromLonLat([23.03862, 63.859912]),
          zoom: 13
        })
});   

//adding overlay to the map

 
  this.popup= new Overlay({
  element:  this.container ,
   position: proj.fromLonLat([23.03862, 63.859912]), //position  for fisrt time, then it appears on the side
   
  });
  this.popup.setPosition(proj.fromLonLat([23.03862, 63.859912])); //way to set up postition to popup

  this.myMap.addOverlay(this.popup);

// pushing coordinates from local storage to myFeature/markers

//  for (var i=0; i<this.myCoordinates.length; i++) {   
   for (var i=0; i<this.markers2.length; i++) { 
      this.myFeatureItem = new Feature({  // new marker
              // geometry: new Point(proj.fromLonLat(this.myCoordinates[i]) reads information from  readymade array
              geometry: new Point(proj.fromLonLat(this.markers2[i]) //shall read from local storage..
              ),
              }),
              this.myFeature.push(this.myFeatureItem);
              //  console.log(this.myFeatureItem);
              //  console.log(this.myFeature);

 }   

this.mySource= new VectorSource({
  target: 'mySource',
  features: this.myFeature,

  style: new Style({
      image: new Icon(({
            // crossOrigin: 'anonymous', it is not getting this icon in some reason
      src: 'icons8-cargo-ship-50.png'
      }))
  })
});

 this.myVectorLayer = new VectorLayer({
  source: this.mySource,
  });
//     this.mySource.addFeatures(this.newFeature);

this.myMap.addLayer(this.myVectorLayer); 

//adding overlay to the map
// this.myMap.addOverlay(this.myOverlay);
 
//    this.popup= new Overlay({
//   element:  this.container 
// });
// this.popup.setPosition(proj.fromLonLat([23.03862, 63.859912]));
// this.myMap.addOverlay(this.popup);
  
})
}
}


</script>
<style >
.Map {
    /* border: 3px solid green;  */
    padding: 20px;
    margin: 20px;
    height: 600px;
    width: 900px;
    text-align: left;
     display: inline-block; 
}
.Frame {
    border: 3px solid green; 
    padding: 20px;
    margin: 20px;
    height: 600px;
    width: 900px;
    text-align: center;
    display: inline-block;
}


/* 18.03 syles for pop up */

 .ol-popup {
        position: absolute;
        background-color: white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: 20px;
        min-width: 140px;
      }
      .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
      }
      .ol-popup-closer:after {
        content: "✖";
      }

      /* .ol-mouse-position  */

/* move controls to the side ?*/
 /* .ol-controls {
     left: unset;
     right: -20px;
  } */


/* Comments about coordinates
 // clientX/Y gives the coordinates relative to the viewport in CSS pixels.
        console.log(event.clientX); // x coordinate
        console.log(event.clientY); // y coordinate

        // pageX/Y gives the coordinates relative to the <html> element in CSS pixels.
        console.log(event.pageX); 
        console.log(event.pagey); 

        // screenX/Y gives the coordinates relative to the screen in device pixels.
        console.log(event.screenX);
        console.log(event.screenY); */
</style>



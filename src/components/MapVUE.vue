<template>

<div id="Frame" class="Frame"> 
  
<!-- <h5>MAP VUELAYERS</h5>
 <p>{{msg8}}</p> 
 <p>here is message{{ message }} current name {{ currentName }};   </p>  -->
  <!-- <p>Time for data request  {{ timeofdatarequest}} free data  </p>  -->

<!-- https://vuelayers.github.io/#/docs/quickstart -->
 <div>
    <!-- <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" v-on:click="addPopUp" -->
     <vl-map ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" 
             data-projection="EPSG:4326" style="height: 400px" @pointermove="onMapPointerMove" :style="{cursor: mapCursor}">
      <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

      <!-- geolocation -->

<!-- 
      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" id="position-feature">
            <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
            <vl-style-box>
              <vl-style-icon src="_media/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc> -->

      <vl-layer-tile id="osm">
        <vl-source-osm></vl-source-osm>
      </vl-layer-tile>

    <!-- one feature POINT -->
<!-- 
      <vl-feature id="point" :properties="{prop: 'value', prop2: 'value'}">
          <vl-geom-point :coordinates="[23.03862, 63.859912]"></vl-geom-point>
      </vl-feature> -->


      <!-- Multipoints -->

     <!-- <vl-feature>
      <vl-geom-multi-point :coordinates="[[116.544921,40.451633],[116.545264,40.451649],[116.545865,40.451698],[116.546144,40.451551],[116.546337,40.451274],[116.546788,40.451143],[116.547324,40.451078],[116.547539,40.450996],[116.547839,40.450719],[116.548440,40.450506],[116.548933,40.450604],[116.549448,40.450604],[116.550242,40.450376],[116.550865,40.450163],[116.551702,40.449935],[116.552581,40.449576]]"></vl-geom-multi-point>
    </vl-feature> -->

   <!-- layer vector -->

   <vl-layer-vector> 
        <!-- <vl-source-vector :features.sync="features" ></vl-source-vector> 24.3 -->   
        <vl-source-vector :features="features" ></vl-source-vector>


      <!-- style box -->

      
        <!-- style for poligon -->

        <vl-style-box>
          <vl-style-stroke color="green" :width="3"></vl-style-stroke>
          <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
          <!-- <vl-style-icon src="./assets/icons8-cargo-ship-50.png" :anchor="[.5, 1]" :scale=".3"></vl-style-icon> -->
         
        </vl-style-box>

        <!-- style for circle -->

        <vl-style-box>
            <vl-style-circle :radius="5">
              <vl-style-fill color="white"></vl-style-fill>
              <vl-style-stroke color="red"></vl-style-stroke>
                  <!-- <vl-style-icon src="./assets/icons8-cargo-ship-50.png" :anchor="[.5, 1]" :scale=".3"></vl-style-icon> -->
            </vl-style-circle>
          </vl-style-box>

            <!-- <vl-overlay id="overlay"  :position="overlayCoordinate" v-show="isOpen"> -->
              <vl-overlay id="overlay"  v-if="currentPosition" :position="currentPosition">
      <template slot-scope="scope">
        <div class="overlay-content">
         <p style="font-weight: bold"> {{currentVesselName}} </p>  <br>
         Position: {{ scope.position }}   <br>
          mmsi:{{ currentName }}
        </div>
      </template>
    </vl-overlay>


      </vl-layer-vector>

      <!-- Overlay -->

    </vl-map>
   
    <!-- showing progress -->
    <!-- <div>
    <p v-if="loading">
      Loading features, please wait...
    </p>
    <p v-if="features.length > 0">
      Loaded features: {{ features.map(feature => feature.id) }}
    </p>
    </div> -->

    <!-- <div style="padding: 20px">
      Zoom: {{ zoom }}<br>
      Center: {{ center }}<br>
      Rotation: {{ rotation }}<br>
      My geolocation: {{ geolocPosition }}
    </div> -->
  </div>
   <p>Note: Last update for free data request  {{ timeofdatarequest}}</p> 
</div>
</template>

<script>
 import * as proj from 'ol/proj'; 


// import VueLayers from 'vuelayers'
// import { Map, TileLayer, OsmSource, Geoloc } from 'vuelayers'
// import 'vuelayers/lib/style.css' // needs css-loader

// Vue.use(VueLayers) //vue is not define

// random generator

// import fakerator from "fakerator";
// let fakerator1 = new fakerator();

export default {
  name: 'Map',
 
  props: {
    msg8: String,
    
    
  },
  data() {
    return {
     
      
      myMap: null,
      markers: null, 
      zoom: 12,
        center: [23.03862, 63.859912],
        rotation: 0,
        geolocPosition: undefined,
        // features: [], //for vector layer
        myFeatureItem: null,
        features: [],
        loading: false, //for vector layer progress inform
        overlayCoordinate: null, // [23.03890, 63.859912],
        isOpen:false,
        message: null,
        coordinate: null,
        currentPosition: undefined,
        currentName: undefined,
        currentVesselName: undefined,
        mapCursor: 'default',
        markers2: null, 
        markers3: null,
        
        timeofdatarequest: new Date().getFullYear()+'-'+("0" + (new Date().getMonth() + 1)).slice(-2)+'-'+("0" + new Date().getDate()).slice(-2)+' '+("0" + (new Date().getHours()-4) ).slice(-2)+':'+("0" + new Date().getMinutes()).slice(-2),
  
    }
  },


// 24.3
 mounted() {  
    // // taking coordinates2 from local storage
    // this.markers2=JSON.parse(window.localStorage.getItem('allShipsList'))
    // console.log('markers2 from local storage' + this.markers2)


     // taking data from combinedtable from local storage
    this.markers3=JSON.parse(window.localStorage.getItem('combinedtable'))
   console.log('markers3 from local storage' + this.markers3)

 this.$nextTick(function () { //23.3
                // console.log(this.markers3);
                // console.log('this.markers2[0] ' + this.markers3[0].coordinate); //this.markers2[0]23.026658,63.840863  this.markers2[0]23.018,63.845
                //   console.log(this.markers3[0].coordinate[0]+','+this.markers3[0].coordinate[1] );
                //   console.log(this.markers3[0].coordinate);
                //     console.log('this.markers2[0].mmsi ' + this.markers3[0].mmsi);
                // console.log('this.markers2[1]' + this.markers3[1].coordinate); //this.markers2[1]230038140
                // console.log('this.markers2[2]' + this.markers3[2].coordinate); //this.markers2[2]23.032455,63.8385
                // console.log('this.markers2[3]' + this.markers3[3].coordinate); //this.markers2[3]230109170
//     this.loading = true
//       this.loadFeatures().then(features => {
//         this.features = features.map(Object.freeze)
//         this.loading = false
//       })    

  
// // })
// },
// pushing coordinates from local storage to myFeature/markers

   for (var i=0; i<this.markers3.length; i++) { ///change back ++
      this.myFeatureItem = 	{
          type: "Feature",
          id: i+1,
          properties: {
            special: true,
            name: this.markers3[i].mmsi,
            vesselname:this.markers3[i].vesselName,
          },
          geometry: {
            type: "Point",
            coordinates: [this.markers3[i].coordinate[0], this.markers3[i].coordinate[1]]  
             
            //  coordinates: [this.markers2[i].coordinate]  //(gives (2) [23.017833, 63.845167, __ob__: Observer]
          }
        },
        // i++, //that it pick up only second data with coordinates
        this.features.push(this.myFeatureItem);
        // console.log('this.myFeatureitem'+ this.myFeatureItem);
        // console.log(this.features);

      // this.myFeatureItem = new Feature({  // new marker
      //         // geometry: new Point(proj.fromLonLat(this.myCoordinates[i]) reads information from  readymade array
      //         geometry: new Point(proj.fromLonLat(this.markers2[i]) //shall read from local storage..
      //         ),
      //         }),
      //         this.features.push(this.myFeatureItem);
              //  console.log(this.myFeatureItem);
              //  console.log(this.myFeature);

     }   

// this.features = [
// 	{
//       type: "Feature",
//       id: 1,
//       properties: {
//         special: true,
//         name: 'one',
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [23.03862, 63.859912]
//       }
//     },
//     {
//       type: "Feature",
//       id: 2,
//       properties: {
//         special: true,
//         name: 'two',
//       },
//       geometry: {
//         type: "Point",
//         coordinates: [23.03862, 63.859212]
//       }
//     }
// ]
})
},

 methods: {
      // emulates external source
      // loadFeatures () {
      //   return new Promise(resolve => {
      //     setTimeout(() => {
      //       // generate GeoJSON random features
      //       resolve([
      //         {
      //           type: "Feature",
      //           id: 1,
      //           geometry: {
      //             type: 'MultiPoint',
      //             coordinates: [[23.03862, 63.859912],[23.03862, 63.859212]],
      //           },
      //           properties: {
      //             "special": true, //24.03
      //             name: 'nameOne',
      //             country:  'Finland',
      //             city: 'Kokkola',
      //             // street: fakerator1.address.street(),
                 
      //           },
      //         },
      //          {
      //           type: "Feature",
      //           id: 3,
      //           geometry: {
      //             type: 'Point',
      //             coordinates: [23.03862, 63.859980],
      //           },
      //           properties: {
      //             name: 'nameTwo',
      //             country:  'Finland',
      //             city: 'Kokkola',
      //             // street: fakerator1.address.street(),
      //           },
      //         },

      //       ])
      //     }, 5000)
      //   })
      // },


        addPopUp: function(evt){

      
            //Here shall be popup with data, but hasFeatureAtPixel = undefined?

             // if (this.myMap.hasFeatureAtPixel(evt.pixel) === true) { //Is there a feature at the given pixel?
              this.coordinate = evt.coordinate;
         
                 this.message= ' you clicked on the map ' + this.coordinate;
                //  this.popup.setPosition(coordinate);
                  this.overlayCoordinate = this.coordinate
                this.isOpen = !this.isOpen;
                  //  } else {
                  //      this.popup.setPosition(undefined);
                  //     //  this.closer.blur();
                  //  }

         },

        onMapPointerMove ({ pixel }) {
          let hitFeature = this.$refs.map.forEachFeatureAtPixel(pixel, feature => feature)

            if (hitFeature) {
              this.mapCursor = 'pointer'
              this.currentPosition = proj.transform(hitFeature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326')
              this.currentName = hitFeature.get('name')
              this.currentVesselName = hitFeature.get('vesselname')
            } else {
              this.mapCursor = 'default'
              this.currentPosition = this.currentName = undefined
            }
        },
  },
    }


// }


</script>
<style >

.Frame {
    /* border: 3px solid green;  */
    padding: 20px;
    margin: 20px;
    height: 500px;
    width: 900px;
    text-align: center;
    display: inline-block;
}

.overlay-content{
/* background: #fff; 
box-shadow: 2px 2px 10px rgba(2,2,2,0.1); 
padding: 2px */
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: 20px;
  min-width: 200px;
}

/* 18.03 syles for pop up */

</style>



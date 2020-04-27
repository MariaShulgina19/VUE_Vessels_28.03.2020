<template>

<div id="Frame" class="Frame"> 

<!-- https://vuelayers.github.io/#/docs/quickstart -->
 <div>

     <vl-map ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" 
             data-projection="EPSG:4326" style="height: 400px" @pointermove="onMapPointerMove" :style="{cursor: mapCursor}">
     <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

     <vl-layer-tile id="osm">
     <vl-source-osm></vl-source-osm>
     </vl-layer-tile>


     <vl-layer-vector> 

     <vl-source-vector :features="features" ></vl-source-vector>
      <vl-style-box>
       <vl-style-stroke color="green" :width="3"></vl-style-stroke>
       <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
          
         
      </vl-style-box>

        <!-- style for circle -->

        <vl-style-box>
            <vl-style-circle :radius="5">
             <vl-style-fill color="white"></vl-style-fill>
             <vl-style-stroke color="red"></vl-style-stroke>
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

  </div>
   <p>Note: Last update for free data request  {{ timeofdatarequest}}. Status: {{information}}</p> 
</div>
</template>

<script>
 import * as proj from 'ol/proj'; 


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
        information: 'data on the way',
    }
  },


// 24.3
 mounted() {  //points are not seen when map is rendered
 console.log(' START MOUNTING MAP ');
  // beforeMount() { 
     
    // taking data from combinedtable from local storage
    this.markers3=JSON.parse(window.localStorage.getItem('combinedtable'))
  // console.log('markers3 from local storage' + this.markers3)
   this.information='data ok',
 console.log(' DATA CAME FROM LOCAL STORAGE ');
 this.$nextTick(function () { //23.3

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
            
          }
        },
       
        this.features.push(this.myFeatureItem);
         console.log(' DATA pushed to features ');

     }   

})
},

 methods: {
      
// this methods are not used
        addPopUp: function(evt){

               this.coordinate = evt.coordinate;
         
               this.message= ' you clicked on the map ' + this.coordinate;
               this.overlayCoordinate = this.coordinate
               this.isOpen = !this.isOpen;
                
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



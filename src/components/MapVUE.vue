<template>

<div id="Frame" class="Frame"> 
 <!-- VESSELS IN 50 km DISTANCE  TABLE-->
<!-- Data is collecting from two axios request and then combined to one list and pushed to local storage  -->
<!-- MapVUE component read data from local storage and render markers to the map  -->

  <div class="allshipsFromPosition"> 
    
     <div class="label">
       
       <button class="Buttion1" v-on:click ="Showcontent">Vessels in {{kmValue}} km distance from Port  </button>
     </div>
             

    <div class="content" v-show="isOpen" style= "max-height: 300px; overflow-y:auto;">
      
             
              <br>
          <table class="vessels">

            <tr>
              <th>Vessel name</th>
              <th>MMSI </th>
              <th>Coordinate: lat, lon</th>
            </tr>
           
            

            <tr v-for= "item in combinedtable" v-bind:key = "item.id"> 
              <td>{{item.vesselName }}</td>
              <td>{{item.mmsi }}</td>
              <td>{{item.coordinate }}</td>
            </tr>

            <tr>
              <th>Total Vessels's amount</th>
              <th> </th>
              <th>{{TotalShips}}</th>
            </tr>
            <br>
          </table>
  </div>

 
            <br>
               <input type="number" min="1" max="500" step="10" name="" value=""   v-model= "kmValue" style= "font-size: 16px; color: rgb(37, 87, 107); margin-left: 250px; margin-right: 10px;" >
               <button type="button" name="button" @click= "addToAdress" style= "font-size: 16px; color: rgb(37, 87, 107);margin-right: 10px; " >Add search area in km </button>
               <button type="button" name="button" @click= "addToAdress" style= "font-size: 16px; color: rgb(37, 87, 107);margin-right: 10px; " >Show vessels on the map </button>
              <br>

  </div>
<!-- https://vuelayers.github.io/#/docs/quickstart --> 
 <div> <!-- VESSELS IN 50 km DISTANCE  MAP-->
 <br>
     <vl-map ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" 
             data-projection="EPSG:4326" style="height: 400px" @pointermove="onMapPointerMove" :style="{cursor: mapCursor}" >
     <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation"></vl-view>

     <vl-layer-tile id="osm">
     <vl-source-osm></vl-source-osm>
     </vl-layer-tile>

     <vl-layer-vector> 
       

     <vl-source-vector v-if="loaded" :features.sync="features" ></vl-source-vector> 
      <!-- <vl-style-box>
       <vl-style-stroke color="green" :width="3"></vl-style-stroke>
       <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
      </vl-style-box> -->


        <!-- style for circle -->

        <vl-style-box>
            <vl-style-circle :radius="5">
             <vl-style-fill color="white"></vl-style-fill>
             <vl-style-stroke color="red"></vl-style-stroke>
             </vl-style-circle>
          </vl-style-box>

       <!-- POP UP <vl-overlay id="overlay"  :position="overlayCoordinate" v-show="isOpen"> -->
      <vl-overlay id="overlay"  v-if="currentPosition" :position="currentPosition">
      <template slot-scope="scope">
        <div class="overlay-content">
         <p style="font-weight: bold"> {{currentVesselName}} </p>  
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
import axios from 'axios';

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
        loaded :false,
        testmessage:"test",

        allShips: null,
        allShipsMmsi: null, 
        allShipsCoordinates: null,
        exportlist:[],
        adress: null,
       newadress3:`https://meri.digitraffic.fi/api/v1/metadata/vessels/`,
       vesselName: null,
       mmsifromVessel:null,
       allShipsList: [], 
       nextID: 1,
       nextIDcomb:1,

       testtable:null,
       testtable2:null,
       combinedtable:[],
       //add method how to calculate request time(when its 00:00 it calculate -4 hours..)
       newadress2: `https://meri.digitraffic.fi/api/v1/locations/latitude/63.859912/longitude/23.03862/radius/50/from/`+ new Date().getFullYear()+'-'+("0" + (new Date().getMonth() + 1)).slice(-2)+'-'+("0" + new Date().getDate()).slice(-2)+'T'+("0" + (new Date().getHours()-4) ).slice(-2)+':'+("0" + new Date().getMinutes()).slice(-2)+'Z',
      //for table
        kmValue: 50,
        TotalShips: 0,
       
    
    }
  },


 mounted: async function() {  


  this.testmethod()
  
  await this.$nextTick()
  this.createcombinetabe();
  await this.$nextTick()

  this.getfeaturesTomap();

},


 methods: { 
   //adding coordinates and vessels data to map markers features 
   getfeaturesTomap(){ 
     
     //clean array
     this.features=[];
     this.$nextTick(function () {

      for (var i=0; i<this.combinedtable.length; i++) { 
      this.myFeatureItem = 	{
          type: "Feature",
          id: i+1,
          properties: {
            special: true,
            name: this.combinedtable[i].mmsi,
            vesselname:this.combinedtable[i].vesselName,
          },
          geometry: {
            type: "Point",
            coordinates: [this.combinedtable[i].coordinate[0], this.combinedtable[i].coordinate[1]]  
            
          }
        },
       
       //adding feature to feature lost
        this.features.push(this.myFeatureItem);
        //loaded=true =>map starts to render
        this.loaded= true;
        this.information='data is ok';
     }  

      })
 
   },
    //getting vessels details from maritraffic:name, identity number and coordinates
   testmethod(){ 
    this.testmessage=" hello you",
    //clean all arrays
    this.exportlist =[];
    this.allShipsList=[];
    this.combinedtable=[];
    this.nextIDcomb=1;
    this.nextID= 1;
    //window.localStorage.removeItem('allShipsList');
    //window.localStorage.removeItem('exportlist');

    this.$nextTick(function () {

       axios.get(this.newadress2)
       .then(response => {

                 this.allShips = response.data.features


                for (var i=0; i<this.allShips.length; i++) {


                    this.allShipsMmsi = response.data.features[i].mmsi //[ 23.02774, 63.864088 ]
                    this.allShipsCoordinates= response.data.features[i].geometry.coordinates

                       
                    
                    //pushing data to local storage
                    this.exportlist.push({coordinate:this.allShipsCoordinates, mmsi:this.allShipsMmsi} )
                    const parsed = JSON.stringify(this.exportlist)
                    window.localStorage.setItem('exportlist', parsed);
                    console.log(' Data pushed to local starage ');

                    this.adress=this.newadress3+this.allShipsMmsi
                    

                    axios.get(this.adress)  //getting vessel name from metadata API b
                              
                    .then(response => {
                          this.vesselName = response.data.name
                          this.mmsifromVessel = response.data.mmsi
                         
                           //saving to table
                          this.allShipsList.push({id: this.nextID, vesselName:this.vesselName, mmsi:this.mmsifromVessel}) 
                            //pushing data to local storage
                          const parsed2 = JSON.stringify(this.allShipsList)
                          window.localStorage.setItem('allShipsList', parsed2);
                        
                           console.log(' Data2 pushed to local starage ');

                          this.nextID++;
                         
                     

                    }) .catch (function(error){
                      console.log(error);
                    
                    })
                    ;
                  }
                  
                  
          
          }).catch (function(error){
            console.log(error);
          })// catch end
       
    })

    
          
   },
   createcombinetabe(){

    this.exportlist =[];
    this.allShipsList=[];
    this.combinedtable=[];
    this.nextIDcomb=1;
    this.$nextTick(function () {
      try{
        this.testtable=JSON.parse(window.localStorage.getItem('exportlist'));
        
        } catch (error){
            console.log(error);
        }
     
     
    // console.log('testtable from local storage ' + this.testtable[0].coordinate)
      try{
       this.testtable2=JSON.parse(window.localStorage.getItem('allShipsList'));

        } catch (error) {
            console.log(error);
        }

     
       this.$nextTick(function () {

    for (var i=0; i<this.testtable.length; i++) {
    this.combinedtable.push({id_: this.nextIDcomb, vesselName:this.testtable2[i].vesselName, mmsi:this.testtable2[i].mmsi, coordinate:this.testtable[i].coordinate})
    this.nextIDcomb++;
    this.TotalShips =this.combinedtable.length;

          }
       })
    })

   },

        //wach poiner moves. Popup window with vessel coordinate when pointer on the marker
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

  //this.isOpen if just open this
Showcontent: function(){
        
            this.isOpen = !this.isOpen; 
          
            
           },

            //creating address to request data, radius and data can vary
addToAdress: async function (){
  //creating address to request data, radius and data can vary
  this.responsAdress= `https://meri.digitraffic.fi/api/v1/locations/latitude/63.859912/longitude/23.03862/radius/`+this.kmValue+`/from/`+ new Date().getFullYear()+'-'+("0" + (new Date().getMonth() + 1)).slice(-2)+'-'+("0" + new Date().getDate()).slice(-2)+'T'+("0" + (new Date().getHours()-4) ).slice(-2)+':'+("0" + new Date().getMinutes()).slice(-2)+'Z'
  this.newadress2= this.responsAdress;

  await this.$nextTick()
  this.testmethod()
  
  await this.$nextTick()
  this.createcombinetabe();
  await this.$nextTick()

  this.getfeaturesTomap();

//Xhanging zoom just to see all markers on the map

    if  (this.kmValue<10)
    this.zoom=12;
    else if (this.kmValue<60)
    this.zoom=9;
     else if (this.kmValue<100)
    this.zoom=7;
    else
    this.zoom=5;  
  
    },
        
  },
}


</script>






<style >

.Frame {
    /* border: 3px solid green;  */
    padding: 20px;
     /* margin: 20px;*/
    margin: auto;
    height: 500px;
    max-width: 900px;
    width: 100%;
    text-align: center;
/* display: inline-block;*/
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

div.allshipsFromPosition{
    /* border: 3px solid orange; */
    /* padding: 20px; */
  /*  margin: 20px;*/
    max-width: 900px;
    width: 100%;
    text-align: left;
    display: inline-block;
}

/* 18.03 syles for pop up */

</style>


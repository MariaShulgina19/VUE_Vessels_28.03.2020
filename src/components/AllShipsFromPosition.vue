<template>
<!-- OUT of use-->
<!-- VESSELS IN 50 km DISTANCE  -->
<!-- Data is collecting from two axios request and then combined to one list and pushed to local storage  -->
<!-- MapVUE component read data from local storage and render markers to the map  -->
  <div class="allshipsFromPosition"> 
    
     <div class="label">
       
       <button class="Buttion1" v-on:click ="Showcontent">Vessels in {{kmValue}} km distance from Port  </button>
     </div>

    <div class="content" v-show="isOpen">
      
              <br>
               <input type="number" name="" value=""   v-model= "kmValue"  >
               <button type="button" name="button" @click= "addToAdress" >Add search area in km</button>
              <br>
              <br>
          <table class="vessels">

            <tr>
              <th>Vessel name</th>
              <th>MMSI </th>
              <th>Coordinate: lat, lon</th>
            </tr>
           
            <br>

            <tr v-for= "item in combinedtable" v-bind:key = "item.id"> 
              <td>{{item.vesselName }}</td>
              <td>{{item.mmsi }}</td>
              <td>{{item.coordinate }}</td>
            </tr>

          </table>
  </div>

  </div>
</template>

<script>
import axios from 'axios';



export default {
  name: 'AllShips',
  props: {
    msg6: String,
    
    
  },
  data: function() {
      return {
      allShips: null,
      allShipsMmsi: null, // added to try to do new list with coordinates /MMSI list
      mmsifromVessel:null, //this mmsi piked from another course
      allShipsCoordinates: null,
      adress: null,
      allShipsList: [], 
      vesselName: null,
      exportlist:[],
      isOpen: false,

       nextID: 1,
       nextIDcomb:1,

       testtable:null,
       testtable2:null,
       combinedtable:[],

       kmValue: 50,

    
       newadress2: `https://meri.digitraffic.fi/api/v1/locations/latitude/63.859912/longitude/23.03862/radius/50/from/`+ new Date().getFullYear()+'-'+("0" + (new Date().getMonth() + 1)).slice(-2)+'-'+("0" + new Date().getDate()).slice(-2)+'T'+("0" + (new Date().getHours()-4) ).slice(-2)+':'+("0" + new Date().getMinutes()).slice(-2)+'Z',
      
  
       newadress3:`https://meri.digitraffic.fi/api/v1/metadata/vessels/`,                                                             
   
   
        responsAdress: null,
      } //return end
     }, //data end
 
    methods:{
            Showcontent: function(){
        
            this.isOpen = !this.isOpen; //this.isOpen if just open this
          
            
           },


           addToAdress: function (){
             //creating address to request data, radius and data can vary
             this.responsAdress= `https://meri.digitraffic.fi/api/v1/locations/latitude/63.859912/longitude/23.03862/radius/`+this.kmValue+`/from/`+ new Date().getFullYear()+'-'+("0" + (new Date().getMonth() + 1)).slice(-2)+'-'+("0" + new Date().getDate()).slice(-2)+'T'+("0" + (new Date().getHours()-4) ).slice(-2)+':'+("0" + new Date().getMinutes()).slice(-2)+'Z'
             this.newadress2= this.responsAdress;
          console.log(' HALOO HALOOOO this responseadress!!! '+ this. responsAdress);
               },
          },

    created(){ //
         //   console.log(' this newadress '+ this.newadress);
          // console.log(' this newadress2 '+ this.newadress2);

           console.log(' HALOO this responseadress '+ this.newadress2);
         
            axios.get(this.newadress2)
            
          
                
          .then(response => {

                this.allShips = response.data.features


                for (var i=0; i<this.allShips.length; i++) {


                    this.allShipsMmsi = response.data.features[i].mmsi //[ 23.02774, 63.864088 ]
                    this.allShipsCoordinates= response.data.features[i].geometry.coordinates

                    //pushing data to local storage
                    this.exportlist.push({coordinate:this.allShipsCoordinates, mmsi:this.allShipsMmsi} )
                    const dataNearbyPort = JSON.stringify(this.exportlist)
                    window.localStorage.setItem('allShipsList', dataNearbyPort);
                    console.log(' Data pushed to local starage ');
                    

                    this.adress=this.newadress3+this.allShipsMmsi
                    // console.log(' this adress '+ this.adress);

                          axios.get(this.adress)  //
                              
                    .then(response => {
                          this.vesselName = response.data.name
                          this.mmsifromVessel = response.data.mmsi
                           //pushing data to local storage
                        
                          this.allShipsList.push({id: this.nextID, vesselName:this.vesselName, mmsi:this.mmsifromVessel}) //undefined
                          const dataNearbyPort2 = JSON.stringify(this.allShipsList)
                          window.localStorage.setItem('allShipsList2', dataNearbyPort2);
                        
                         console.log(' Data2 pushed to local starage ');

                          this.nextID++;
                          this.information='data received';

                   
                    }) .catch (function(error){
                      console.log(error);
                    
                    });
                  }
          
          }).catch (function(error){
            console.log(error);
          });// catch end






 //24.3.2020
     this.testtable=JSON.parse(window.localStorage.getItem('allShipsList'))
    // console.log('testtable from local storage ' + this.testtable[0].coordinate)

     this.testtable2=JSON.parse(window.localStorage.getItem('allShipsList2'))
    for (var i=0; i<this.testtable.length; i++) {
    this.combinedtable.push({id_: this.nextIDcomb, vesselName:this.testtable2[i].vesselName, mmsi:this.testtable2[i].mmsi, coordinate:this.testtable[i].coordinate})
    this.nextIDcomb++;
          }

    //pushing combined data to local storage
         
        window.localStorage.setItem('combinedtable', JSON.stringify(this.combinedtable));
         console.log(' Data Combined pushed to local starage ');


    
},// created end



   } //export default end

</script>
<style >
div.allshipsFromPosition{
    /* border: 3px solid orange; */
    padding: 20px;
    margin: 20px;
    width: 900px;
    text-align: left;
    display: inline-block;
   
}


</style>

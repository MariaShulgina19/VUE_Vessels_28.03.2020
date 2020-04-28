<template>
<!-- VESSELS CALLED TO PORT  -->
  <div class="allships">

    <div class="label">
      <!-- <h5>{{ msg6 }}, {{currentDate}}</h5> -->
      <button class="Buttion1" v-on:click ="Showcontent">{{ msg6 }}</button> 
    </div>
    

    <div class="content" v-show="isOpen" style="max-height: 300px; overflow-y:auto;">
          <!-- <li v-for= "item in allShips" v-bind:key = "item.id"> {{ item.vesselName }}, {{item.mmsi }}</li> -->
          <br>
          <br>
          <table class="vessels">

            <tr>
              <th>Vessel name</th>
              <th>MMSI / Maritime Mobile Service Identity</th>
            </tr>

          

            <tr v-for= "item in allShips" v-bind:key = "item.id"> 
              <td>{{ item.vesselName }}</td>
              <td>{{item.mmsi }}</td>
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
    allShips2: null, // added to try to do new list with coordinates /MMSI list
    allShips3: [], 
    newlist:[],
    nextID: 1,
    locbyMMSI : null,
    isOpen: false,
    currentDate:new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),
    
    newadress: `https://meri.digitraffic.fi/api/v1/port-calls/FIKOK?date=` + new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),
      // Vessel location by mmsi
    newadress2: `https://meri.digitraffic.fi/api/v1/locations/latest/` //+ 356364000, 10.03


   
      } //return end
      }, //data end


      
    methods:{
    
          Showcontent: function(){
          
           this.isOpen = !this.isOpen; //this.isOpen if just open this
        },
    },

    created(){ 

         axios.get(this.newadress)  //FIKOK by date. This data do not contain coordinates.
                    
                  
          .then(response => {
             
                this.allShips = response.data.portCalls

                //creating table with axios adresses to request coordinate by mmsi number
                this.allShips2=this.allShips.map(function(allShips) { 

                  return `https://meri.digitraffic.fi/api/v1/locations/latest/`+allShips.mmsi; 
                });

              //to get coordinate need to get in separately for each vessel
                for (var i=0; i<this.allShips2.length; i++) {
                    // console.log('TRY ALL SHIPS' + this.allShips[i])
                    axios.get(this.allShips2[i]) //MMSI{356364000}

                      .then(response => {

                          this.locbyMMSI = response.data.features[0].geometry.coordinates //[ 23.02774, 63.864088 ]

                          this.newlist.push(this.locbyMMSI)
                          
                          this.allShips3.push({id: this.nextID, loc:this.locbyMMSI})  //
                         
                          this.nextID++;
                        
                          
                      }) //response end
                    .catch (function(error){
                      console.log(error);
                    }); // catch end

                          } //for end

                // }//response end
                }).catch (function(error){
                  console.log(error);
            });// catch end

}// created end

   } //export default end

</script>
<style >
div.allships {
   /* border: 3px solid rgb(37, 87, 107); */
    padding: 20px;
    margin: 20px;
    width: 900px;
    text-align: left;
    display: inline-block;
}
.Buttion1{

    border: 3px solid rgb(37, 87, 107);
    background-color:rgb(37, 87, 107);
    color: white;
    font-size: 20px;
    border-radius: 12px;
    padding: 20px;
     /* margin: 20px; */
    width: 900px;


}

.Buttion1:hover{

   border: 4px solid white;

}

.vessels{
    border-collapse: collapse;
    width: 100%;
    
    /* padding-left: 10px; */

}

.vessels td, .vessels th {
  border: 1px solid #ddd;
  padding: 8px;
}

.vessels tr:nth-child(even){background-color: #f2f2f2;}

.vessels tr:hover {background-color: #ddd;}


.vessels th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: rgb(63, 142, 173);
  color: white;
}


</style>

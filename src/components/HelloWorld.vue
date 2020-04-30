<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h1> {{ currentDate }}, {{ currentDateDay2 }}</h1>
    
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },

  data: function() 
  {
      return {
                currentDate:new Date().getDate()+'-'+(new Date().getMonth()+1)+'-'+new Date().getFullYear(), //getDate
                days : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                months :["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                //  currentDateDay2: this.days[new Date().getUTCDay()],
                currentDateDay: new Date().getUTCDay(),
                // currentDateDay2: null
            }
  },
  
  computed: 
  {
        // a computed getter
        currentDateDay2: function () {
        // `this` points to the vm instance
         return this.days[new Date().getUTCDay()]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
    /* border: 3px solid green;  */
    padding: 20px;
     /* margin: 20px;*/
    margin: auto;
    max-width: 500px;
    width: 100%;
    text-align: center;
/* display: inline-block;*/
}
</style>

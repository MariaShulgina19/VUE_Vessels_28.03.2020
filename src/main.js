import Vue from 'vue'
import App from './App.vue'


// Vue layers to work with openlayers and OSM  short cut

import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader
Vue.use(VueLayers)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

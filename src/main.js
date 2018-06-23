// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vueResource from 'vue-resource'

// Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  // el: '#app',
  data: {
  	eventBus: new Vue()
  },
  router: router.routers,
  components: { App },
  render: rout => rout(App)
}).$mount('#app');

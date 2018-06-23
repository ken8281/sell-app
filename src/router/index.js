import Vue from 'vue'
import Router from 'vue-router'
import vueResource from 'vue-resource'

import goods from '../components/goods/goods'
import ratings from '../components/ratings/ratings'
import seller from '../components/seller/seller'
import '../common/stylus/index.styl'

Vue.use(Router) 
Vue.use(vueResource)

var routers = new Router({
	linkActiveClass: 'active',
	routes:[{
 		path: '/',
 		redirect: '/goods',
 		component: {template: '<div>home</div>'}
 	},{
 		path: '/goods',
 		component: goods
	},{
 		path: '/ratings',
 		component: ratings
	},{
 		path: '/seller',
 		component: seller
	}]
})

export default {
	routers
}

<template>
  <div id="carcontrol">
  	<transition name='move'>
  		<div class="decrease icon-remove_circle_outline" v-show='food.count>0' @click.stop.prevent='decreaseCart($event)'></div>
  	</transition>
  	<div class="count" v-show='food.count>0'>{{food.count}}</div>
  	<div class="add icon-add_circle" @click.stop.prevent='addCart($event)'></div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
	props: {
		food: {
			type:Object
		}
	},
	methods: {
		addCart (event) {
			if (!event._constructed) {
				return
			}
			if (!this.food.count) {
				Vue.set(this.food, 'count', 1);
			} else {
				this.food.count++;
			}
			this.$root.eventBus.$emit('onballdrop', event.target);
			// console.log(this.$root.eventBus);
		},
		decreaseCart (event) {
			if (!event._constructed) {
				return
			}
			if(this.food.count > 0) {
				this.food.count--;
			}
		}
	}
}
</script>

<style>
#carcontrol {
	font-size: 0;
}
#carcontrol .decrease, #carcontrol .add {
	display: inline-block;
	padding: 6px;
	line-height: 24px;
	font-size: 24px;
	color: rgb(0, 160, 220);
}
#carcontrol .count {
	display: inline-block;
	vertical-align: top;
	width: 12px;
	padding-top: 6px;
	line-height: 24px;
	text-align: center;
	font-size: 10px;
	color: rgb(147, 153, 159);
}
#carcontrol .move-enter-active, #carcontrol .move-leave-active {
	transition: all 0.4s linear;
}
#carcontrol .move-enter, #carcontrol .move-leave-to {
	transform: translate3d(24px, 0, 0) rotate(180deg);
}
</style>
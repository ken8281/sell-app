<template>
  <div>
  	<div id="shopcar">
  		<div class="content" @click='toggleList'>
  			<div class="con-left">
  				<div class="logo-wrapper">
  					<div class='logo' :class='{highlight:totalCount>0}'>
  						<span class="icon-shopping_cart" :class='{highlight:totalCount>0}'></span>
  					</div>
  					<div class="num" v-show='totalCount>0'>{{totalCount}}</div>
  				</div>
  				<div class="price" :class='{highlight:totalPrice>0}'>￥{{totalPrice}}</div>
  				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
  			</div>
  			<div class="con-right" @click.stop='pay'>
  				<div class="pay" :class='{highlight:totalPrice>=20}'>{{payDesc}}</div>
  			</div>
  		</div>
  		<transition name='fold'>
  			<div class="shopcar-list" v-show='listShow'>
  		  		<div class="list-header">
  		  			<h2 class="title">购物车</h2>
  		  			<span class="empty" @click='empty'>清空</span>
  		  		</div>
  		  		<div class="list-content" ref='listContent'>
  		  			<ul>
  		  				<li class="food" v-for='food in selectFoods' :key='food.name'>
  		  					<span class='name'>{{food.name}}</span>
  		  					<div class="price">
  		  						<span>￥{{food.price*food.count}}</span>
  		  					</div>
  		  					<div class='carcontrol-wrapper'><carcontrol :food='food'/></div>
  		  				</li>
  		  			</ul>
  		  		</div>
  			</div>
  		</transition>
		<div class="ball_container">
      		<transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
	        	<div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
	          		<span class="inner inner_hook icon-remove_circle_outline"></span>
	        	</div>
      		</transition-group>
    	</div>
  	</div>
  	<transition name='fade'>
  		<div id="list-mask" @click='hideList' v-show='listShow'></div>
	</transition>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import carcontrol from '../carcontrol/carcontrol.vue';
export default {
	data () {
		return {
			balls: [{
				show: false
			},{
				show: false
			},{
				show: false
			},{
				show: false
			},{
				show: false
			}],
			dropBalls: [],
			fold: true
		}
	},
	components: {
		carcontrol
	},
	props: {
		'select-foods': {
			type: Array,
			default () {
				return []
			}
		},
		'delivery-price': {
			type: Number
		},
		'min-price': {
			type: Number
		}
	},
	computed: {
		totalPrice () {
			let total = 0;
			this.selectFoods.forEach(
				(food) => {
					total += food.price * food.count
				});
			return total;
		},
		totalCount () {
			let count = 0;
			this.selectFoods.forEach(
				(food) => {
					count += food.count;
				});
			return count;
		},
		payDesc () {
			if (this.totalPrice === 0) {
				return `￥${this.minPrice}起送`
			} else if (this.totalPrice < this.minPrice) {
				let diff = this.minPrice - this.totalPrice;
				return `还差￥${diff}起送`
			} else {
				return '去结算'
			}
		},
		listShow () {
			if(!this.totalCount) {
				this.fold = true;
				return false
			};
			let show = !this.fold;
			if(show) {
				this.$nextTick(
					() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							})
						} else {
							this.scroll.refresh();
						}
				});
			}
			return show;
		}
	},
	created() {
		this.$root.eventBus.$on('onballdrop', this.dropped)
	},
	deforeDestroy() {
		this.$root.eventBus.$off('onballdrop', this.dropped)
	},
	methods: {
		toggleList() {
			if (!this.totalCount) {
				return;
			}
			this.fold = !this.fold;
		},
		empty() {
			this.selectFoods.forEach((food) => {
				food.count = 0;
			});
		},
		hideList () {
			this.fold = true;
		},
		pay () {
			if (this.totalPrice < this.minPrice) {
				return
			}
			alert(`支付${this.totalPrice}元`);
		},
		dropped(ev) {
			for(let i = 0; i < this.balls.length; i++) {
				let ball = this.balls[i];
				if (!ball.show) {
					ball.show = true;
					ball.el = ev;
				}
				this.dropBalls.push(ball);
				return;
			}
		},
		beforeEnter(ele) {
			let len = this.balls.length;
      		while (len--) {
        		let ball = this.balls[len];
	        	if (ball.show) {
		          let rect = ball.el.getBoundingClientRect();
		          let x = rect.left - 32;
		          let y = -(window.innerHeight - rect.top - 22);
		          ele.style.display = '';
		          ele.style.webkitTransform = `translate3d(0,${y}px,0)`;
		          ele.style.transform = `translate3d(0,${y}px,0)`;
		          let inner = ele.getElementsByClassName('inner_hook')[0];
		          inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
		          inner.style.transform = `translate3d(${x}px,0,0)`;
		        }
      		}
		},
		enter(ele) {
			ele.offsetHeight;
      		this.$nextTick(() => {
		        ele.style.webkitTransform = 'translate3d(0, 0, 0)';
		        ele.style.transform = 'translate3d(0,0,0)';
		        let inner = ele.getElementsByClassName('inner_hook')[0];
		        inner.style.webkitTransform = 'translate3d(0,0,0)';
		        inner.style.transform = 'translate3d(0,0,0)';
		    });
		},
		afterEnter(ele) {
			let ball = this.dropBalls.shift();
      		if (ball) {
        		ball.show = false;
        		ele.style.display = 'none';
      		}
		}
	}
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';
#shopcar {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 50;
	width: 100%;
	height: 48px;
}
#shopcar .content {
	display: flex;
	background-color: #141d27;
	color: rgba(255, 255, 255, 0.4);
	font-size: 0;
}
#shopcar .content .con-left {
	flex: 1;
}
#shopcar .con-left .logo-wrapper {
	display: inline-block;
	position: relative;
	top: -10px;
	margin: 0 12px;
	padding: 6px;
	width: 56px;
	height: 56px;
	box-sizing: border-box;
	vertical-align: top;
	border-radius: 50%;
	background-color: #141d27;
}
#shopcar .con-left .logo {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: #2b343c;
	text-align: center;
}
#shopcar .con-left .logo.highlight {
	background-color: rgb(0, 160 ,220);
}
#shopcar .con-left .num {
	position: absolute;
	top: 0;
	right: 0;
	width: 24px;
	height: 16px;
	line-height: 16px;
	text-align: center;
	border-radius: 16px;
	font-size: 9px;
	font-weight: 700;
	color: #fff;
	background-color: rgb(240, 20, 20);
	box-shadow: 0 4px 8px 0 rgba(240, 20, 20, 0.4);
}
#shopcar .con-left .icon-shopping_cart {
	line-height: 44px;
	font-size: 24px;
	color: #80858a;
}
#shopcar .con-left .icon-shopping_cart.highlight {
	color: #fff;
}
#shopcar .con-left .price {
	display: inline-block;
	vertical-align: top;
	margin-top: 12px;
	padding-right: 12px;
	line-height: 24px;
	border-right: 1px solid rgba(255, 255, 255, 0.1);
	box-sizing: border-box;
	font-size: 16px;
	font-weight: 700;
}
#shopcar .con-left .price.highlight {
	color: #fff;
}
#shopcar .con-left .desc {
	display: inline-block;
	vertical-align: top;
	line-height: 24px;
	margin: 12px 0 0 12px;
	font-size: 10px;
}
#shopcar .content .con-right {
	flex: 0 0 105px;
	width: 105px;
}
#shopcar .con-right .pay {
	height: 48px;
	line-height: 48px;
	padding: 0 8px;
	text-align: center;
	font-size: 12px;
	font-weight: 700;
	background-color: #2b333b;
}
#shopcar .con-right .pay.highlight {
	background-color: #00b43c;
	color: #fff;
}
#shopcar .ball-container .ball {
	position: fixed;
	left: 32px;
	bottom: 22px;
	z-index: 200;
}
#shopcar .drop-enter-active {
	transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41);
}

#shopcar .inner {
	display:inline-block;
    width:16px;
    height:16px;
    border-radius:50%;
    background:rgb(0,160,220);
    transition:all 0.4s linear;
}

#shopcar .shopcar-list {
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100%;
	transform: translateY(-100%);
}
#shopcar .shopcar-list.fold-enter-active, #shopcar .shopcar-list.fold-leave-active {
	transition: all 0.5s;
}
#shopcar .shopcar-list.fold-enter, #shopcar .shopcar-list.fold-leave-to {
	transform: translateY(0);
}
#shopcar .shopcar-list .list-header {
	height: 40px;
	line-height: 40px;
	padding: 0 18px;
	background-color: #f3f5f7;
	border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
#shopcar .shopcar-list .title {
	float: left;
	font-size: 14px;
	color: rgb(7, 17, 27);
}
#shopcar .shopcar-list .empty {
	float: right;
	font-size: 12px;
	color: rgb(0, 160, 220);
}
#shopcar .shopcar-list .list-content {
	padding: 0 18px;
	max-height: 217px;
	overflow: hidden;
	background-color: #fff;
}
#shopcar .shopcar-list .food {
	position: relative;
	padding: 12px 0;
	box-sizing: border-box;
	border-1px: (rgba(7, 17, 27, 0.1));
}
#shopcar .list-content .name {
	font-size: 14px;
	line-height: 24px;
	color: rgb(7, 17, 27);
}
#shopcar .list-content .price {
	position: absolute;
	right: 90px;
	bottom: 12px;
	line-height: 24px;
	font-size: 14px;
	font-weight: 700;
	color: rgb(240, 20, 20);
}
#shopcar .shopcar-list .carcontrol-wrapper {
	position: absolute;
	right: 0;
	bottom: 6px;
}
#list-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 40;
	background-color: rgba(7, 17, 27, 0.6);
	filter: blur(10px);
	opacity: 1;
}
#list-mask.fade-enter-active, #list-mask.fade-leave-active {
	transition: opacity 0.5s;
}
#list-mask.fade-enter, #list-mask.fade-leave-to {
	opacity: 0;
}

</style>
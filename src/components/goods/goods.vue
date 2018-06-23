<template>
<div id="goods">
	<div class="menu-wrapper" ref='menuWrapper'>
		<ul>
			<li class="menu-item" v-for='(good, goodIdx) in goods' :class='{current:currentIndex===goodIdx}' 
			@click='selectMenu(goodIdx,$event)' :key='goodIdx'>
				<p class="text border-1px" >
					<span v-show='good.type>-1' class="icon" :class='classMap[good.type]'></span>{{good.name}}
				</p>
			</li>
		</ul>
	</div>
	<div class="foods-wrapper" ref='foodsWrapper'>
		<ul>
			<li class="food-list  food-list-hook" v-for='item in goods' :key='item.name'>
				<h2 class="title">{{item.name}}</h2>
				<ul>
					<li class="food-item border-1px" v-for='food in item.foods' :key='food.name' @click='selectFood(food, $event)'>
						<div class="icon"><img :src="food.icon"></div>
						<div class="content">
							<h3 class='name'>{{food.name}}</h3>
							<p v-show='food.description' class="desc">{{food.description}}</p>
							<div class="extra">
								<span class="selled">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
							</div>
							<div class="price">
								<span class="now">&yen;{{food.price}}</span><span v-show='food.oldPrice' class="old">&yen;{{food.oldPrice}}</span>
							</div>
							<div class="carcontrol-wrapper">
								<carcontrol :food='food'></carcontrol>
							</div>
						</div>
					</li>
				</ul>
			</li>
		</ul>
	</div>
	<shopcar :select-foods='selectFoods' :delivery-price='seller.deliveryPrice' :min-price='seller.minPrice'></shopcar>
	<food :food='selectedFood' ref='food' style=''></food>
</div>
</template>

<script>
import BScroll from 'better-scroll';
import shopcar from '../shopcar/shopcar';
import carcontrol from '../carcontrol/carcontrol.vue'
import food from '../food/food.vue';

const dataOk = 0;

export default {
	props: {
		seller: {
			type: Object
		}
	},
	data () {
		return {
			goods: [],
			listHeight: [],
			scrollY: 0,
			selectedFood: {}
		}
	},
	computed: {
		currentIndex () {
			for (let i = 0; i < this.listHeight.length; i++) {
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i+1];
				if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
					return i;
				}
			}
			return 0;
		},
		selectFoods () {
			let foods = [];
			this.goods.forEach(
				(good) => {
					good.foods.forEach(
						(food) => {
							if(food.count) {
								foods.push(food)
							}
						});
				});
			return foods;
		}
	},
	created () {
		this.$http.get('/api/goods').then(
			(response) => {
				response = response.body
				if (response.errno === dataOk) {
					this.goods = response.data;
					this.$nextTick(
						() => {
							this._initScroll();
							this._calculateHeight ();
						});
				}
			},
			() => {
				console.log('data is onerro');
			});
		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

	},
	methods: {
		selectMenu (index, event) {
			if (!event._constructed) {
				return
			}
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			let el = foodList[index];
			this.foodsScroll.scrollToElement(el, 300);
		},
		selectFood (food, event) {
			if (!event._constructed) {
				return;
			}
			this.selectedFood = food;
			this.$refs.food.show()
		},
		_initScroll () {
			this.menuScroll = new BScroll(this.$refs.menuWrapper, {
				click: true
			});
			this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
				probeType: 3,
				click: true
			});
			this.foodsScroll.on('scroll', (pos) => {
				this.scrollY = Math.abs(Math.round(pos.y));
			})
		},
		_calculateHeight () {
			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			for (let i = 0; i < foodList.length; i++) {
				let item = foodList[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}
		}
	},
	components: {
		shopcar,
		carcontrol,
		food
	}
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';

#goods {
	display: flex;
	position: absolute;
	top: 174px;
	bottom: 46px;
	width: 100%;
	overflow: hidden;
}
#goods .menu-wrapper {
	flex: 0 0 80px;
	width: 80px;
	background-color: #f3f5f7;
}
#goods .menu-wrapper .menu-item {
	display: table;
	width: 56px;
	height: 54px;
	font-size: 12px;
	padding: 0 12px;
	line-height: 14px;
}
#goods .menu-wrapper .current {
	position: relative;
	z-index: 10;
	margin-top: -1px;
	background-color: #fff;
	font-weight: bold;
}
#goods .menu-wrapper .text {
	display: table-cell;
	width: 56px;
	vertical-align: middle;	
	border-1px(rgba(7, 17, 27, 0.1));
}
#goods .current .text {
	border-none();
}
#goods .menu-wrapper .icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 2px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
#goods .menu-wrapper .decrease {
  bg-image('decrease_3');
}
#goods .menu-wrapper .discount {
  bg-image('discount_3');
}
#goods .menu-wrapper .special {
  bg-image('special_3');
}
#goods .menu-wrapper .invoice {
  bg-image('invoice_3');
}
#goods .menu-wrapper .guarantee {
  bg-image('guarantee_3');
}
#goods .foods-wrapper {
	flex: 1;
}
#goods .foods-wrapper .title {
	padding-left: 14px;
	height: 26px;
	line-height: 26px;
	border-left: 2px solid #d9dde1;
	font-size: 12px;
	color: rgb(147, 153, 159);
	background-color: #f3f5f7;
}
#goods .foods-wrapper .food-item {
	display: flex;
	position: relative;
	margin: 18px;
	padding-bottom: 18px;
	border-1px(rgba(7, 17, 27, 0.1));
}
#goods .foods-wrapper .food-item:last-child {
	border-none();
	margin-bottom: 0;
}
#goods .icon>img {
	width: 57px;
	height: 57px;
}
#goods .food-item .icon {
	flex: 0 0 57px;
	margin-right: 10px;
}
#goods .food-item .name {
	margin: 2px 0 8px;
	font-size: 14px;
	line-height: 14px;
	color: rgb(7, 17, 27);
}
#goods .food-item .desc {
	margin-bottom: 8px;
	font-size: 10px;
	line-height: 12px;
	color: rgb(147, 155, 159);
}
#goods .food-item .extra {
	font-size: 10px;
	line-height: 10px;
	color: rgb(147, 155, 159);
}
#goods .extra .selled {
	margin-right: 12px;
}
#goods .food-item .price {
	font-weight: 700;
	line-height: 24px;
}
#goods .food-item .now {
	margin-right: 8px;
	font-size: 14px;
	color: rgb(240, 20 ,20) ;
}
#goods .food-item .old {
	text-decoration: line-through;
	font-size: 10px;
	color: rgb(147, 155, 159);
}
#goods .food-item .carcontrol-wrapper {
	position: absolute;
	right: 0;
	bottom: 12px;
}
</style>
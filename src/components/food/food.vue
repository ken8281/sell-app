<template>
	<transition name='food-move'> 
		<div id="food" v-show='showFlag' ref='food'>
			<div class="food-content">
				<div class="image-header">
					<img class='pic' :src="food.image" ref='img'>
					<div class='back' @click='hide'><span class='icon-arrow_lift'></span></div>
				</div>
				<div class="content">
					<h2 class="title">{{food.name}}</h2>
					<div class='detail'><span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span></div>
					<div class="price">
						<span class="now">￥{{food.price}}</span><span v-show='food.oldPrice' class="old">￥{{food.oldPrice}}</span>
					</div>
					<div class='carcontrol-wrapper'>
						<carcontrol :food='food'></carcontrol>
					</div>
					<transition name='fade'>
						<div class="buy" v-show='!food.count' @click.stop='addFirst'>加入购物车</div>
					</transition>
				</div>
				<split v-show='food.info'/>
				<div class="info" v-show='food.info'>
					<h3 class="title">商品信息</h3>
					<p class="text">{{food.info}}</p>
				</div>
				<split/>
				<div class='rating'>
					<h3 class="title">商品评价</h3>
					<ratingselect @changeType='onChangeType' @changeContent='onChangeContent' :selectType='selectType' :onlyContent='onlyContent' :desc='desc' :ratings='food.ratings'></ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show='needShow(rating.rateType,rating.text)' class="rating-item border-1px" v-for='rating in food.ratings'>
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar" class="avatar">
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class='text'>
									<span :class="rating.rateType?'icon-thumb_down':'icon-thumb_up'"></span>{{rating.text}}
									<span v-show='food.ratings && !rating.text' class='blank'>该用户没有留下评价</span>
								</p>
							</li>
						</ul>
						<div v-show="!food.ratings || !food.ratings.length" class="no-rating">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition> 
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import carcontrol from '../carcontrol/carcontrol.vue';
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
import {formatDate} from '../../common/js/date.js';

const positive = 0;
const negative = 1;
const all = 2;

export default {
	props: {
		food: {
			type: Object
		}
	},
	data () {
		return {
			showFlag: false,
			selectType: all,
			onlyContent: false,
			desc: {
				all: '全部',
				positive: '推荐',
				negative: '吐槽'
			}
		}
	},
	components: {
		carcontrol,
		split,
		ratingselect
	},
	methods: {
		show() {
			this.showFlag = true;
			this.selectType = all;
			this.onlyContent = false;
			this.$nextTick(
				() => {
					if(!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						})
					} else {
						this.scroll.refresh()
					}
				});
		},
		hide() {
			this.showFlag = false;
		},
		addFirst(event) {
			if (!event._constructed) {
				return
			}
			Vue.set(this.food, 'count', 1);
			this.$root.eventBus.$emit('onballdrop', event.target);
		},
		onChangeType(type) {
			this.selectType = type;
			this.$nextTick(() => {
				this.scroll.refresh();
			});
		},
		onChangeContent(sw) {
			this.onlyContent = sw;
			this.$nextTick(() => {
				this.scroll.refresh();
			});
		},
		needShow(type, text) {
			if(this.onlyContent && !text) {
				return false
			}
			if(this.selectType === all) {
				return true
			} else {
				return type === this.selectType
			}
		}
	},
	filters: {
		formatDate(time) {
			let date = new Date(time);
			return formatDate(date, 'yyyy-MM-dd hh:mm')
		}
	}
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';
#food {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 48px;
	z-index: 30;
	background-color: #fff;
	width: 100%;
}
.food-move-enter-active, .food-move-leave-active {
	transition: all 0.2s linear;
}
.food-move-enter, .food-move-leave-to {
	transform: translateX(100%);
}
#food .image-header {
	/*position: relative;*/
	width: 100%;
	/*height: 0;
	padding-top: 100%;*/
	/*以上两行能让盒子的高等于它的宽，
	解决异步请求时，图片载入造成的瞬时高度变化，
	但这个demo出现BUG，food组件无法正常滑入，
	可能与fixed有关，demo所参照的源代码却能正常运行*/
}
#food .pic {
	/*position: absolute;
	top: 0;
	left: 0;*/
	width: 100%;
	height: 100%;
}
#food .image-header .back {
	position: absolute;
	top: 10px;
	left: 0;
}
#food .image-header .icon-arrow_lift {
	display: block;
	padding: 10px;
	font-size: 20px;
	color: rgb(147, 153, 159);
}
#food .food-content .content {
	position: relative;
	padding: 18px;
}
#food .content .title {
	line-height: 14px;
	margin-bottom: 8px;
	font-size: 14px;
	font-weight: 700;
	color: rgb(7, 17, 27);
}
#food .content .detail {
	margin-bottom: 18px;
	line-height: 10px;
	height: 10px;
}
#food .content .sell-count, #food .content .rating {
	font-size: 10px;
	color: rgb(147, 153, 159);
}
#food .content .sell-count {
	margin-right: 12px;
}
#food .price {
	font-weight: 700;
	line-height: 24px;
}
#food .price .now {
	margin-right: 8px;
	font-size: 14px;
	color: rgb(240, 20 ,20) ;
}
#food .price .old {
	text-decoration: line-through;
	font-size: 10px;
	color: rgb(147, 155, 159);
}
#food .food-content .carcontrol-wrapper {
	position: absolute;
	right: 12px;
	bottom: 12px;
}
#food .food-content .buy {
	position: absolute;
	right: 18px;
	bottom: 18px;
	z-index: 10;
	height: 24px;
	line-height: 24px;
	padding: 0 12px;
	box-sizing: border-box;
	border-radius: 12px;
	font-size: 10px;
	color: #fff;
	background-color: rgb(0, 160, 220);
	transition: opacity 0.4s;
}
#food .food-content .fade-enter, #food .food-content .fade-leave-to {
	opacity: 0;
}
#food .food-content .info {
	padding: 18px;
}
#food .info .title {
	line-height: 14px;
	margin-bottom: 6px;
	font-size: 14px;
	color: rgb(7, 17, 27);
}
#food .info .text {
	line-height: 24px;
	padding: 0 8px;
	font-size: 12px;
	color: rgb(77, 85, 93);
}
#food .rating {
	padding-top: 18px;
}
#food .rating .title {
	line-height: 14px;
	margin-left: 18px;
	font-size: 14px;
	color: rgb(7, 17, 27);
}
#food .rating .rating-wrapper {
	padding: 0 18px;
}
#food .rating-wrapper .rating-item {
	position: relative;
	padding: 16px 0;
	border-1px(rgba(7,17,27,0.1));
}
#food .rating-wrapper .user {
	position: absolute;
	right: 0;
	top: 16px;
	line-height: 12px;
	font-size: 0;
}
#food .rating-wrapper .name {
	display: inline-block;
	margin-right: 6px;
	vertical-align: top;
	font-size: 10px;
	color: rgb(147, 153, 159);
}
#food .rating-wrapper .avatar {
	width:12px;
	height:12px;
	border-radius: 50%;
}
#food .rating-wrapper .time {
	margin-bottom: 6px;
	line-height: 12px;
	font-size: 10px;
	color: rgb(147, 153, 159);
}
#food .rating-wrapper .text {
	line-height: 16px;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
#food .icon-thumb_up,#food .icon-thumb_down {
	margin-right: 4px;
	line-height: 16px;
	font-size: 12px;
}
#food .icon-thumb_up {
	color: rgb(0, 160, 220);
}
#food .icon-thumb_down {
	color: rgb(147, 153, 159);
}
#food .rating .no-rating {
	padding: 16px 0;
	font-size: 12px;
	color: rgb(147, 153, 159);
}
#food .rating .blank {
	line-height: 16px;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
</style>
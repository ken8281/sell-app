<template>
  <div id="ratings" ref='ratings'>
  	<div class="ratings-content">
  		<div class="overview">
  			<div class="ov-left">
  				<h2 class="score">{{seller.score}}</h2>
  				<div class="title">综合评分</div>
  				<div class="rank">高于周边商家{{seller.rankRate}}%</div>
  			</div>
  			<div class="ov-right">
  				<div class="score-wrapper">
  					<span class="title">服务态度</span>
  					<star class='star' :size='36' :score='seller.serviceScore'></star>
  					<span class='score'>{{seller.serviceScore}}</span>
  				</div>
  				<div class="score-wrapper">
  					<span class="title">商品评分</span>
  					<star class='star' :size='36' :score='seller.foodScore'></star>
  					<span class='score'>{{seller.foodScore}}</span>
  				</div>
  				<div class="delivery-wrapper">
            		<span class="title">送达时间</span>
            		<span class="delivery">{{seller.deliveryTime}}分钟</span>
          		</div>
  			</div>
  		</div>
  		<split/>
  		<ratingselect @changeType='onChangeType' @changeContent='onChangeContent' :selectType='selectType' :onlyContent='onlyContent' :ratings='ratings'/>
  		<div class="rating-wrapper">
  			<ul>
  				<li v-for='rating in ratings' class="rating-item" v-show='needShow(rating.rateType, rating.text)'>
  					<div class="avatar">
  						<img class="img" :src="rating.avatar">
  					</div>
  					<div class="content">
  						<h2 class="name">{{rating.username}}</h2>
  						<div class="star-wrapper">
  							<star class='star' :size='24' :score='rating.score'/>
  							<span class="delivery" v-show='rating.deliveryTime'>{{rating.deliveryTime}}</span>
  						</div>
  						<p class="text">{{rating.text}}</p>
  						<p class="text" v-show='!rating.text'>该用户没有留下评价</p>
  						<div v-show='rating.recommend && rating.recommend.length' class="recommend">
  							<span class='icon-thumb_up'></span>
  							<span v-for='item in rating.recommend' class="item">{{item}}</span>
  						</div>
  						<div class="time">{{rating.rateTime | formatDate}}</div>
  					</div>
  				</li>
  			</ul>
  		</div>
  	</div>
  </div>
</template>

<script>
import star from '../star/star.vue';
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
import BScroll from 'better-scroll';
import {formatDate} from '../../common/js/date.js';

const all = 2;
const dataOk = 0;

export default {
	props: {
		seller: {
			type: Object
		}
	},
	data() {
		return {
			ratings: [],
			selectType: all,
			onlyContent: false,
		}
	},
	created() {
		this.$http.get('/api/ratings').then((response) => {
			response = response.body
			if(response.errno === dataOk) {
				this.ratings = response.data;
				this.$nextTick(() => {
					this.scroll = new BScroll(this.$refs.ratings, {
						click: true
					})
				});
			}
		},
		() => {
			console.log('ratings-data is onerro');
		})
	},
	methods: {
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
		formatDate (time) {
			let date = new Date(time);
			return formatDate(date, 'yyyy-MM-dd hh:mm')
		}
	},
	components: {
		star,
		split,
		ratingselect
	}
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';

#ratings {
	position: absolute;
	top: 174px;
	left: 0;
	bottom: 0;
	width: 100%;
	overflow: hidden;
}
#ratings .ratings-content .overview {
	display: flex;
	padding: 18px 0;
}
#ratings .overview .ov-left {
	flex: 0 0 137px;
	width: 137px;
	padding: 6px 0;
	border-right: 1px solid rgba(7, 17, 27, 0.1);
	text-align: center;
}
#ratings .ov-left .score {
	margin-bottom: 6px;
	line-height: 28px;
	font-size: 24px;
	color: rgb(255, 153, 0);
}
#ratings .ov-left .title {
	margin-bottom: 8px;
	line-height: 12px;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
#ratings .ov-left .rank {
	line-height: 10px;
	font-size: 10px;
	color: rgb(147, 153, 159);
}
#ratings .overview .ov-right {
	flex: 1;
	padding: 6px 0 6px 24px;
}
#ratings .ov-right .score-wrapper {
	margin-bottom: 8px;
	font-size: 0;
}
#ratings .ov-right .title {
	display: inline-block;
	line-height: 18px;	
	vertical-align: top;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
#ratings .ov-right .star {
	display: inline-block;
	vertical-align: top;
	margin: 0 12px;
}
#ratings .ov-right .score {
	display: inline-block;
	line-height: 18px;
	vertical-align: top;
	font-size: 12px;
	color: rgb(255, 153, 0);
}
#ratings .ov-right .delivery-wrapper {
	font-size: 0;
}
#ratings .delivery-wrapper .title {
	font-size: 12px;
	color: rgb(7, 17, 27);
}
#ratings .delivery-wrapper .delivery {
	margin-left: 12px;
	line-height: 18px;
	font-size: 12px;
	color: rgb(147, 153, 159);
}
@media only screen and (max-width:320px) {
	#ratings .overview .ov-left {
		flex: 0 0 120px;
		width: 120px;
	}
	#ratings .overview .ov-right {
		padding-left: 6px;
	}
	#ratings .ov-right .star {
		margin: 0 6px;
	}
	#ratings .delivery-wrapper .delivery {
		margin-left: 6px;
	}
}
#ratings .rating-wrapper {
	padding: 0 18px;
}
#ratings .rating-wrapper .rating-item {
	display: flex;
	padding: 18px 0;
	border-1px(rgba(7, 17, 27, 0.1));
}
#ratings .rating-wrapper .avatar {
	flex: 0 0 28px;
    width: 28px;
    margin-right: 12px;
}
#ratings .rating-wrapper .img {
	width: 28px;
	height: 28px;
	border-radius: 50%;
}
#ratings .rating-wrapper .content {
	flex: 1;
	position: relative;
}
#ratings .rating-wrapper .name {
	margin-bottom: 4px;
	line-height: 12px;
	font-size: 10px;
	color: rgb(7, 17, 27);
}
#ratings .rating-wrapper .star-wrapper {
	margin-bottom: 6px;
	font-size: 0;
}
#ratings .rating-wrapper .star {
	display: inline-block;
	margin-right: 6px;
	vertical-align: top;
}
#ratings .rating-wrapper .delivery {
	display: inline-block;
	vertical-align: top;
	line-height: 12px;
    font-size: 10px;
	color: rgb(147, 153, 159);
}
#ratings .rating-wrapper .text {
	margin-bottom: 8px;
	line-height: 18px;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
#ratings .rating-wrapper .recommend {
	line-height: 16px;
	font-size: 0;
}
#ratings .rating-wrapper .icon-thumb_up,#ratings .rating-wrapper .item {
	display: inline-block;
	margin: 0 8px 4px 0;
	font-size: 9px;
}
#ratings .rating-wrapper .icon-thumb_up {
	color: rgb(0, 160, 220);
}
#ratings .rating-wrapper .item {
	padding: 0 6px;
	border: 1px solid rgba(7, 17, 27, .1);
	border-radius: 1px;
	color: rgb(147, 153, 159);
	background-color: #fff;
}
#ratings .rating-wrapper .time {
	position: absolute;
	top: 0;
	right: 0;
	line-height: 12px;
	font-size: 10px;
	color: rgb(147, 153, 159);
}
</style>
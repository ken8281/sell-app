<template>
  <div id="seller" ref='seller'>
	<div class="seller-content">
		<div class="overview">
			<h2 class="title">{{seller.name}}</h2>
			<div class="desc border-1px">
				<star class='star' :size='36' :score='seller.score'/>
				<span class="text">({{seller.ratingCount}})</span>
				<span class="text">月售{{seller.sellCount}}单</span>
			</div>
			<ul class='remark'>
				<li class="block">
					<h3>起送价</h3>
					<div class="content">
						<span class="stress">{{seller.minPrice}}</span>元
					</div>
				</li>
				<li class="block">
					<h3>商家配送</h3>
					<div class="content">
						<span class="stress">{{seller.deliveryPrice}}</span>元
					</div>
				</li>
				<li class="block">
					<h3>平均配送时间</h3>
					<div class="content">
						<span class="stress">{{seller.deliveryTime}}</span>分钟
					</div>
				</li>
			</ul>
			<div class="favorite" @click='torggleFacorite'>
				<span class="icon-favorite" :class='{active: favourite}'></span>
				<span class="text">{{favouriteText}}</span>
			</div>
		</div>
		<split/>
		<div class="bulletin">
			<h2 class="title">公告与活动</h2>
			<div class="content-wrapper border-1px">
				<p class="content">{{seller.bulletin}}</p>
			</div>
			<ul v-if='seller.supports' class="ul-supports">
            <li class="support-item border-1px" v-for='supVal in seller.supports' :key='supVal.type'>
              <span class="icon" :class='classMap[supVal.type]'></span>
              <span class="text">{{supVal.description}}</span>
            </li>
          </ul>
		</div>
		<split/>
		<div class='pics'>
			<h2 class="title">商家实景</h2>
			<div class="pic-wrapper" ref='picWrapper'>
				<ul class="pic-list" ref='picList'>
					<li class="pic-item" v-for='pic in seller.pics'>
						<img class='img' :src="pic">
					</li>
				</ul>
			</div>
		</div>
		<split/>
		<div class='info'>
			<h2 class="title border-1px">商家信息</h2>
			<ul>
				<li class="info-item border-1px" v-for='info in seller.infos'>{{info}}</li>
			</ul>
		</div>
	</div>
  </div>
</template>

<script>
import star from '../star/star.vue';
import split from '../split/split.vue';
import BScroll from 'better-scroll';
import {saveToLocal, loadFromLocal} from '../../common/js/store.js';

export default {
	data() {
		return {
			favourite: (() => {
				return loadFromLocal(this.seller.id, 'favourite', false)
			})()
		}
	},
	created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
    	torggleFacorite(event) {
    		if(!event._constructed) {
				return
    		}
    		this.favourite = !this.favourite
    		saveToLocal(this.seller.id, 'favourite', this.favourite)
    	},
    	_initScroll () {
    		this.$nextTick(() => {
	    		if(!this.scroll) {
	      			this.scroll = new BScroll(this.$refs.seller, {
	      				click: true
	      			})
		    	} else {
		    		this.scroll.refresh()
		    	}
		    });
    	},
    	_initPicScroll () {
	    	if(this.seller.pics) {
	    		let pics = this.seller.pics
	    		let picWidth = 120;
	    		let margin = 6;
	    		let width = (picWidth + margin) * pics.length - margin;
	    		this.$refs.picList.style.width = width + 'px';
	    		this.$nextTick(() => {
		    		if(!this.picScroll) {
		      			this.picScroll = new BScroll(this.$refs.picWrapper, {
		      				scrollX: true,
		      				eventPassthrough: 'vertical',
		      			})
			    	} else {
			    		this.picScroll.refresh()
			    	}
			    });
	    	}
    	}
    },
    watch: {
    	//watch的触发时机同update和updated相似，update触发虚拟DOM更新，updated触发DOM更新
    	seller () {
    			this._initScroll();
    			this._initPicScroll();
    	}
    },
    mounted() {
    	this._initScroll();
    	this._initPicScroll();
    },
    computed: {
    	favouriteText () {
    		return this.favourite ? '已收藏' : '收藏'
    	}
    },
	props: {
		seller: {
			type: Object
		}
	},
	components: {
		star,
		split
	}
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';

#seller {
	position: absolute;
	top: 174px;
	left: 0;
	bottom: 0;
	width: 100%;
	overflow: hidden;
}
#seller .overview {
	position: relative;
	padding: 18px;
}
#seller .overview .title {
	margin-bottom: 8px;
	color: rgb(7, 17, 27);
	line-height: 14px;
	font-size: 14px;
}
#seller .overview .desc {
	padding-bottom: 18px;
	font-size: 0;
	border-1px(rgba(7, 17, 27, .1));
}
#seller .overview .star {
	display: inline-block;
	margin-right: 8px;
	vertical-align: top;
}
#seller .overview .text {
	display: inline-block;
	margin-right: 12px;
	vertical-align: top;
	line-height: 18px;
	font-size: 10px;
	color: rgb(77, 85, 93);
}
#seller .overview .favorite {
	position: absolute;
	right: 11px;
	top: 18px;
	width: 50px;
	text-align: center;
}
#seller .favorite .icon-favorite {
	display: block;
	margin-bottom: 4px;
	line-height: 24px;
	font-size: 24px;
	color: #d4d6d9;
}
#seller .favorite .active {
	color: rgb(240, 20, 20);
}
#seller .favorite .text {
	display: block;
	margin: 0 auto;
	line-height: 10px;
	font-size: 10px;
	color: rgb(77, 85, 93);
}
#seller .overview .remark {
	display: flex;
	padding-top: 18px;
}
#seller .overview .block {
	flex: 1;
	text-align: center;
	border-right: 1px solid rgba(7, 17, 27, .1);
}
#seller .overview .block:last-child {
	border-right: 0 none;
}
#seller .block>h3 {
	line-height: 10px;
	font-size: 10px;
	color: rgb(147, 155, 159);
}
#seller .block .content {
	line-height: 24px;
	font-size: 10px;
	color: rgb(7, 17, 27);
}
#seller .block .stress {
	font-size: 24px;
}
#seller .bulletin {
	padding: 18px 18px 0;
}
#seller .bulletin .title {
	margin-bottom: 8px;
	color: rgb(7, 17, 27);
	line-height: 14px;
	font-size: 14px;
}
#seller .bulletin .content-wrapper {
	padding: 0 12px 16px 12px;
	border-1px(rgba(7, 17, 27, .1));
}
#seller .bulletin .content {
	line-height: 24px;
	font-size: 12px;
	color: rgb(240, 20, 20);
}
#seller .ul-supports .support-item {
	padding: 16px 12px;
	font-size: 0;
	border-1px(rgba(7, 17, 27, .1));
}
#seller .ul-supports .support-item:last-child {
	border-none();
}
#seller .ul-supports .icon {
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: top;
	margin-right: 6px;
	background-size: 16px 16px;
	background-repeat: no-repeat;
}
#seller .ul-supports .decrease {
  bg-image('decrease_4');
}
#seller .ul-supports .discount {
  bg-image('discount_4');
}
#seller .ul-supports .special {
  bg-image('special_4');
}
#seller .ul-supports .invoice {
  bg-image('invoice_4');
}
#seller .ul-supports .guarantee {
  bg-image('guarantee_4');
}
#seller .ul-supports .text {
	line-height: 16px;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
#seller .pics {
	padding: 18px;
}
#seller .pics .title {
	margin-bottom: 12px;
	color: rgb(7, 17, 27);
	line-height: 14px;
	font-size: 14px;
}
#seller .pics .pic-wrapper{
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
}
#seller .pics .pic-list {
	font-size: 0;
}
#seller .pics .pic-item {
	display: inline-block;
	margin-right: 6px;
	width: 120px;
	height: 90px;
}
#seller .pics .pic-item:last-child {
	margin-right: 0 none;
}
#seller .pics .img {
	width: 120px;
	height: 90px;
}
#seller .info {
	padding: 18px 18px 0 18px;
	color: rgb(7, 17, 27);
}
#seller .info .title {
	padding-bottom: 12px;
	line-height: 14px;
	font-size: 14px;
	border-1px(rgba(7, 17, 27, .1));
}
#seller .info .info-item {
	padding: 16px 12px;
	line-height: 16px;
	border-1px(rgba(7, 17, 27, .1));
	font-size: 12px;
}
#seller .info .info-item:last-child {
	border-none();
}
</style>
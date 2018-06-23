<template>
  <div id="ratingselect">
  	<div class="rating-type border-1px">
  		<span @click='select(2, $event)' class='block positive' :class='{active: rateType===2}'>{{desc.all}}<span class="count">{{ratings.length}}</span></span>
  		<span @click='select(0, $event)' class='block positive' :class='{active: rateType===0}'>{{desc.positive}}<span class="count">{{positiveLen.length}}</span></span>
  		<span @click='select(1, $event)' class='block negative' :class='{active: rateType===1}'>{{desc.negative}}<span class="count">{{negativeLen.length}}</span></span>
  	</div>
  	<div class="switch" :class='{on: rateContent}' @click='toggleContent'>
  		<span class='icon-check_circle'></span>
  		<span class="text">只看有内容的评价</span>
  	</div>
  </div>
</template>

<script>

const positive = 0;
const negative = 1;
const all = 2;

export default {
	props: {
		ratings: {
			type: Array,
			default() {
				return []
			}
		},
		selectType: {
			type: Number,
			default: all
		},
		onlyContent: {
			type: Boolean,
			default: false
		},
		desc: {
			type: Object,
			default() {
				return {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		}
	},
	data() {
		return {
			//数据命名请勿以'_'开头
			rateStatus: this.selectType,
			rateOnly: this.onlyContent,
		}
	},
	computed: {
		rateType: { 
			get() {
				return this.rateStatus
			},
			set(value) {
				this.rateStatus = value;
			}
		},
		rateContent: { 
			get() {
				return this.rateOnly
			},
			set(value) {
				this.rateOnly = value;
			}
		},
		positiveLen() {
			return this.ratings.filter((rating) => {
				return rating.rateType === positive;
			})
		},
		negativeLen() {
			return this.ratings.filter((rating) => {
				return rating.rateType === negative;
			})
		}
	},
	methods: {
		select(type, event) {
			if(!event._constructed) {
				return
			}
			this.rateType = type;//无需修改局部数据，直接触发事件即可
			this.$emit('changeType', type);
		},
		toggleContent(event) {
			if(!event._constructed) {
				return
			}
			this.rateContent = !this.rateContent;
			this.$emit('changeContent', this.rateContent);
		}
	}
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';

#ratingselect .rating-type {
	padding: 18px 0;
	margin: 0 18px;
	border-1px(rgba(7, 17, 27, 0.1));
	font-size: 0;
}
#ratingselect .rating-type .block {
	display: inline-block;
	padding: 8px 12px;
	margin-right: 8px;
	border-radius: 1px;
	color: rgb(77, 85, 93);
	font-size: 12px;
	line-height: 16px;
}
#ratingselect .block.active {
	color: #fff;
}
#ratingselect .rating-type .count {
	margin-left: 2px;
	font-size: 12px;
}
#ratingselect .rating-type .positive {
	background-color: rgba(0, 160, 220, 0.2);
}
#ratingselect .positive.active {
	background-color: rgb(0, 160, 220);
}
#ratingselect .rating-type .negative {
	background-color: rgba(77, 85, 93, 0.2);
}
#ratingselect .negative.active {
	background-color: rgb(77, 85, 93);
}
#ratingselect .switch {
	padding: 12px 18px;
	line-height: 24px;
	border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	color: rgb(147, 153, 159);
	font-size: 0
}
#ratingselect .switch .icon-check_circle {
	display: inline-block;
	vertical-align: top;
	margin-right: 4px;
	font-size: 24px;
}
#ratingselect .on .icon-check_circle {
	color: #00c850;
}
#ratingselect .switch .text {
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
}
</style>
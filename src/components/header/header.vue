<template>
  <div id="header">
		<div class='content-wrapper'>
			<div class='avatar'><img :src="seller.avatar"></div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div class="supports" v-if='seller.supports'>
          <span class='icon' :class='classMap[seller.supports[0].type]'></span>
          <span class='text'>{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if='seller.supports' class="support-count" @click='showDetail'>
        <span class='count'>{{seller.supports.length}}个</span>
        <span class='icon-keyboard_arrow_right'></span>
      </div>
		</div>
		<div class='bulletin-wrapper' @click='showDetail'>
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <span class="icon-keyboard_arrow_right"></span>  
    </div>
    <div class='header-backdround'><img :src="seller.avatar"></div>
    <transition name="fade">
      <div v-show='detailShow' class='detail'>
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class='name'>{{seller.name}}</h1>
          <div class='star-wrapper'>
            <star :size='size' :score='seller.score'></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text"><span class='info'>优惠信息</span></div>
            <div class="line"></div>
          </div>
          <ul v-if='seller.supports' class="ul-supports">
            <li class="support-item" v-for='supVal in seller.supports' :key='supVal.type'>
              <span class="icon" :class='classMap[supVal.type]'></span>
              <span class="text">{{supVal.description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text"><span class='info'>商家公告</span></div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <span class="icon-close"></span>
      </div>
      </div>
    </transition>
  </div>
</template>

<script>
import star from '../star/star.vue';
	export default {
	  props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false,
        size: 48
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true
      },
      hideDetail () {
        this.detailShow = false
      }
    },
    components: {
      star
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
	}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl';

#header {
  overflow: hidden;
  position: relative;
  background-color: rgba(7, 17, 27, 0.5);
}
#header .content-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  color: rgb(255, 255, 255);
  font-size: 0;
}
#header .avatar {
  margin: 24px 16px 18px 24px; 
}
#header .avatar img{
  width: 64px;
  height: 64px;
  border-radius: 2px;
}
#header .title .name{
  height: 18px;
  line-height: 18px;
  font-size: 16px;
  font-weight: bold;
}
#header .brand {
  display: inline-block;
  width: 30px;
  height: 18px;
  margin-right: 6px;
  bg-image('brand');
  background-size: 30px 18px;
  background-repeat: no-repeat;
  vertical-align: top;
}
#header .description {
  margin-top: 8px;
  margin-bottom: 10px;
  line-height: 12px;
  font-size: 12px;
}
#header .supports .icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
  vertical-align: top;
}
#header .supports .decrease {
  bg-image('decrease_1');
}
#header .supports .discount {
  bg-image('discount_1');
}
#header .supports .special {
  bg-image('special_1');
}
#header .supports .invoice {
  bg-image('invoice_1');
}
#header .supports .guarantee {
  bg-image('guarantee_1');
}
#header .supports .text {
  height: 12px;
  line-height: 12px;
  font-size: 10px;
}
#header .support-count {
  height: 24px;
  position: absolute;
  right: 12px;
  bottom: 14px;
  border-radius: 24px; 
  background-color: rgba(0, 0, 0, 0.2);
  line-height: 24px;
  text-align: center;
}
#header .support-count .count {
  margin: 8px 2px 8px 10px;
  font-size: 10px;
  line-height: 12px;
  vertical-align: middle;
}
.support-count .icon-keyboard_arrow_right {
  margin-right: 8px;
  font-size: 10px;
  vertical-align: middle;
}
#header .bulletin-wrapper {
  height: 28px;
  position: relative;
  background-color: rgba(7, 17, 27, 0.2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 22px 0 12px;
  color: #fff;
}
#header .bulletin-wrapper .bulletin-title {
  display: inline-block;
  width: 22px;
  height: 12px;
  bg-image('bulletin');
  background-size: 22px 12px;
  background-repeat: no-repeat;
  vertical-align: middle;
}
#header .bulletin-wrapper .bulletin-text {
  font-size: 10px;
  line-height: 28px;
  margin: 0 4px;
}
.bulletin-wrapper .icon-keyboard_arrow_right {
  position: absolute;
  right: 12px;
  font-size: 10px;
  line-height: 28px;
}
#header .header-backdround img{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  filter: blur(10px);
}
#header .detail {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(7, 17, 27, 0.8);
  color: #fff;
  opacity: 1;
}
#header .fade-enter-active,#header .fade-leave-active {
  transition: opacity 0.5s;
}
#header .fade-enter, #header .fade-leave-to {
  opacity: 0;
}
#header .detail .detail-wrapper {
  min-height: 100%;
  width: 100%;
}
#header .detail .detail-main {
  margin: 64px 36px 0;
  padding-bottom: 64px;
}
#header .detail-main .name {
  font-size: 16px;
  line-height: 16px;
  font-weight: 700;
  text-align: center;
}
#header .detail .detail-close {
  position: relative;
  margin: -64px auto 0;
  clear: both;
  width: 32px;
  height: 32px;
}
#header .detail .star-wrapper {
  margin: 16px auto 28px;
  padding: 2px 0;
  text-align: center;
}
#header .detail .title {
  display: flex;
  align-items: center;
}
#header .detail .line {
  background-color: rgba(255, 255, 255, 0.2);
  height: 1px;
  flex: 1;
}
#header .title .info {
  margin: 0 12px;
}
#header .detail .title {
  flex: 1;
  padding: 0 12px;
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  white-space: nowrap;
}

#header .ul-supports {
  width: 100%;
  margin: 24px 12px 28px ;
  list-style: none;
  font-size: 0;
}
#header .ul-supports .support-item {
  margin: 0 12px;
}
#header .ul-supports .icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 3px 6px 12px 0;
  background-size: 16px 16px;
  background-repeat: no-repeat;
  vertical-align: middle;
}
#header .ul-supports .icon:last-child {
  margin-bottom: 0;
}
#header .ul-supports .decrease {
  bg-image('decrease_2');
}
#header .ul-supports .discount {
  bg-image('discount_2');
}
#header .ul-supports .special {
  bg-image('special_2');
}
#header .ul-supports .invoice {
  bg-image('invoice_2');
}
#header .ul-supports .guarantee {
  bg-image('guarantee_2');
}
#header .ul-supports .text {
  line-height: 12px;
  font-size: 12px;
}
#header .bulletin {
  margin: 24px 24px 0;
  font-size: 12px;
  line-height: 24px;
}
</style>

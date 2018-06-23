<template>
  <div>
    <vheader :seller='seller'></vheader>
    <div class='tab' border-1px>
      <div class='tab-item'>
      <router-link to='/goods'>商品</router-link>
      </div>
      <div class='tab-item'>
      <router-link to='/ratings'>评论</router-link>
      </div>
      <div class='tab-item'>
      <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller='seller'></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from './components/header/header';
  import {urlParse} from './common/js/urlParse.js';

  const dataOk = 0;

  export default {
    components: {vheader: header},
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      }
    },
    created () {
      this.$http.get('/api/seller/?id=' + this.seller.id).then(
        (response) => {
          response = response.body;
          if (response.errno === dataOk) {
            this.seller = Object.assign({}, this.seller, response.data);
          }
        },
        () => {
          console.log('request is onerror')
        }
      )
    },
  }

</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import './common/stylus/mixin.styl'

  .tab {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 40px;
    border-1px(rgba(7, 17, 27, 0.1));
  }
  .tab .tab-item {
    flex: 1;
    text-align: center;
  }
  .tab .tab-item a {
    display: block;
    font-size: 14px;
    color: rgb(77, 85 ,93);
  }
  .tab .tab-item .active {
    color: rgb(240, 20 ,20);
  }
</style>

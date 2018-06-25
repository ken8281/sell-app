# sell-app
```
项目总结
仿写饿了么，针对新版vue-cli完成mock数据，vue1到vue2的重构，dpr1.5和dpr2的设备适配
使用vue-cli构建项目，webpack打包项目
其他工具： better-scroll、vue-resourse、stylus

实现功能
Goods、Ratings、Seller组件视图均可上下滚动
商品页 点击左侧menu，右侧list对应跳转到相应位置
点击list查看商品详情页，父子组件的通信
评论内容够可以筛选查看
购物车组件，包括添加删除商品及动效，购物控件与购物车组件之间非父子组件通信，点击购物车图标，展示选择的商品列表
商家实景图片可以左右滑动 
loaclStorage缓存商家信息（id、name）

待优化
组件通信可使用vuex或vue-bus实现
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

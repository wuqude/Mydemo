<template>
  <div>    
      <!-- 二级路由页面 -->
      <div class="home-container"></div>
    <keep-alive>
       <router-view></router-view>
    </keep-alive>
    <!-- 底部组件 -->
    <van-tabbar v-model="active">
  <van-tabbar-item icon="home-o" to="/layout/home">首页</van-tabbar-item>
  <van-tabbar-item icon="search" to="/layout/user">我的</van-tabbar-item>
</van-tabbar>

</div>
</template>

<script>

// 需求: 底部导航
// 1. 复制tabbar组件过来
// 2. 设置route集成路由功能
// 3. 设置to属性, 点击跳转路由页面
// 4. tabbar上设置route和to属性, 点击底部导航就可以切换路由页面
export default {
 name: 'Layout',
 

data() {
  return {
          active: 0,

  }
},
mounted() {
},
}
</script>

<style lang="less" scoped>
/* 内容底部内边距(把内容往上挤压, 防止内部被底部导航挡住) */
.home-container{
  padding-bottom: 50px;

}
/* 底部导航上边框 */
.van-tabbar {
  border-top: 1px solid #f8f8f8;
}
</style>

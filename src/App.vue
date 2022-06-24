<template>
  <div id="app">
<keep-alive exclude="Search,ArticleDetail,Detail,UserEdit" >
   <router-view></router-view>
</keep-alive>
  </div>
</template>

<style>
.box{
  width: 100px;
  height: 100px;
  background-color: pink;
}
</style>>

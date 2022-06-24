<template>
  <div>
    
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
<van-loading color="#1989fa" class="loading" v-if="Object.keys(detailList).length === 0" >文章疯狂加载ing...</van-loading>

    <!-- 文章信息区域 -->
    <div class="article-container" v-else>
      <!-- 文章标题 -->
      <h1 class="art-title">{{detailList.title}}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="detailList.aut_name" :label="formatDate(detailList.pubdate)">
        <template #icon>
          <img :src="detailList.aut_photo" alt="" class="avatar">
        </template>
        <template #default>
          <div>
            <van-button type="info" size="mini"  v-if="detailList.is_followed===true" @click="followedFn(true)" >已关注</van-button>
            <van-button icon="plus" type="info" size="mini" plain v-else @click="followedFn(false)">关注</van-button>
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content"  v-html="detailList.content"> </div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button icon="good-job" type="danger" size="small"  v-if="detailList.attitude === 1" @click="likeFn(true)">已点赞</van-button>
        <van-button icon="good-job-o" type="danger" plain size="small" @click="likeFn(false)" v-else>点赞</van-button>
      </div>
    </div>
 <!-- 文章加载中... -->

      <!-- 文章评论区域 -->
    <CommentList></CommentList>    
  </div>
</template>
 <script>
import {detailAPI,userFollowedAPI,userUnFollowedAPI,likeArticleAPI,unLikeArticleAPI} from '../../api/ArticleDetail'
import {timeAgo} from '../../utils/date'
import CommentList from './CommentList.vue'
export default {
name:'ArticleDetail',
data() {
  return {
    detailList:{}
  }
},
components:{
CommentList
},
mounted() {
  this.getdetail()
},
methods: {
 async getdetail(){
    const res =await detailAPI({
    artId:this.$route.query.aid
    })
    
    this.detailList=res.data.data
    
  },
  formatDate: timeAgo,
  async followedFn(bool){
     if (bool === true) { // 用户点了关注按钮
            // 业务: 关注用户
            // 显示: 已关注按钮
            const res = await userUnFollowedAPI({
          userId: this.detailList.aut_id
        })
            this.detailList.is_followed = false
            
        } else { // 用户点了已关注按钮身上
            // 业务: 取消关注用户
            // 显示: 关注按钮
            const res = await userFollowedAPI({
          userId: this.detailList.aut_id
        })
            this.detailList.is_followed = true
            
        }
},

 async likeFn(bool){
  // 判断如果是已点赞,再点击就取消点赞,并且发送取消点赞的api
  // 如果是未点赞,再点击就点赞,并取消点赞
  if (bool) {
        const res = await unLikeArticleAPI({
          artId: this.detailList.art_id
        })
    this.detailList.attitude = 0
  }else{
     const res = await likeArticleAPI({
          artId: this.detailList.art_id
        })
    this.detailList.attitude = 1
  }
 },


}}
</script>

<style scoped lang="less">

.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
    /deep/ img{
    	width: 100%;
  	}
    /deep/ pre {
        white-space: pre-wrap;
        word-wrap: break-word;
    }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}

// 加载中居中样式
.van-loading{
  text-align: center;
  padding-top: 75%;
}
</style>
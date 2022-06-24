<template>
  <div>
    <!-- 评论列表 -->
    <div class="cmt-list"
       :class="isShowCmtInput ? 'art-cmt-container-2' : 'art-cmt-container-1'">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多评论了, 请发表评论"
        @load="onLoad"
        :immediate-check="false"
      >
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="obj in commentArr" :key="obj.com_id">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="obj.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ obj.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon
              name="like"
              size="16"
              color="red"
              v-if="obj.is_liking === true"
            />
            <van-icon
              name="like-o"
              size="16"
              color="gray"
              v-else
              @click="loveFn(false, obj)"
            />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">
          {{ obj.content }}
        </div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
      </div>
      </van-list>
    </div>
    <!-- 发布评论容器 -->
    <div class="art-container">
      <!-- 底部添加评论区域 - 1 -->
      <div
        class="add-cmt-box van-hairline--top"
        v-if="isShowCmtInput === false"
      >
        <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
        <div class="ipt-cmt-div"
        @click="ShowCmtInput"
        >发表评论</div>
        <div class="icon-box"  @click="moveFn">
         <van-badge :content="totalCount" :max="99">
	      <van-icon name="comment-o" size="0.53333334rem" />
        </van-badge>
          <van-icon name="star-o" size="0.53333334rem" />
          <van-icon name="share-o" size="0.53333334rem" />
        </div>
      </div>
      <!-- 底部添加评论区域 - 2 -->
      <div class="cmt-box van-hairline--top" v-else>
        <textarea v-fofo
         placeholder="友善评论、理性发言、阳光心灵"
        @blur="blurFn"
         v-model="comValue"
        ></textarea>
        <van-button type="default" 
        :disabled="comValue.length === 0" @click="sendFn"
        >发布</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  commentsListAPI,
  commentLikingAPI,
  commentDisLikingAPI,
  commentSendAPI
} from "../../api/ArticleDetail";
import { timeAgo } from "../../utils/date";
export default {
  name: "CommentList",
  data() {
    return {
      commentArr: [],
      isShowCmtInput: false,
       totalCount: 0 ,// 评论总数
       comValue: '', // 评论内容
      loading: false, // 底部加载状态
      finished: false,// 底部是否加载完成
      lastId: null // 分页

    };
  },
  mounted() {
    this.Getcomments();
  },
  methods: {
    async Getcomments() {
      const res = await commentsListAPI({
        id: this.$route.query.aid, // 文章id
      });
      this.commentArr = res.data.data.results;
      this.totalCount = res.data.data.total_count || ''
       this.lastId = res.data.data.last_id // 分页

    },
    timeAgo,
    async loveFn(bool, obj) {
      // 判断如果是已喜欢,再点击就取消喜欢,并且发送取消喜欢的api
      // 判断如果是喜欢,点击就喜欢,并且发送喜欢的api
      if (bool) {
        obj.is_liking = false;
        const res = await commentDisLikingAPI({
          comId: obj.com_id, // 文章id
        });
      } else {
        obj.is_liking = true;
        const res = await commentLikingAPI({
          comId: obj.com_id, // 文章id
        });
      }
    },
    // 显示评论
    ShowCmtInput(){
    this.isShowCmtInput = true
    },
    // 评论滑动
   async moveFn () {
    // 真实DOM都在document(所以不再一个vue文件内), 也是可以获取的
  //  let articleHeight=document.querySelector('.article-container').scrollHeight
  //  console.log(articleHeight);
  //  window.scrollTo(0,articleHeight)
      document.querySelector('.like-box').scrollIntoView({
        behavior: 'smooth'
    })
},
// 发布按钮的点击事件
async sendFn(){
   const res = await commentSendAPI({
    id:this.$route.query.aid,
    content:this.comValue
   })
  this.commentArr.unshift(res.data.data.new_obj)
},
// 发布按钮失去焦点事件
blurFn(){
  setTimeout(() => {
        this.isShowCmtInput = false

  },0);
},

async onLoad(){
   if (this.commentArr.length > 0) {
      // 请求下一页数据
        const res = await commentsListAPI({
          id: this.$route.query.aid, // 文章id
          offset: this.lastId
        })
        this.commentArr = [...this.commentArr, ...res.data.data.results]
        this.totalCount = res.data.data.total_count // 总数量
        this.lastId = res.data.data.last_id // 分页
        if (res.data.data.last_id === null) {
        // 没有下一页了
        // 如果finished为true, 以后触底不再执行load事件
          this.finished = true
        }
        this.loading = false
      } else {
        // 4. 如果不加immediate-check, 上来走一次onLoad, loading状态为true, 但是if又进不去
        // 等created数据回来撑开高度, 滚动到底部时, loading为true就不会重新执行onLoad方法了
        // 效果: 一直转圈
        // 解决: if进不去, 进else里把状态关闭掉
        this.loading = false
      }
}
  },
};
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 70px;
}
.art-cmt-container-2 {
  padding-bottom: 100px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 86px;
  line-height: 86px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
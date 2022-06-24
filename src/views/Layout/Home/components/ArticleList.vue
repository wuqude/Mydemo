<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
         <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      offset="50"
      :immediate-check="false"
    >
      <!--文章列表 -->
      <ArtileItem
        v-for="article in ArtlcleList"
        :key="article.art_id"
        :article="article"
        @dislike="dislike"
        @reports='reportson'
        @click.native="$router.push(`/ArticleDetail?aid=${article.art_id}`)"
      />
     
    </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArtileItem from "../../../../components/ArtileItem";
import { Getarticles,articleDislikeAPI,articleReportsAPI} from "../../../../api/index";
import { timeAgo } from "../../../../utils/date";
import {Toast} from 'vant'
import Notify from '../../../../ui/Notify'
export default {
  name: "ArticleDetail",
  props: ["cid"],
  components: {
    ArtileItem,
  },
  data() {
    return {
      ArtlcleList: [],
      loading: false, // 底部加载状态
      finished: false, // 数据是否全部加载完成
      nextTime: null, // 用于加载更多(分页)
      isLoading: false,//顶部刷新状态
    };
  },
  mounted() {
    this.Getarticles();
    // 回来的数据进行预处理, 把时间转成多久多久之前
  },
  methods: {
    async Getarticles() {
      const res = await Getarticles({
        channel_id: this.cid,
        timestamp: this.nextTime,
      });
      // 回来的数据进行预处理, 把时间转成多久多久之前
      res.data.data.results.forEach((obj) => {
        obj.pubdate = timeAgo(obj.pubdate);
      });
      // 如果无数据
        this.nextTime = res.data.data.pre_timestamp; // 保存下一页数据的时间
        this.ArtlcleList = [...this.ArtlcleList, ...res.data.data.results];

        // 等待网络请求结果后
        this.loading = false; // 底部加载更多状态
           if (res.data.data.pre_timestamp === null) {
        // 本次回来的数据是最后, 没有下一段数据了
        this.finished = true
      }
    },
      async dislike(id){
       try {
        await articleDislikeAPI({
         id: id
        })
        // res里没有什么有用的信息, 所以await往下放行, 就证明请求和响应成功的, 反馈成功
          Notify({ type: 'success', message: '反馈成功' })

       } catch (error) {
       console.log(`${error}+失败了`)

       }
      },
      //其他反馈
    async  reportson(id,value){
          try {
        await articleReportsAPI({
         id: id,
           type: value

        })
        // res里没有什么有用的信息, 所以await往下放行, 就证明请求和响应成功的, 反馈成功
          Notify({ type: 'success', message: '举报成功' })

       } catch (error) {
       console.log(`${error}+失败了`)

       }
       },
     // 底部加载
    onLoad() {
      // 有第一页数据以后, onLoad再发请求
      if (this.ArtlcleList.length > 0) {
        this.Getarticles();
      }
    },
    onRefresh() {
      // 目标: list数组清空, 来一份新的数据

      setTimeout(() => {
        Toast("刷新成功");
           // 目标: list数组清空, 来一份新的数据
      this.ArtlcleList = []
      this.theTime = new Date().getTime()
      this.Getarticles()
        this.isLoading = false;
      }, 1000);
    },
  },

};
</script>


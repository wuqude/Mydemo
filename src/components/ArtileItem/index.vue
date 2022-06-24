<template>
  <!-- 一条文章单元格 -->
  <van-cell>
    <!-- 标题区域的插槽 -->
    <template #title>
      <div class="title-box">
        <!-- 标题 -->
        <span>{{ article.title }}</span>
        <!-- 单图 -->
        <!-- <img
          class="thumb"
          :src="article.cover.images[0]"
          v-if="article.cover.type == 1"
        /> -->
           <van-image
            v-if="article.cover.type === 1"
            class="thumb"
            :src='article.cover.images[0]'
          >
            <template v-slot:error>图片走丢了</template>
          </van-image>
      </div>
      <!-- 三张图片 -->
      <div class="thumb-box" v-if="article.cover.type > 1">
        <!-- <img
          class="thumb"
          v-for="(imgUrl, index) in article.cover.images"
          :key="index"
          :src="imgUrl"
        /> -->
           <van-image
          v-for="(imgUrl, index) in article.cover.images"
          :key="index"
          class="thumb"
          alt=""
           :src='imgUrl'

        >
          <template v-slot:error>图片走丢了</template>
        </van-image>
      </div>
    </template>
    <!-- label 区域的插槽 -->
    <template #label>
      <div class="label-box">
        <div>
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate }}</span>
        </div>
        <!-- 反馈按钮 -->
        <van-icon name="cross" @click.stop="edit"  v-if="isShow" />
        <van-action-sheet
          v-model="show"
          :actions="actions"
          @select="onSelect"
          get-container="body"
          :cancel-text='cancelText'
          @cancel="onCancel"
          @close="closeFn"
        />
      </div>
    </template>
  </van-cell>
</template>
<script>
import {firstActions,secondActions} from '../../api/report.js'
export default {
  name: "ArtileItem",
  props: {
    article:Object,//文章对象
     isShow:{
          type: Boolean,
      default: true // 例如首页的地方我不想再去动了, 首页肯定没穿isShow值进来, 所以首页需要显示
     }
  },
  data() {
    return {
      show: false,
      actions:firstActions,
      cancelText:'取消' // 底部按钮文字
    };
  },
  methods: {
    edit() {
      this.show = true;
    },
    // 点击选项时触发，禁用或加载状态下不会触发	
    onSelect(action) {
      // action绑定的数据对象, index是索引
    if (action.name === '反馈垃圾内容') {
        // 证明点击的是反馈垃圾内容
        this.actions = secondActions
        this.cancelText='返回'
    }else if(action.name==='不感兴趣'){
       this.$emit('dislike', this.article.art_id)
        this.show = false // 关闭弹窗
    }else{
      //这是二级反馈
         this.$emit('reports',this.article.art_id,action.value)
    }
    },
    onCancel(){
    if (this.cancelText === '返回') {
      this.actions = firstActions
       this.cancelText = '取消'
      this.show = true // 点返回不要让弹窗关闭, 点取消文字按钮, 弹窗默认关闭
    }
    },
    closeFn(){
      this.actions=firstActions,
      this.cancelText='取消'
    }
  },
};
</script>

<style lang="less" scoped>
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.label-box {
  display: flex;
  justify-content: space-between;
}
// 文章信息 spnan
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 200px;
  height: 140px;
  background-color: #f8f8f8;
  object-fit: cover;
  /* 三图, 图片容器 */
}

.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
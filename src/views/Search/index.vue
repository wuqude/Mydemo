<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon name="arrow-left" color="white" size="0.48rem" class="goback" @click="$router.back()"/>
      <!-- 搜索组件 -->
      <van-search v-model="kw"
       v-fofo placeholder="请输入搜索关键词" background="#007BFF" shape="round"
        @input="inpuFn"
        @search='SearchTo'
        />
    </div>
    <!-- 搜索建议列表 -->
<div class="sugg-list" v-if="kw.length !== 0">
    <div class="sugg-item" 
    v-for="(str, index) in suggestList" :key="index"
     v-html="lightFn(str)"
     @click="suggesClickFn(str)"
    >{{str}}</div>
</div>

<!-- 搜索历史 -->
<div class="search-history" v-else >
    <!-- 标题 -->
    <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
			<van-icon name="delete" class="search-icon"  @click="deletehistory"/>
        </template>
    </van-cell>

    <!-- 历史列表 -->
    <div class="history-list"  >
        <span class="history-item" 
        v-for="(str,index) in history" 
        :key="index"
        @click="historyClickFn(str)"
        >{{str}}</span>
    </div>
</div>
  </div>
  
</template>

<script>
import {suggestListAPI} from '../../api/index'
export default {
  data () {
    return {
      kw: '',// 搜索关键字
      timer:null, // 防抖, 用的定时器
      suggestList: [],// 建议关键字列表
      history: JSON.parse(localStorage.getItem('his'))||[]//搜索历史
    }
  },
  methods: {
    inpuFn(){
      clearTimeout(this.timer)
       if (this.kw.length===0) {
          this.suggestList=[]
        }else{
          this.timer=setTimeout(async () => {   
        // 防止空内容触发下面逻辑
         const res = await suggestListAPI({
         q:this.kw
         })
        this.suggestList=res.data.data.options||[]
      }, 500);
        }
    
    },
    // 专门处理字符串高亮关键字
    lightFn (originStr, target) {
      // orginStr: 原来字符串
      // target: 关键字
      // 字符串.replace() -> 替换第一个符合条件
      // 字符串.replaceAll() -> 替换全部
      // 例如: "好同志, 都是招募来的", 关键字是: "好"
      // 返回值: 替换后的完整字符串

      // 如果你要使用变量, 作为正则的匹配条件, 不能用语法糖简化写法
      const reg = new RegExp(target, 'ig') // i忽略大小写, g全局都匹配

      // 替换后的值不能用target
      // 例如: 输入框里 java, 匹配回来的联想菜单Java, JAVA, jAVA, 都被你replace换成输入框target值java
      return originStr.replace(reg, (match) => {
        // match就是匹配中时, 原字符串里的那个字符, 用人家原来的, 只不过我们给个颜色即可
        return `<span style="color: red;">${match}</span>`
      })
    },
    moveFn (theKw) {
      // 路由跳转传参
      // 方式1: 路径/值(前提: 路由规则:变量名), -> 接收: $route.params
      // 方式2: 路径?参数名=值  ->  接收: $route.query
      // 这2种方式, 你都可以自己在path后面路径拼接
      // 你还可以用$router.push配置项params和query让js代码内帮你拼接

      // 坑: 路由跳转, 在watch之前执行, 所以我们要让路由跳转, 来一个定时器包裹, 让跳转最后执行
      setTimeout(() => {
        this.$router.push({
          path: `/Search/${theKw}`
        })
      }, 0)
    },
    // 关键词的点击跳转
    SearchTo(){
     if (this.kw.length>0) {
        this.history.push(this.kw) // 保存搜索关键字
      console.log(this.history);
          this.moveFn(this.kw)
     }

    },
    // 联想菜单的跳转
    suggesClickFn(str){
      this.history.push(this.kw) // 保存搜索关键字
         this.moveFn(str)

    },
    // 历史记录跳转
    historyClickFn(str){
       this.moveFn(str)

    },
    // 删除历史记录
    deletehistory(){
        this.history=[]
    
    }
   
  },
   watch:{
      // 监听记录数组的改变
      history:{
      deep: true,
       handler(){
          // Set: 无序不重复的value集合体 (无下角标)
        // 特点: 你传入的数组类型, 如果有重复元素, 会自动清理掉重复元素, 返回无重复的Set对象
        const theSet =new Set(this.history)
        console.log(theSet);
        // Set对象转回
        // const arr = Array.from(theSet)
        const arr=[...theSet]
          localStorage.setItem('his',JSON.stringify(arr))
         }
      }
    }
}
</script>

<style scoped lang="less">
.search-header {
  height: 100px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
  /*搜索建议列表样式 */

}
.sugg-list {
  .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
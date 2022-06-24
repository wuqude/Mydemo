<template>
  <div>
    <van-nav-bar title="新闻首页" class="page-nav-bar" fixed>
      <template v-slot:right>
        <van-icon name="search" size="0.5rem"  @click="moveSearchPageFn"/>
      </template>
    </van-nav-bar>
    <div>
     <van-tabs 
    v-model="channelId"
    animated
    sticky
    offset-top="1.226667rem"
    class="main"
    >
      <van-tab :title="channels.name" v-for="channels in channelList" :key="channels.id"
                :name="channels.id"
      >
    <ArticleList :cid="channelId"/>
   </van-tab>
    </van-tabs>
   <!-- 编辑频道图标 -->
 <van-icon name="plus" size="0.37333334rem" class="moreChannels" @click="showPopup"/>
    </div>
    <van-popup v-model="show" class="channel_popup">
      <ChannelEdit
       :userChannelList='userChannelList'
       :unCheckChannelList='unCheckChannelList'
       @addChannel='addChannelFn'
       @removeChannel="removeChannelFn"
       @closeEV='close'
       ref="editRef"
       v-model="channelId"
      />

    </van-popup>
  </div>
</template>

<script>
import {getchannels,getAllChannelsAPI,updateChannelsAPI,removeTheChannelAPI} from '../../../api/index'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from './components/ChannelEdit.vue'

export default {
  name: "User",
  components:{
   ArticleList,
   ChannelEdit
 },
  data() {
      return {
         // ...省略其他
         channelList: [] ,// 频道数据
          userChannelList: [], // 用户选择频道列表
         channelId:0, // 频道ID(默认0是推荐)
         show: false,
      }

  },
  mounted() {
      this.GETchannelList()
      this.getAllChannels()


  },
  methods: {
     async GETchannelList(){
       let result = await getchannels()
       this.userChannelList=result.data.data.channels
      },
      // +号点击
      showPopup() {
      this.show = true;
    },
    // 得到全部频道
     async getAllChannels(){
       let result = await getAllChannelsAPI()
       this.channelList=result.data.data.channels
      },
  //  添加频道
  async addChannelFn(channelObj){
      this.userChannelList.push(channelObj)
            // 问题: 为何只需要push, 不需要从下面数组里移除
      // 还要把最新的数组, 发送给后台
      // 数组里对象字段 -> 转换
      // 推荐频道不能传递-删除出不是推荐频道剩下的频道对象
      // const newArr = this.userChannelList.filter(obj => obj.id !== 0)
      // newArr.forEach((obj, index) => {
      //   // delete 对象.属性 可以删除键值对
      //   delete obj.name
      //   obj.seq = index
      // })
      // const res = await updateChannelsAPI({
      //   channels: newArr
      // })
      // console.log(res)
      // 上面的代码出问题, 新增时, 名字被删除了
      // 原因: 所有数组里的对象, 都是同一个内存地址, 影响到ChannelEdit.vue中对象
      // 解决方法
           // 数组里对象字段 -> 转换
      // 推荐频道不能传递-删除出不是推荐频道剩下的频道对象
      const newArr =this.userChannelList.filter((obj)=>obj.id!==0)
      const theNewArr = newArr.map((obj, index) => {
        const newObj = { ...obj } // 拷贝(浅拷贝)
        delete newObj.name
        newObj.seq = index

        return newObj // 让map方法把新对象收集起来形成一个新数组
      })
      const res =await updateChannelsAPI({
        channels: theNewArr
      })

  },
  // 删除频道
 async removeChannelFn(obj){
        // 找到这个频道在数组下标删除
      // const ind = this.channelList.findIndex(item => item.id === obj.id)
      // this.channelList.splice(ind, 1)
       // 第二种方式: 只调用删除的接口
       console.log('删除');
      const res = await removeTheChannelAPI({
        channelId: obj.id
      })
   },
  //  关闭弹出层
       close(){
        this.show = false
    // 我要让内部的编辑状态回归false
      this.$refs.editRef.isEdit = false
       },
       moveSearchPageFn(){
        this.$router.push('/Search')
       }
    
  },
  computed:{
     unCheckChannelList () {
      // 目标: 把所有频道数组挨个对象取出, 去用户已选频道数组里查找, 如果找不到, 则让filter方法收集到一个新数组里
        const newArr = this.channelList.filter(bigObj => {
          const index = this.userChannelList.findIndex(smallObj => {
            return smallObj.id === bigObj.id
          })

          // 如果找到了
          if (index > -1) {
            return false
          } else {
            return true
          }
        })
        return newArr
      
    }
  }

};
</script>

<style lang="less" scoped>

.page-nav-bar {
  background-color: #3296fa;
  .van-nav-bar__title, .van-icon {
    color: #fff;
  }
}

// 覆盖导航标记条的颜色, styles/cover.less
// Tabs标签页
@tabs-bottom-bar-color:#007bff;

.main{
 padding-top: 44px; 
 
}
/* // 设置 tabs 容器的样式 */
::v-deep .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

/* // 设置小图标的样式 */
.moreChannels {
  position: fixed;
  top: 124px;
  right: 8px;
  z-index: 999;
}

.channel_popup{
  width: 100vw;
  height: 100vh;
}
</style>
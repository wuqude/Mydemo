<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="User.photo" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ User.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ User.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ User.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ User.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_editor" />
      <van-cell icon="chat-o" title="小思同学" is-link />
      <van-cell icon="warning-o" title="退出登录" is-link @click="Quit" />
    </van-cell-group>
  </div>
</template>

<script>
import { userInfoAPI } from "../../../api/index";
import { Dialog, Notify } from "vant";
import{removeToken} from '../../../utils/token'
import UserEdit from './UserEdit'
export default {
name:'User',
components:{
 UserEdit  
 
 },
  data() {
    return {
      User: {},
    };
  },

  mounted() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      const res = await userInfoAPI();
      this.User = res.data.data;
    },
    Quit() {
      // 当点击的时候弹出确认框是否退出登录,退出登录就进入下一步
      // 清除本地的token,跳转到登录的路由
      Dialog.confirm({
        title: "退出登录",
        message: "是否退出登录",
      })
        .then(() => {

          Notify({ type: "success", message: "请重新登录" });
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => {
          Notify({
            message: "取消",
            color: "#ad0000",
            background: "#ffe1e1",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
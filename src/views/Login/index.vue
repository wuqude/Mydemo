<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="手机号"
        type="number"
        placeholder="请输入手机号"
        :rules="[
          {
            required: true,
            message: '请填写正确手机号',
            pattern: /^1[3-9]\d{9}$/,
          },
        ]"
      >
        <i slot="left-icon" class="toutiao icon-Testshouji"></i>
      </van-field>

      <van-field
        v-model="user.code"
        type="password"
        name="验证码"
        placeholder="请输入验证码"
        :rules="[
          { required: true, message: '请填写验证码', pattern: /^\d{6}$/ },
        ]"
        ><i slot="left-icon" class="toutiao icon-Testyanzhengma"></i>
        <template #button>
          <van-button
            round
            size="small"
            type="default"
            class="send-sms-btn"
            @touchmove="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          class="login-btn"
          block
          type="info"
          native-type="submit"
          loading-text="正在登录"
          :disabled="isLoading"
          :loading="isLoading"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginApi } from "../../api/index";
import { Notify } from "vant";
import {setToken} from '../../utils/token.js'
// 点击后给用户提示,防止用户频繁点击
export default {
  name: "LoginPage",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "13888888888", // 手机号
        code: "246810", // 验证码(密码-必须是246810后台规定s的, 无论手机号是什么)
      },
      isLoading: false,
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    async onSubmit(values) {
        // 状态设置true
        this.isLoading = true;
      try {
        let result = await loginApi(this.user);
      
        if (result.status == 201) {
          setToken(result.data.data.token)
          localStorage.setItem('refresh_token', result.data.data.refresh_token)
          Notify({ type: "success", message: "登录成功" });
          this.$router.replace({
            path: this.$route.query.path || '/layout'
          })
        }
      } catch (error) {
        console.log(error);
        Notify({ type: "warning", message: "登录信息错误" });
      }

      this.isLoading = false
   
    },

    onSendSms() {
      console.log("发送验证码");
    },
  },
};
</script>

<style scoped lang="less">
body {
  background-color: #f5f7f9;
}

.page-nav-bar {
  background-color: #3296fa;
  .van-nav-bar__title,
  .van-icon {
    color: #fff;
  }
}

.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>

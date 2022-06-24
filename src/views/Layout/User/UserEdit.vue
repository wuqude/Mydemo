<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image round class="avatar" :src="UserInfo.photo" @click="iMageClickFn"/>
          <!-- input框 -->
        <input
               type="file"
               ref="iptFile"
               v-show="false"
               accept="image/*"
               @change="onFileChange"
               />          
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="UserInfo.name"
        @click="showNameDialogFn" 
       />
      <van-cell title="生日" is-link :value="UserInfo.birthday" @click="showDay"/>
    </van-cell-group>
    <!-- 修改用户名称的对话框 -->
<van-dialog
      v-model="show"
      title="修改名称"
      show-cancel-button
      :before-close="onNameDialogBeforeClose">
      <!-- 输入框 -->
      <van-field
        v-model.trim="userName"
        input-align="center"
        maxlength="7"
        placeholder="请输入名称"
        v-fofo
      />
</van-dialog>
   <!-- 修改时间 -->
<van-popup v-model="isShowBirth" position="bottom" style="height: 50%" round>
      <!-- 日期选择控件 -->
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        :show-toolbar="true"
         @cancel="isShowBirth = false"
        @confirm="confirmFn"
      />
</van-popup>
  </div>
</template>

<script>
import {Notify} from 'vant'
import { userProfileAPI,updateUserPhotoAPI,updateUserProfileAPI} from "../../../api/index";
import {formatDate} from '../../../utils/date'
export default {
  name: 'UserEdit',
  data() {
    return {
      UserInfo:{},
      show: false, // 是否显示姓名弹出框
      userName:'',
        isShowBirth: false, // 显示时间选择器
        minDate: new Date(1900, 0, 1), // 最小的可选的日期
      maxDate: new Date(), // 最大的可选日期
      currentDate: new Date() // 当前日期

    }
  },
  mounted() {
  this.GetUserProfile()
  },
  methods: {
  async GetUserProfile(){
      const res = await userProfileAPI();
      this.UserInfo=res.data.data
      
  },
  // 文件选择改变
  async onFileChange(e){
       if (e.target.files.length === 0) return // 用户可能没有选择图片文件阻止代码往下
      // 创建FormData对象
   const fs =new FormData()
    // (用户选中文件对象) 数组其实是一个特殊的对象
   fs.append('photo',e.target.files[0])
    const res = await updateUserPhotoAPI(fs)
      this.UserInfo.photo = res.data.data.photo

  },
  iMageClickFn(){
    this.$refs.iptFile.click()
  },
  showNameDialogFn(){
    this.show=true
  },
    // 姓名修改弹出层-关闭前方法
   async onNameDialogBeforeClose (action, done) {
	 // action的值: confirm或cancel(点击按钮区分)
    if (action === 'confirm') {
        // 确定
        // unicode编码 \u4092
        // url编码 %E2%C3%D1
        if (/^[A-Za-z0-9\u4e00-\u9fa5]{1,7}$/.test(this.userName)) {
            // 通过校验
            // 调用接口
            // 更新页面显示的名字
             await updateUserProfileAPI({  name: this.userName})
            this.UserInfo.name=this.userName
            // 关闭弹窗
            done()
        } else {
            // 提示用户
            Notify({ type: 'warning', message: '用户名中英文和数字1-7位' })
            // 阻止弹窗关闭
            done(false)
        }
    } else if (action === 'cancel') {
        // 取消
        done()
    }
    },
    showDay(){
      this.isShowBirth=true
      console.log(this.UserInfo.birthday);
      this.currentDate = new Date(this.UserInfo.birthday) // 设置data组件默认显示时间
    },
  async  confirmFn(){
           await updateUserProfileAPI({
        birthday: formatDate(this.currentDate)
      })
           this.dateTimePickerShow = false
      this.UserInfo.birthday = formatDate(this.currentDate) // 单元格同步
    }
    
  },
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 90px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
</style>

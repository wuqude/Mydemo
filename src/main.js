import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载 Vant 核心组件库
import Vant from 'vant'
// 加载全局样式
import './styles/index.less'
Vue.config.productionTip = false
// 加载vant组件库
import 'vant/lib/index.css'
// 加载flexible库
import 'amfe-flexible'
import { Row, Col, Badge } from 'vant'
// 引入自定义指令
import diretivesObj from './utils/directives'
Vue.use(Badge)
Vue.use(Row)
Vue.use(Col)
Vue.use(Vant)
Vue.use(diretivesObj)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

if (process.env.NODE_ENV !== 'development') { // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
  console.log = function () {}
  console.error = function(){}
  console.dir = function(){}
}
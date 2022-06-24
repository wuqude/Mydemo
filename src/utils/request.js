// 引入Vant组件
import { Toast } from 'vant';
// 引入router
import router from '../router'
// 基于 axios 封装的请求模块
import ajax from 'axios'
// 引入token
import { getToken,removeToken,setToken} from './token';
import {getNewTokenAPI} from '../api/index'
import { Notify } from '../ui/Notify';
// 新建一个新的axios实例
const axios = ajax.create({
  baseURL: 'http://geek.itheima.net/' // 基地址


})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么, 判断一下如果当前本地有token,且请求的响应上没有token
  if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
    // 发起请求之前, 把token携带在请求头上(表明自己身份)
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
   // 当状态码为2xx/3xx开头的进这里
  // 对响应数据做点什么
  return response
}, async function (error) { // 响应状态码4xx/5xx进这里
  // 对响应错误做点什么
  if (error.response.status === 401) { // 身份过期
    // token续签方式1:  去登录页重新登录, token无用, 清掉-确保路由守卫if进不去
    // 不能使用this.$router (因为this不是vue组件对象无法调用$router)
    // Toast('请重新登录');
    // removeToken()
    // router.replace('/login')  
   console.log(error);
  // 方式2: 使用refresh_token换回新的token再继续使用, JS代码实现, 用户无感知(效果好)
    const res = await getNewTokenAPI()
    setToken(res.data.data.token)
    } else if (error.response.status === 500 && error.config.url === '/v1_0/authorizations' && error.config.method === 'put') {
            // 刷新的refresh_token也过期了
            localStorage.clear() // 清除localStorage里所有值
            // localStorage当前网页, 域名划分, 每个域名下有自己范围的localStorage
          Toast('请重新登录');
      console.log(router.currentRoute.fullPath);
      router.push({ path: `/login?path=${router.currentRoute.fullPath}` })
        Notify({ type: 'warning', message: '身份已过期' })
      }
  
  return Promise.reject(error)
})

// 导出自定义函数, 参数对象解构赋值
export default ({ url, method = 'GET', params, data, headers }) => {
  return axios({ 
    url: url,
    method: method,
    params: params,
    data: data,
    headers: headers
  })
    

}




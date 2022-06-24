import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import { getToken } from '../utils/token'
const routes = [
  {
    path: '/',
    redirect: '/layout' },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login'),
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('../views/layout'),
    redirect: '/layout/home', // 默认显示二级页面为home首页
    children:[
      {
        path: 'home',
        component: () => import('../views/layout/Home'),
      },
      {
        path: 'user',
        component: () => import('../views/layout/User'),
      },
    ]

  },
  
  {
    path: '/Search',
    name: 'Search',
    component: () => import('../views/Search'),
  },
  // 文章页面显示
  {
    path: '/Search/:keywords',
    name: 'SearchResult',
    component: () => import('../views/Search/SearchResult/index.vue'),
  },
  // 文章详情路由
  {
    path: '/ArticleDetail',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail'),
  },
  // 文章编辑页面
  {
    path: '/user_editor',
    name: 'user_editor',
    component: () => import('../views/layout/User/UserEdit.vue'),
  },
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to,from,next)=>{

  if ( to.path === '/login'&&getToken()?.length>0  ) {
      // 证明有token-已经登录了
      next(false) // 阻止跳转原地呆着

  }else{
    next()
  } 
})



export default router

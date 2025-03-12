import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录 - 大清政务系统' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: '首页 - 大清政务系统', requiresAuth: true },
    children: [
      {
        path: 'memorials',
        name: 'Memorials',
        component: () => import('@/views/memorials/MemorialList.vue'),
        meta: { title: '奏章管理', requiresAuth: true }
      },
      {
        path: 'officials',
        name: 'Officials',
        component: () => import('@/views/officials/OfficialList.vue'),
        meta: { title: '官员管理', requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { title: '个人信息', requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '大清政务系统'
  
  // 检查是否需要登录认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
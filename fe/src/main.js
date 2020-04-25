
import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'
import App from './App.vue'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Register from './components/Register.vue'
import Transaction from './components/Transaction.vue'
import User from './components/User.vue'
import Portfolio from './components/Portfolio.vue'
import PortfolioDetail from './components/PortfolioDetail.vue'
import Stock from './components/Stock.vue'
import StockDetail from './components/StockDetail.vue'
import Ticker from './components/ticker/Ticker.vue'


Vue.config.productionTip = false
Vue.use(Router)
Vue.use(ElementUI, { locale })

const router = new Router({
  routes: [
    { path: '/', component: Home, meta: { requiresAuth: true } },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },  
    { path: '/stock', name: 'Stock', component: Transaction, meta: { requiresAuth: true } },
    { path: '/user', name: 'User', component: User, meta: { requiresAuth: true } },
    { path: '/portfolio', name: 'Portfolio', component: Portfolio, meta: { requiresAuth: true } },
    { path: '/portfolio/:id', name: 'PortfolioDetail', component: PortfolioDetail, meta: { requiresAuth: true } },
    { path: '/stocks', name: 'Stock', component: Stock, meta: { requiresAuth: true } },
    { path: '/stocks/:ticker', name: 'StockDetail', component: StockDetail, meta: { requiresAuth: true } },
    { path: '/transaction', name: 'Transaction', component: Transaction, meta: { requiresAuth: true } },
    { path: '/ticker', name: 'Ticker', component: Ticker },
  ]
})

const isAuthenticated = () => (localStorage.getItem('token') == null) ? false : true
  
router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    if(!isAuthenticated()) next({ name: 'Login' })
    else next()
  } 
  else next()  
})

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')

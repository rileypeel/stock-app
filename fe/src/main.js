import Vue from 'vue';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import Register from './components/Register.vue';
import Transaction from './components/Transaction.vue';
import User from './components/User.vue';

Vue.config.productionTip = false
Vue.use(Router)
Vue.use(ElementUI)

const router = new Router({
  routes: [
    { path: '/', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', component: Register },  
    { path: '/stock', name: 'Stock', component: Transaction },
    { path: '/user', name: 'User', component: User}
  ]
});

//const isAuthenticated = () => (localStorage.getItem('token') == null) ? false : true
  
//router.beforeEach((to, from, next) => {
//  if(to.name == 'Login' && !isAuthenticated()) next({ name: 'Login' });
//  else next();  
//});

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')

import Vue from 'vue';
import Router from 'vue-router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import Register from './components/Register.vue'

Vue.config.productionTip = false

Vue.use(Router)
Vue.use(ElementUI)

const router = new Router({

  routes: [
    
    {path: '/', component: Home},
    {path: '/login', name:'Login', component:Login},
    {path: '/register', component:Register},
    
    
  ]

});
new Vue({
  render: h => h(App),
  router:router
}).$mount('#app')

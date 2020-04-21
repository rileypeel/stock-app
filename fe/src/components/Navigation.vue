<template>
  <div >
    <el-menu :router="true" id='navbar' :default-active="activeIndex" text-color="white" active-text-color="#ffd04b" background-color="#545c64" class="el-menu container" mode="horizontal" @select="handleSelect">
      <el-menu-item index="/user">Profile</el-menu-item>
      <el-menu-item index="/portfolio"><router-link to='/portfolio'>Portfolio</router-link></el-menu-item>
      <el-menu-item index="/stocks">Stocks</el-menu-item>
      <el-menu-item index="/ticker"><router-link to='/ticker'>Ticker</router-link></el-menu-item>
      <el-menu-item id="logout" @click="logout" index="4">Logout</el-menu-item>
    </el-menu>
  </div>
</template>


<script>
import userService from '../services/user.js'
export default {
  name: "Navigation",
  data () {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect() {
      console.log("select")
    },
    logout() {
      userService.logout()
      this.$router.push('Login');
    }
  }
}
</script>

<style>
#navbar {
    position: fixed;
    top: 0;
    width: 100%;
}
.container {
  display: flex;
  justify-content: flex-start;
}

#logout {
  margin-left: auto;
}

el-menu-item {
  color: white;
}
</style>
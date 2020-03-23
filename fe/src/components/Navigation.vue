<template>
  <div >
    <el-menu id='navbar' :default-active="activeIndex" text-color="white" active-text-color="#ffd04b" background-color="#545c64" class="el-menu container" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">Profile</el-menu-item>
      <el-submenu index="2">
        <template slot="title">Portfolios</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">Research</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-submenu>
      
      </el-submenu>
      <el-menu-item id="logout" @click="logout" index="3">Logout</el-menu-item>
    </el-menu>
  </div>
</template>


<script>
import userService from '../services/user.js'
export default {
  name: "Navigation",

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
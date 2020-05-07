<template>
  <div class="nav" v-if="showNav">
    <el-menu :router="true" id='navbar' :default-active="activeIndex" text-color="white" active-text-color="#ffd04b" background-color="#545c64" class="el-menu container" mode="horizontal" @select="handleSelect">
      <el-menu-item index="/user"><el-image fit="fill" class="img" :src="profileImgUrl"></el-image></el-menu-item>
      <el-menu-item index="/portfolio"><router-link to='/portfolio'>Portfolio</router-link></el-menu-item>
      <el-menu-item index="/stocks">Stocks</el-menu-item>
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
      activeIndex: '1',
      profileImgUrl: require('../../public/default-profile.png'),
      showNav: true
    }
  },
  watch: {
    $route: function (to) {
      this.show(to)
    }
  },
  methods: {
    handleSelect() {
      console.log("select")
    },
    logout() {
      userService.logout()
      this.$router.push('Login');
    },
    show(route) {
      this.showNav = !['Login', 'Register', 'Home'].includes(route.name)
    }
  },
  mounted: function() {
    userService.getProfilePic().then((data) => {
      if(data) {
        this.profileImgUrl = data
      }
    })
    this.show(this.$route);
  }
}
</script>

<style>
#navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: -1;
}

.nav {
  font-weight: bold;
}

.img {
  border-radius:50%;
  height: 40px;
  width: 40px;
  border-style: solid;
  border-width: 1px;
  border-color: gray;
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
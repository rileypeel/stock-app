<template>
  <el-menu id='navbar' :default-active="activeIndex" background-color="#545c64" class="el-menu-demo" mode="horizontal" @select="handleSelect">
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
  </el-menu>
</template>


<script>
export default {
  name: "Navigation" 
}

</script>

<style>
  #navbar {
    position: fixed;
    top: 0;
    width: 100%;
  } 

</style>
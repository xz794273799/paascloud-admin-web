<template>
  <el-menu :default-active="activeOneIndex" mode="horizontal" background-color="#324057" text-color="#fff" active-text-color="#ffd04b" router>
    <el-menu-item v-for="item in menuList" :route='{path: item.url}' :key="item.id" :index="item.menuCode">{{item.menuName}}</el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    computed: {
      menuList () {
        return this.$store.getters.getMenuList;
      },
      activeOneIndex() {
        let pathList = this.$route.path;
        return pathList.split('/')[1];
      }
    }
  };
</script>

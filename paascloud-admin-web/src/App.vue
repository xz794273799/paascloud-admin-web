<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    watch: {
      '$route': 'rs'
    },
    methods: {
      rs() {
        if (!this.accessToken) {
          console.info('accessToken is null');
          window.location.href = 'http://login.paascloud.net';
        }
      }
    },
    computed: {
      accessToken() {
        return this.$store.getters.getAccessToken;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  @import './assets/styles/index.scss';
</style>

<template>
<div>
  <div class="pc-page-content">
    <div>
      <img src="../../../assets/images/hello-world.jpg" alt="">
    </div>
  </div>
  <div class="pc-copyrights">
    <p>© 2016 - 2017 Powered by paascloud 京ICP备17045502号</p>
  </div>
</div>

</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {};
    },
    created () {
    },
    mounted () {
    },
    methods: {
      test () {
        console.info('test');
      }
    },
    components: {
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .pc-copyrights {
    position:absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #1F2D3D;
  }
  .pc-copyrights p {
    font-size: 14px;
    line-height: 36px;
    text-align: center;
  }
</style>

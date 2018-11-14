<template>
  <div class="accept-container">
    <el-tabs v-model="docId" tab-position="top" @tab-click="clickTab">
      <div v-for="item in swaggerList">
        <el-tab-pane :label="item.label" :name="item.name">
          <iframe :style="{width:rightContentWidth, minHeight: mainContentHeight}" frameborder=0 scrolling=auto :src="item.link"></iframe>
        </el-tab-pane>
      </div>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'swagger-ui',
    data () {
      return {
        docId: 'swagger-mdc-id',
        swaggerList: [
          {
            label: '用户中心-接口文档',
            name: 'swagger-uac-id',
            link: 'http://uac.paascloud.net/swagger-ui.html'
          },
          {
            label: '数据中心-接口文档',
            name: 'swagger-mdc-id',
            link: 'http://mdc.paascloud.net/swagger-ui.html'
          },
          {
            label: '对接中心-接口文档',
            name: 'swagger-opc-id',
            link: 'http://opc.paascloud.net/swagger-ui.html'
          },
          {
            label: '订单中心-接口文档',
            name: 'swagger-omc-id',
            link: 'http://omc.paascloud.net/swagger-ui.html'
          }
        ]
      };
    },
    methods: {
      clickTab(targetTab) {
        this.docId = targetTab.name;
      }
    },
    computed: {
      rightContentWidth () {
        return this.$store.getters.getRightContentWidth;
      },
      mainContentHeight () {
        return this.$store.getters.getMainContentHeight;
      }
    }
  };
</script>

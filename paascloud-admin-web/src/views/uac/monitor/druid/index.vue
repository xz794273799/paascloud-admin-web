<template>
  <div class="accept-container">
    <el-tabs :value="docId" tab-position="top" @tab-click="clickTab">
        <el-tab-pane v-for="(item, index) in druidList" :key="item.name" :label="item.label" :name="item.name">
          <iframe :style="{width:rightContentWidth, minHeight: mainContentHeight}" frameborder=0 scrolling=auto :src="item.link"></iframe>
        </el-tab-pane>
    </el-tabs>
  </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'druid-ui',
    data () {
      return {
        docId: 'druid-uac-id',
        druidList: [
          {
            label: '用户中心-数据源',
            name: 'druid-uac-id',
            link: 'http://uac.paascloud.net/druid/index.html'
          },
          {
            label: '数据中心-数据源',
            name: 'druid-mdc-id',
            link: 'http://mdc.paascloud.net/druid/index.html'
          },
          {
            label: '对接中心-数据源',
            name: 'druid-opc-id',
            link: 'http://opc.paascloud.net/druid/index.html'
          },
          {
            label: '订单中心-数据源',
            name: 'druid-omc-id',
            link: 'http://omc.paascloud.net/druid/index.html'
          }
        ]
      };
    },
    created () {
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

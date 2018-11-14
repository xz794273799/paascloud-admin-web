<template>
  <div>
    <iframe :style="{width:rightContentWidth, minHeight: mainContentHeight}" frameborder=0 scrolling=auto :src="zipkin.link"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'zipkin-ui',
    data () {
      return {
        zipkin: {
          label: 'zipkin',
          name: 'zipkin-id',
          link: 'http://zipkin.paascloud.net'
        }
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

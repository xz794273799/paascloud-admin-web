<template>
  <div>
    <iframe :style="{width:rightContentWidth, minHeight: mainContentHeight}" frameborder=0 scrolling=auto :src="boot.link"></iframe>
  </div>
</template>

<script>
  export default {
    name: 'spring-boot-admin-ui',
    data () {
      return {
        boot: {
          label: 'spring-boot-admin',
          name: 'spring-boot-admin-id',
          link: 'http://boot.paascloud.net'
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

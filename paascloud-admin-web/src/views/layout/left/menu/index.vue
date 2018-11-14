<template>
  <div class="left" :style="{'height':mainContentHeight,'width':leftMenuWidth}" id='admin-left'>
    <div id='left-menu'>
      <div class="toggle-menu" :style="{'width':leftMenuWidth}" @click='toggleMenu'>
        <i :class='[{"el-icon-arrow-left":menuFlag},{"el-icon-arrow-right":!menuFlag}]'></i>
      </div>
      <el-row class='tac'>
        <el-col :span="24">
          <!--defaultActive: {{defaultActive}}-->
          <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" background-color="#324057" text-color="#fff" active-text-color="#ffd04b" router>
            <el-submenu :index="item.url" v-if='item.hasMenu' v-for='item in subMenuData' :key="item.id">
              <!--{{item.id}}-->
              <template slot="title">
                <i :class="item.icon"></i>
                <span class='menu-name' v-if="menuFlag">{{item.menuName}}</span>
              </template>
              <el-menu-item :style="{'padding-left':menuFlag? '40px' : '23px'}" :route='{path: subItem.url}' :index="subItem.url" v-for='subItem in item.subMenu' :key="subItem.id"
                            v-if='item.hasMenu'><!--{{subItem.id}}-->
                <el-tooltip class="item" effect="dark" placement="right" :disabled="menuFlag" :content="subItem.menuName">
                  <i :class="subItem.icon"></i>
                </el-tooltip>
                <span class='menu-name' v-if="menuFlag">{{subItem.menuName}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.url" v-else>
              <i :class="item.icon"></i>
              <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        subMenuData: [],
        defaultActive: '',
        win_size: {
          height: ''
        }
      };
    },
    computed: {
      leftMenuWidth () {
        return this.$store.getters.getLeftMenuWidth;
      },
      menuFlag () {
        return this.$store.getters.getMenuFlag;
      },
      mainContentHeight () {
        return this.$store.getters.getMainContentHeight;
      },
      menuList () {
        return this.$store.getters.getMenuList;
      }
    },
    watch: {
      '$route': {
        handler: function(to, from) {
          let pathList = this.$route.path;
          let onePath = pathList.split('/')[1];
          if (onePath === 'index') {
            onePath = 'uas';
          }
          this.getMenuItem(onePath);
          this.$nextTick(() => {
            this.defaultActive = pathList;
          });
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      let _this = this;
      this.$pcBus.$on('logined', function(allMenuData) {
        let code = _this.$route.path.split('/')[1];
        if (code === 'index') {
          code = 'uas';
        }
        if (allMenuData) {
          allMenuData.some((subItem) => {
            if (subItem.menuCode === code) {
              if (subItem.hasMenu) {
                _this.subMenuData = subItem.subMenu ? subItem.subMenu : [];
              }
            }
          });
        }
      });
    },
    methods: {
      getMenuItem (menuCode) {
        let allMenuData = this.menuList;
        if (allMenuData) {
          allMenuData.some((subItem) => {
            if (subItem.menuCode === menuCode) {
              if (subItem.hasMenu) {
                this.subMenuData = subItem.subMenu ? subItem.subMenu : [];
              }
            }
          });
        }
      },
      toggleMenu () {
        // 隐藏那个破三角号的
        if (this.menuFlag) {
          document.querySelectorAll('.el-icon-arrow-down').forEach((item) => {
            item.style.display = 'none';
          });
        } else {
          document.querySelectorAll('.el-icon-arrow-down').forEach((item) => {
            item.style.display = 'block';
          });
        }
        this.$store.dispatch(this.menuFlag ? 'set_menu_close' : 'set_menu_open');
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .tac {
    top: 0;
  }

  .fa {
    margin-right: 8px;
  }

  .left {
    position: fixed;
    float: left;
    top: 60px;
  }

  #left-menu {
    height: 100%;
    background: #324057;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .toggle-menu {
    height: 27px;
    background: #324057;
    position: relative;
    top: 0;
    z-index: 1000;
    cursor: pointer;
    line-height: 27px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    opacity: 0.2;
    transition: opacity .3s ease-out;

    &:hover {
      color: #2b6aff;
      opacity: 1;
    }
  }
</style>

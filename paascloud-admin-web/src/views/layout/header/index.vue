<template>
  <header class="head-nav">
    <el-row>
      <el-col :span="4" class='logo-container'>
        <img src="../../../assets/images/logo.png" class='logo' alt="" @click="goHome">
      </el-col>
      <el-col :span="16">
        <top-nav/>
      </el-col>
      <el-col :span="4" class="user-info">
        <span class='username'>
          <el-dropdown trigger="click" @command='setDialogInfo'>
            <span class="el-dropdown-link">
                {{loginName}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command='info'><i class="fa fa-user-circle-o"></i>个人信息</el-dropdown-item>
                <el-dropdown-item command='pass'><i class="fa fa-key"></i>修改密码</el-dropdown-item>
                <el-dropdown-item command='home'><i class="fa fa-home"></i>返回主页</el-dropdown-item>
                <el-dropdown-item command='logout' divided><i class="fa fa-sign-out logout"></i>注銷</el-dropdown-item>
            </el-dropdown-menu>
            <i class="fa fa-sign-out logout" @click='logoutFn'></i>
          </el-dropdown>
        </span>
      </el-col>
    </el-row>
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" size="tiny" @close="dialog.show = false">
      <pc-update-pwd :loginName="loginName" v-if="dialog.show" ref="updatePwdForm"/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" :loading="$store.getters.getButtonLoading" type="primary" @click="updatePwdFn">确认</el-button>
        <el-button size="small" @click="dialog.show = false">取消</el-button>
      </div>
    </el-dialog>
  </header>
</template>

<script type="text/ecmascript-6">
  import topNav from './nav/index.vue';
  import pcUpdatePwd from '../../../views/uac/user/update-pwd/index.vue';
  export default {
    computed: {
      loginName() {
        return this.$store.getters.getLoginName;
      }
    },
    data() {
      return {
        dialog: {
          show: false,
          title: '修改密码'
        }
      };
    },
    methods: {
      updatePwdFn() {
        this.$refs.updatePwdForm.submitForm((res) => {
          if (res && res.code === 200) {
            this.dialog.show = false;
            this.logout();
          }
        });
      },
      logoutFn() {
        this.$confirm('你确定退出登录么?', '确认退出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.logout();
        });
      },
      setDialogInfo(cmdItem) {
        if (!cmdItem) {
          this.errorTip('菜单选项缺少command属性');
          return;
        }
        switch (cmdItem) {
          case 'info':
            this.loadPage('userView', {'loginName': this.loginName});
            break;
          case 'pass':
            this.dialog.show = true;
            break;
          case 'home':
            this.goHome();
            break;
          case 'logout':
            this.logoutFn();
            break;
        }
      }
    },
    components: {
      topNav, pcUpdatePwd
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .logo-container{
    height: 60px;
  }
  .logo{
    height: 50px;
    width: auto;
    margin-left: 10px;
    margin-top: 5px;
    cursor: pointer;
  }
  .fa-user{
    position: relative;
    top:-2px;
    margin-right: 4px;
  }
  .head-nav{
    width:100%;


    height: 60px;
    background: #324057;
    position: fixed;
    top:0;
    left:0;
    z-index: 1000;
    color:#FFF;
    border-bottom: 1px solid #1F2D3D;

    .logout{
      width:60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      float: right;
      cursor: pointer;
    }
  }
  .user-info{
    text-align: right;
  }
  .username{
    height: 60px;
    line-height: 60px;
    cursor: pointer;

    .el-dropdown{
      color:#FFF;
    }
  }
</style>

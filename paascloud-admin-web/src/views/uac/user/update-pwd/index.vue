<template>
  <div class="pc-page-content">
    <el-form :model="modifyForm" :rules="rules" ref="userPwdForm" label-width="80px">
      <el-form-item label="原始密码" prop="oldPassword" required>
        <el-input  type="password" class = "pc-input-col3" v-model="modifyForm.oldPassword" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" required>
        <el-input  type="password" class = "pc-input-col3" v-model="modifyForm.newPassword" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd" required>
        <el-input type="password" class = "pc-input-col3" v-model="modifyForm.confirmPwd" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      loginName: {
        type: String,
        required: true
      }
    },
    data() {
      let checkNewPwd = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^(?![0-9]+$)(?![a-zA-Z_]+$)[0-9A-Za-z]{6,14}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('必须输入数字与英文字母下划线组合,长度在6-14位之间'));
          } else {
            let param = {};
            param.newPassword = value;
            param.loginName = this.loginName;
            console.log(param);
            this.$http({
              method: 'POST',
              url: '/uac/user/checkNewPassword',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('新密码与原始密码不能相同'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入新密码'));
        }
      };

      let checkConfirmPwd = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,14}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('必须输入数字与英文字母组合,长度在6-14位之间'));
          } else {
            if (value !== this.modifyForm.newPassword) {
              callback(new Error('两次输入密码不一致'));
            } else {
              callback();
            }
          }
        } else {
          callback(new Error('请确认密码'));
        }
      };
      return {
        modifyForm: {
          oldPassword: '',
          newPassword: '',
          confirmPwd: ''
        },
        rules: {
          oldPassword: [
            {required: true, message: '请输入原始密码', trigger: 'blur'},
            { min: 6, max: 14, message: '长度必须在6-14位之间', trigger: 'blur' }
          ],
          newPassword: [
            { validator: checkNewPwd, trigger: 'blur' }
          ],
          confirmPwd: [
            { validator: checkConfirmPwd, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(fn) {
        this.$refs['userPwdForm'].validate((valid) => {
          if (valid) {
            this.modifyUserFn(fn);
          } else {
            return false;
          }
        });
      },
      modifyUserFn(fn) {
        this.modifyForm.loginName = this.loginName;
        this.ajax({
          url: '/uac/user/modifyUserPwd',
          data: this.modifyForm,
          loading: true,
          success: (res) => {
            fn && fn(res);
          }
        });
      }
    }
  };
</script>

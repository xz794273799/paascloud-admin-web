<template>
  <div class="pc-page-content">
    <el-form :model="formData" :rules="rules" ref="userForm" label-width="80px">
      <el-form-item label="登录名" prop="loginName" required>
        <el-input size="small" v-model="formData.loginName" :disabled="type === 'UPDATE'" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobileNo" required>
        <el-input size="small" v-model="formData.mobileNo" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="userName" required>
        <el-input size="small" v-model="formData.userName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="userCode">
        <el-input size="small" v-model="formData.userCode" :disabled="type === 'UPDATE'" placeholder="6-16位数字字母"></el-input>
      </el-form-item>
      <el-form-item label="组织名称" v-if="type === 'ADD'" required>
        <el-cascader
          size="small"
          placeholder="请选择组织名称"
          :options="groupTreeData"
          filterable
          clearabled
          change-on-select
          v-model="groupIdList"
          :props="groupProps"
          :disabled="type === 'VIEW' || type === 'UPDATE'"
          class="menu-cascader">
        </el-cascader>
      </el-form-item>
      <el-form-item label="组织名称" prop="groupName" label-width="80px" v-if="type !== 'ADD'" required>
        <el-input size="small" v-model="formData.groupName" :disabled="true" class="pc-input-auto"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" required>
        <el-input size="small" v-model="formData.email" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-if="type === 'ADD'" prop="loginPwd" required>
        <el-input size="small" type="password" v-model="formData.loginPwd" placeholder="请输入数字子母下划线组合"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio class="radio" v-model="formData.status" label="ENABLE">启用</el-radio>
        <el-radio class="radio" v-model="formData.status" label="DISABLE">禁用</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      formData: {
        type: Object
      },
      type: {
        type: String,
        required: true
      }
    },
    data() {
      let checkLoginName = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[A-Za-z0-9_]{6,16}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('请正确填写登录名,支持6-12位数字字母'));
          } else {
            this.$http({
              method: 'POST',
              url: `/uac/user/checkLoginName`,
              data: {
                userId: this.formData.id,
                loginName: this.formData.loginName
              }
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('登录名称已存在'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入登录名'));
        }
      };
      let checkEmail = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('请正确填写邮箱'));
          } else {
            this.$http({
              method: 'POST',
              url: '/uac/user/checkEmail',
              data: {
                userId: this.formData.id,
                email: this.formData.email
              }
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('该邮箱已存在'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入邮箱地址'));
        }
      };
      let checkMobileNo = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^1\d{10}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('请输入正确的手机号格式'));
          } else {
            this.$http({
              method: 'POST',
              url: '/uac/user/checkUserPhone',
              data: {
                userId: this.formData.id,
                mobileNo: this.formData.mobileNo
              }
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('手机号已存在'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入手机号'));
        }
      };
      let checkUserName = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[\u4e00-\u9faf]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('姓名只能为汉字'));
          } else {
            this.$http({
              method: 'POST',
              url: '/uac/user/checkUserName',
              data: {
                userId: this.formData.id,
                userName: this.formData.userName
              }
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('该姓名已存在'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入姓名'));
        }
      };
      let checkLoginPwd = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,14}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('必须输入数字与英文字母或下划线组合'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入密码'));
        }
      };
      return {
        groupIdList: [],
        groupTreeData: [],
        groupProps: {
          children: 'subMenu',
          value: 'id',
          label: 'menuName'
        },
        rules: {
          loginName: [
            { validator: checkLoginName, trigger: 'blur' }
          ],
          mobileNo: [
            { validator: checkMobileNo, trigger: 'blur' }
          ],
          userName: [
            { min: 2, max: 20, message: '请正确填写姓名,支持2-20个汉字', trigger: 'blur' },
            { validator: checkUserName, trigger: 'blur' }
          ],
          email: [
            { min: 4, max: 100, message: '请正确填写邮箱,支持4-100个字符', trigger: 'blur' },
            { validator: checkEmail, trigger: 'blur' }
          ],
          loginPwd: [
            { min: 6, max: 14, message: '长度必须在6-14位之间', trigger: 'blur' },
            { validator: checkLoginPwd, trigger: 'blur' }
          ]
        }

      };
    },
    created () {
      if (this.type === 'ADD') {
        this.initGroupTree();
      }
    },
    methods: {
      initGroupTree() {
        this.ajax({
          url: '/uac/group/getTree',
          loading: true,
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            console.info('data', data);
            this.groupTreeData = data;
          }
        });
      },
      submitForm(fn) {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            this.saveUserFn(fn);
          } else {
            return false;
          }
        });
      },
      saveUserFn(fn) {
        let groupIdList = this.groupIdList;
        if (groupIdList && groupIdList.length > 0) {
          this.formData.groupId = groupIdList[groupIdList.length - 1];
        }
        console.info('this.formData', this.formData);
        this.ajax({
          url: '/uac/user/save',
          data: this.formData || '',
          loading: true,
          success: (res) => {
            fn && fn(res);
          }
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .menu-cascader {
    width: 100%;
    .el-cascader__label{
      line-height: 36px;
    }
  }
</style>

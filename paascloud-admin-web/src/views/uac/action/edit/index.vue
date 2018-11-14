<style rel="stylesheet/scss" lang="scss">
  .menu-cascader {
    width: 100%;
    .el-cascader__label{
      line-height: 36px;
    }
  }
</style>
<template>
  <el-form slot="form" :model="formData" :rules="rules" ref="actionForm" label-width="80px">
    <el-form-item label="菜单名称" v-if="type === 'ADD'">
      <el-cascader
        size="small"
        placeholder="请选择组织地址"
        :options="menuTreeData"
        filterable
        clearabled
        change-on-select
        v-model="formData.menuIdList"
        :props="menuProps"
        :disabled="type === 'VIEW' || type === 'UPDATE'"
        class="menu-cascader">
      </el-cascader>
    </el-form-item>
    <el-form-item label="菜单名称" required prop="menuName" label-width="80px" v-if="type !== 'ADD'">
      <el-input size="small" v-model="formData.menuName" :disabled="true" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="权限编码" required prop="actionCode" label-width="80px">
      <el-input size="small" v-model="formData.actionCode" :disabled="type === 'UPDATE'" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="权限名称" required prop="actionName" label-width="80px">
      <el-input size="small" v-model="formData.actionName" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="权限地址" required prop="url">
      <el-input v-model="formData.url" size="small"
                :readonly="type === 'VIEW'"
                class="pc-input-auto">
      </el-input>
    </el-form-item>
    <el-form-item label="权限说明" prop="remark" label-width="80px">
      <el-input size="small" v-model="formData.remark" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-radio v-model="formData.status" label="ENABLE">启用</el-radio>
      <el-radio v-model="formData.status" label="DISABLE">禁用</el-radio>
    </el-form-item>
  </el-form>
</template>
<script>
  import { checkRoleName } from '../../../../utils/common-method/validate/index';
  export default {
    props: {
      formData: {
        type: Object
      },
      type: {
        type: String,
        required: true
      },
      menuTreeData: {
        type: Array
      }
    },
    data() {
      let checkUrl = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[/]/ || /^[a-zA-Z0-9_]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('URL请以/开头'));
          } else {
            let param = {};
            param.url = value;
            param.actionId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/action/checkUrl',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('权限地址已存在'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入菜单地址'));
        }
      };
      let checkActionCode = (rule, actionCode, callback) => {
        if (actionCode !== '' && actionCode !== undefined && actionCode !== null) {
          let reg = /^[A-Za-z0-9:]+$/;
          let val = reg.test(actionCode);
          if (val !== true) {
            callback(new Error('权限编码只能由数字字母或者冒号组成'));
          } else {
            let param = {};
            param.actionCode = actionCode;
            param.actionId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/action/checkActionCode',
              data: param
            }).then((res) => {
              if (res.result) {
                callback();
              } else {
                callback(new Error('权限编码已存在'));
              }
            });
          }
        } else {
          callback(new Error('请输入权限编码'));
        }
      };
      return {
        rules: {
          actionCode: [
            { min: 0, max: 50, message: '权限编码长度不能大于50', trigger: 'blur' },
            { validator: checkActionCode, trigger: 'blur' }
          ],
          actionName: [
            { min: 0, max: 50, message: '权限名称长度不能大于50', trigger: 'blur' },
            { validator: checkRoleName, trigger: 'blur' }
          ],
          url: [
            { min: 0, max: 100, message: '菜单地址长度不能大于100个字符', trigger: 'blur' },
            { validator: checkUrl, trigger: 'blur' }
          ],
          remark: [
            { min: 0, max: 150, message: '权限说明长度不能大于150', trigger: 'blur' }
          ]
        },
        menuProps: {
          value: 'id',
          label: 'menuName',
          children: 'subMenu'
        }
      };
    },
    methods: {
      submitForm(fn) {
        this.$refs['actionForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveActionFn(fn);
        });
      },
      saveActionFn(fn) {
        this.ajax({
          url: '/uac/action/save',
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

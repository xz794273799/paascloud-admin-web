<template>
  <el-form slot="form" :model="formData" :rules="rules" ref="roleForm" label-width="80px">
    <el-form-item label="角色编码" required prop="roleCode" label-width="80px">
      <el-input size="small" v-model="formData.roleCode" :disabled="type === 'UPDATE'" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="角色名称" required prop="roleName" label-width="80px">
      <el-input size="small" v-model="formData.roleName" class="pc-input-auto"></el-input>
    </el-form-item>
    <el-form-item label="角色说明" prop="remark" label-width="80px">
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
      }
    },
    data() {
      let checkRoleCode = (rule, roleCode, callback) => {
        if (roleCode !== '') {
          let reg = /^[A-Za-z0-9_]+$/;
          let val = reg.test(roleCode);
          if (val !== true) {
            callback(new Error('角色编码只能由数字字母或者下划线组成'));
          } else {
            let param = {};
            param.roleCode = roleCode;
            param.roleId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/role/checkRoleCode',
              data: param
            }).then((res) => {
              if (res.result) {
                callback();
              } else {
                callback(new Error('角色编码已存在'));
              }
            });
          }
        } else {
          callback(new Error('请输入角色编码'));
        }
      };
      return {
        rules: {
          roleCode: [
            { min: 0, max: 20, message: '角色编码长度不能大于20', trigger: 'blur' },
            { validator: checkRoleCode, trigger: 'blur' }
          ],
          roleName: [
            { min: 0, max: 20, message: '角色名称长度不能大于20', trigger: 'blur' },
            { validator: checkRoleName, trigger: 'blur' }
          ],
          remark: [
            { min: 0, max: 150, message: '角色说明长度不能大于150', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(fn) {
        this.$refs['roleForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveRoleFn(fn);
        });
      },
      saveRoleFn(fn) {
        this.ajax({
          url: '/uac/role/save',
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

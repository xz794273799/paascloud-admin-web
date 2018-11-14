<style rel="stylesheet/scss" lang="scss">
  .dictForm .fa-user {
    position: absolute;
    top: 0;
    margin-right: 0;
  }
</style>
<template>
  <el-form :model="formData" :rules="editRules" ref="dictForm" label-width="80px" class="dictForm">
    <el-form-item label="父级字典">
      <el-input v-model="formData.parentDictName"
                :disabled="true"
                class="pc-input-readonly-color pc-input-col3">
      </el-input>
    </el-form-item>
    <el-form-item label="字典编码" prop="dictCode">
      <el-input v-model="formData.dictCode"
                :disabled="type === 'UPDATE' || type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="字典名称" prop="dictName">
      <el-input v-model="formData.dictName"
                :disabled="type === 'VIEW'" placeholder="请输入中文汉字"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="KEY1" prop="dictName">
      <el-input v-model="formData.dictKey"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="KEY2" prop="dictName">
      <el-input v-model="formData.extendKey"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="字典排序" prop="number">
      <el-input v-model.number="formData.number"
                :disabled="type === 'VIEW'"
                placeholder="请输入整数"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="备注说明" prop="remark">
      <el-input type="textarea" v-model="formData.remark"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button type="primary" v-if="type !== 'VIEW'" @click="submitForm('dictForm')">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      data: {
        type: Object
      },
      type: {
        type: String,
        required: true
      }
    },
    watch: {
      data (newData) {
        this.formData = newData;
      }
    },
    created () {
      this.formData = this.data;
    },
    methods: {
      submitForm () {
        this.$refs['dictForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveDictFn();
        });
      },
      saveDictFn () {
        this.ajax({
          url: '/mdc/dict/save',
          data: this.formData || '',
          loading: true,
          success: () => {
            this.$emit('on-submit');
          }
        });
      }
    },
    data () {
      let checkNumber = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[0-9]*$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('只能输入整数'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入字典序号'));
        }
      };
      let checkRules = {
        dictCode: [
          {min: 1, max: 30, message: '字典编码长度不能大于30', trigger: 'blur'}
        ],
        dictName: [
          {min: 1, max: 30, message: '字典名称长度不能大于30', trigger: 'blur'}
        ],
        dictKey: [
          {min: 0, max: 30, message: 'KEY1不能超过30个字符', trigger: 'blur'}
        ],
        extendKey: [
          {min: 0, max: 30, message: 'KEY2不能超过30个字符', trigger: 'blur'}
        ],
        number: [
          {type: 'number', message: '字典序号长度不能大于2个字符', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        remark: [
          {min: 0, max: 200, message: '备注不能超过200个字符', trigger: 'blur'}
        ]
      };
      return {
        formData: this.data,
        editRules: checkRules
      };
    }
  };
</script>

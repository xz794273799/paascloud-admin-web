<template>
  <el-form :model="formData" :rules="editRules" ref="groupForm" label-width="80px">
    <el-form-item label="上级组织">
      <el-input v-model="formData.parentGroupName"
                :disabled=true
                class="pc-input-readonly-color pc-input-col3">
      </el-input>
    </el-form-item>
    <el-form-item label="组织编码" prop="groupCode">
      <el-input v-model="formData.groupCode"
                placeholder="编码唯一"
                :disabled="type === 'UPDATE' || type === 'VIEW'"
                :class="[type === 'UPDATE' || type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="组织名称" prop="groupName">
      <el-input v-model="formData.groupName"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-radio :disabled="type === 'VIEW'" v-model="formData.status" :label="0">启用</el-radio>
      <el-radio :disabled="type === 'VIEW'" v-model="formData.status" :label="1">禁用</el-radio>
    </el-form-item>
    <el-form-item label="联系人" prop="contact">
      <el-input v-model="formData.contact"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="联系电话" prop="contactPhone">
      <el-input v-model="formData.contactPhone"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="组织类型" prop="type">
      <el-select v-model="formData.type"
                 filterable
                 placeholder="请选择"
                 :disabled="type === 'VIEW'"
                 :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
        <el-option
          v-for="item in groupTypeOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="组织地址" prop="groupAddress">
      <el-cascader
        placeholder="请输入组织地址"
        :options="addressData"
        filterable
        clearable
        change-on-select
        v-model="formData.addressList"
        :disabled="type === 'VIEW'"
        :props="addressProps"
        :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="detailAddress">
      <el-input v-model="formData.detailAddress"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea"
                v-model="formData.remark"
                :disabled="type === 'VIEW'"
                :class="[type === 'VIEW' ? 'pc-input-readonly-color' : '', 'pc-input-col3']">
      </el-input>
    </el-form-item>
    <el-form-item label=" ">
      <el-button type="primary" v-if="type !== 'VIEW'" :loading="$store.getters.getButtonLoading" @click="submitForm('groupForm')">保 存</el-button>
    </el-form-item>
  </el-form>
</template>
<script type="text/ecmascript-6">
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
    data () {
      let checkPhone = (rule, value, callback) => {
        if (value !== '') {
          let reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('请正确填写您的联系电话'));
          } else {
            callback();
          }
        } else {
          callback(new Error('请输入电话号码'));
        }
      };
      let checkGroupCode = (rule, value, callback) => {
        if (value !== '' && value !== undefined && value !== null) {
          let reg = /^[A-Za-z0-9_]+$/;
          let val = reg.test(value);
          if (val !== true) {
            callback(new Error('请输入字母数字或者下划线'));
          } else {
            let param = {};
            param.groupCode = value;
            param.groupId = this.formData.id;
            this.$http({
              method: 'POST',
              url: '/uac/group/checkGroupCode',
              data: param
            }).then((res) => {
              if (res.result === false) {
                callback(new Error('组织编码已存在'));
              } else {
                callback();
              }
            });
          }
        } else {
          callback(new Error('请输入组织编码'));
        }
      };
      let checkGroupName = (rule, value, callback) => {
        console.info('value', value);
        if (value !== '' && value !== undefined && value !== null) {
          let param = {};
          param.groupName = value;
          param.groupId = this.formData.id;
          this.$http({
            method: 'POST',
            url: '/uac/group/checkGroupName',
            data: param
          }).then((res) => {
            if (res.result === false) {
              callback(new Error('组织名称已存在'));
            } else {
              callback();
            }
          });
        } else {
          callback(new Error('请输入组织名称'));
        }
      };
      return {
        addressData: [],
        addressProps: {
          value: 'id',
          label: 'nodeName',
          children: 'children'
        },
        editRules: {
          groupCode: [
            {min: 0, max: 20, message: '组织编码长度不能大于20', trigger: 'blur'},
            {validator: checkGroupCode, trigger: 'blur'}
          ],
          groupName: [
            {min: 0, max: 20, message: '组织名称长度不能大于20', trigger: 'blur'},
            {validator: checkGroupName, trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择组织类型', trigger: 'blur'}
          ],
          contact: [
            {required: true, message: '请输入联系人姓名', trigger: 'blur'},
            {min: 0, max: 20, message: '联系人姓名长度不能大于20', trigger: 'blur'}
          ],
          contactPhone: [
            {required: true, message: '请输入电话号码', trigger: 'blur'},
            {min: 0, max: 20, message: '联系电话长度不能大于20', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          remark: [
            {min: 0, max: 500, message: '备注不能超过500个字符', trigger: 'blur'}
          ]
        },
        groupTypeOption: [{
          value: '1',
          label: '大区'
        }, {
          value: '2',
          label: '基地'
        }, {
          value: '3',
          label: '其他'
        }]
      };
    },
    created () {
      // 初始化地址信息
      this.initAddressData();
    },
    watch: {
      'formData.type': function(type) {
        console.info('formData', type);
      }
    },
    methods: {
      initAddressData() {
        console.info('this', this);
        let address = this.$pcLockr.get(this.$pcEnum.ADDRESS.DISTRICT);
        console.info(address);
        if (address) {
          this.addressData = address;
          return;
        }
        this.ajax({
          url: '/mdc/address/get4City',
          success: (res) => {
            let data = res.result;
            if (!data) {
              return;
            }
            this.addressData = data;
            // 缓存在浏览器中
            this.$pcLockr.set(this.$pcEnum.ADDRESS.DISTRICT, data);
          }
        });
      },
      submitForm() {
        this.$refs['groupForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.saveRoleFn();
        });
      },
      resetValidate() {
        console.info('resetValidate');
        let editFields = this.$refs['groupForm'].fields;
        editFields.forEach((item) => {
          item.validateState = '';
          item.validateMessage = '';
        });
      },
      saveRoleFn() {
        this.ajax({
          url: '/uac/group/save',
          data: this.formData || '',
          loading: true,
          success: () => {
            console.info('this.type  ', this.type);
            this.$emit('on-submit');
          }
        });
      }
    }
  };
</script>

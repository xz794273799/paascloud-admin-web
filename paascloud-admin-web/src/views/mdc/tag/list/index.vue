<template>
  <div>
    <el-form :inline="true" :model="tagForm" ref="tagForm">
      <div class="pc-page-header">
        <el-form-item label="" prop="status">
          <el-select v-model="tagForm.status" filterable placeholder="状态" class="pc-input3-col5" value="">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="topicCode">
          <el-input v-model="tagForm.tagCode" class="pc-input3-col3" placeholder="Tag编码"></el-input>
        </el-form-item>
        <el-form-item label="" prop="topicName">
          <el-input  v-model="tagForm.tagName" class="pc-input3-col3" placeholder="Tag名称"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="queryDataFn">筛选</el-button>
          <el-button @click="resetFromFn('tagForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" stripe :empty-text='emptyText'>
      <el-table-column type="index" label="序号" min-width="65"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="65">
        <template slot-scope="scope">
          {{scope.row.status | statusToChinese}}
        </template>
      </el-table-column>
      <el-table-column prop="topicName" label="Topic名称" min-width="100"></el-table-column>
      <el-table-column prop="topicCode" label="Topic编码" min-width="150"></el-table-column>
      <el-table-column prop="tagName" label="Tag名称" min-width="100"></el-table-column>
      <el-table-column prop="tagCode" label="Tag编码" min-width="150"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" min-width="150"></el-table-column>
      <el-table-column prop="lastOperator" label="操作人" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status === 10" class="pc-textBtn pc-textBtn-danger" @click="disabledTagFn(scope)">禁用</el-button>
          <el-button type="text" v-if="scope.row.status === 20" class="pc-textBtn" @click="enableTagFn(scope)">启用</el-button>
          <el-button type="text" class="pc-textBtn-danger" @click="deleteTagFn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pc-pagination-panel">
      <pc-pagination ref="pcPagination" :url="$store.getters.getAjaxUrl.tpc.mq.queryTagListWithPage" :queryData="tagForm" @on-query="queryCallBackFn">
      </pc-pagination>
    </div>
  </div>
</template>
<script>
  import PcPagination from 'components/form/pagination';
  export default {
    data () {
      return {
        tagForm: {
          tagCode: '',
          tagName: '',
          status: ''
        },
        statusOption: [{
          value: 10,
          label: '启用'
        }, {
          value: 20,
          label: '禁用'
        }],
        tableData: [],
        emptyText: ''
      };
    },
    components: {
      PcPagination
    },
    filters: {
      statusToChinese (val) {
        let state = '';
        switch (val) {
          case 10: {
            state = '启用';
            break;
          }
          case 20: {
            state = '禁用';
            break;
          }
        }
        return state;
      }
    },
    created () {
    },
    methods: {
      disabledTagFn (scope) {
        let confirmMsg = '确定禁用' + scope.row.tagName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyTagStatusById, {
          'status': 20,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      enableTagFn (scope) {
        let confirmMsg = '确定启用' + scope.row.tagName + '吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.modifyTagStatusById, {
          'status': 10,
          'id': scope.row.id
        }, () => {
          this.queryDataFn();
        });
      },
      deleteTagFn (tag) {
        let confirmMsg = '确定删除' + tag.tagName + '吗? 删除后将不能使用，确定继续删除吗?';
        this.confirmModel(confirmMsg, this.$store.getters.getAjaxUrl.tpc.mq.deleteTagById + '/' + `${tag.id}`, null, () => {
          this.queryDataFn();
        });
      },
      queryCallBackFn (res) {
        this.tableData = res.result.list;
      },
      queryDataFn () {
        this.$refs.pcPagination.queryListWithPageFn();
      }
    }
  };
</script>

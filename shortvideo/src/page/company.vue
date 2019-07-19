<template>
  <div class="tabs">
    <div class="tabs-top">
      <div class="tabs-top-name">
        公司管理
      </div>
      <div class="tabs-top-addTask">
        <Button type="info" @click="modal">添加公司管理</Button>
      </div>
    </div>

    <div class="hang">
      <div class="flesx">
        <span class="qdName">公司名称：</span>
        <Input v-model="company" placeholder='公司名称' class="qdselect"/>
      </div>
      <div class="flesx">
        <Button type="primary" class="subtj" @click="companySelect">查询</Button>
        <!--<Button type="primary" class="subtj" @click="clearSelect">清空选择</Button>-->
      </div>
      <div class="flesx" style="">
      </div>
    </div>

    <div class="table">
      <Table border stripe :columns="columns" :data="data"></Table>
      <div class="page">
        <Page :total="tots" :page-size="limit" show-sizer :page-size-opts="sizes" :current="pages" show-elevator
              show-total
              @on-change="pageChange" @on-page-size-change="pageSize"/>
      </div>
    </div>

    <Modal
      v-model="modals1"
      :title="tits"
      @on-ok=""
      @on-cancel="">
      <div class="table-task" v-bind="editsave">
        <div class="task-cz">
          <span class="task-cz-name">
            公司名称：
          </span>
          <Input placeholder="公司名称" prefix="ios-star" v-model="editsave.company" style="width: 200px;"/>
        </div>
        <div class="task-cz">
          <span class="task-cz-name">
            备注：
          </span>
          <Input placeholder="备注" v-model="editsave.remark" style="width: 200px;"/>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="editsave_cancel">取消</Button>
        <Button type="primary" size="large" @click="editsave_ok">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        company: '',
        tots: 0,
        page: 1,
        sizes: [10, 20, 30, 50, 80, 100],
        limit: 10,
        pages: 1,
        tures: false,
        columns: [
          // {
          //   title: 'ID',
          //   align:'center',
          //   key: 'id'
          // },
          {
            title: '公司',
            align:'center',
            key: 'company'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('div', [
                h('span', {}, this.timeStamp(row.createTime / 1000)),
              ]);
            }
          },
          {
            title: '备注',
            align:'center',
            key: 'remark'
          },
          {
            title: '状态',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  props: {
                    type: 'primary',
                    value: params.row.state === 1
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (value) => {
                      this.switch(params)
                    }
                  }
                },)
              ]);
            }
          },
          {
            title: '操作',
            key: 'key15',
            width: 220,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {

                  },
                  on: {
                    click: () => {
                      this.edit(params.row.id)
                    }
                  }
                }, '编辑'),
              ]);
            }
          }
        ],
        data: [],
        modals1:false,
        modals2: false,
        tits:'',
        editsave:{
          company:'',
          remark:''
        },
        fs: false,
        k:false,
        id:'',
        bj: false,
      }
    },
    created() {

    },
    mounted: function () {
      this.companySelect();
    },
    methods: {
      modal: function () {
        this.fs = false;
        this.modals1 = true;
        this.modals2 = true;
        this.editsave.company = '';
        this.editsave.remark = '';
        this.tits = '添加公司';
      },
      edit:function(i){
        this.fs = false;
        this.tits = '编辑公司信息';
        this.modals1 = true;
        this.modals2 = false;
        if (this.bj) {
          return false;
        }
        this.bj = true;
        this.id = i;
        this.$http({
          method: 'get',
          url: this.url + '/v1/company/findCompanyById/'+i,
          data: this.editsave,
          success: ((res) => {
            console.log(res)
            if(res.data.code == 20000){
              // console.log(this.valueSaveEdit)
              let da = res.data.data;
              this.editsave.company = da.company;
              this.editsave.remark = da.remark;
              this.bj = false;
            }else if(res.data.code == 4001){
              this.$router.push({path: '/login'});
              this.bj = false;
              // this.bj = false;
            }
          }),
          error: function (err) {
            console.log(err);
          },
        })
      },
      companySelect: function () {
        if (this.tures) {
          this.pages = this.page
        } else {
          this.pages = 1;
        }
        this.$http({
          method: 'get',
          url: this.url + '/v1/company/findCompanyList?page=' + this.page + '&limit=' + this.limit + '&company=' + this.company,
          data: {},
          success: ((res) => {
            // console.log(res)
            if (res.data.code == 20000) {
              this.tots = res.data.count;
              this.data = res.data.data;
              this.page = 1;
              this.tures = false;
            } else if (res.data.code == 20003) {
              this.tots = 0;
              this.data = [];
              this.tures = false;
            } else if (res.data.code == 4001) {
              this.$router.push({path: '/login'});
            } else {
              this.$Message.warning(res.data.msg);
            }
          }),
          error: function (err) {
            console.log(err);
          }
        })
      },
      pageChange: function (e) {
        this.page = e;
        this.companySelect()
      },
      pageSize: function (e) {
        this.limit = e;
        this.page = 1;
      },
      switch: function (pa) {
        // console.log(pa)
        let state = pa.row.state;
        let id = pa.row.id;
        if (state == 0) {
          this.$http({
            method: 'put',
            url: this.url + '/v1/company/updateCompanyState/' + id + '/1',
            success: ((res) => {
              // console.log(res)
              if (res.data.code == 20000) {
                this.$Message.success('修改成功');
                this.companySelect();
              } else if (res.data.code == 4001) {
                this.$router.push({path: '/login'});
              } else {
                this.$Message.warning(res.data.msg);
              }
            }),
            error: function (err) {
              console.log(err);
            },
          })
        } else {
          this.$http({
            method: 'put',
            url: this.url + '/v1/company/updateCompanyState/' + id + '/0',
            success: ((res) => {
              // console.log(res)
              if (res.data.code == 20000) {
                this.$Message.success('修改成功');
                this.companySelect();
              } else if (res.data.code == 4001) {
                this.$router.push({path: '/login'});
              } else {
                this.$Message.warning(res.data.msg);
              }
            }),
            error: function (err) {
              console.log(err);
            },
          })
        }
      },
      editsave_ok: function () {
        if(this.editsave.company == ''){
          this.$Notice.warning({
            title: '提示',
            desc: '请选择公司名称'
          });
          return false;
        }
        this.findCompanyName()
      },
      editsave_cancel: function () {
        this.modals1 = false;
      },
      findCompanyName:function () {
        this.$http({
          method: 'get',
          url: this.url + '/v1/company/findCompanyNameExists?company='+this.editsave.company,
          success: ((res) => {
            // console.log(res);
            if (res.data.code == 20000 && res.data.data == 0) {
              this.modals1 = false;
              if (this.fs) {
                return false;
              }
              this.fs = true;
              if (this.modals2) {  //保存
                this.$http({
                  method: 'post',
                  url: this.url + '/v1/company/saveCompany',
                  data: this.editsave,
                  success: ((res) => {
                    // console.log(res);
                    if (res.data.code == 20000) {
                      this.$Message.success('添加成功');
                      this.companySelect();
                    } else if (res.data.code == 4001) {
                      this.$router.push({path: '/login'});
                    }
                  }),
                  error: function (err) {
                    console.log(err);
                  },
                })
              } else {  // 编辑
                this.$http({
                  method: 'put',
                  url: this.url + '/v1/company/updateCompany/'+this.id,
                  data: this.editsave,
                  success: ((res) => {
                    // console.log(res);
                    if (res.data.code == 20000) {
                      this.$Message.success('修改成功');
                      this.companySelect();
                    } else if (res.data.code == 4001) {
                      this.$router.push({path: '/login'});
                    }
                  }),
                  error: function (err) {
                    console.log(err);
                  },
                })
              }
            } else {
              this.$Message.success('公司名称重复了，请重新输入');
              // this.editsave.company = '';
            }
          }),
          error: function (err) {
            console.log(err);
          },
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .tabs {
    width: 100%;
    height: 100%;
    background-color: #f6f6f6;
    padding: 10px;
    .tabs-top {
      width: 100%;
      height: 50px;
      line-height: 40px;
      border-bottom: 1px solid #cccccc;
      margin-bottom: 10px;
      .tabs-top-name {
        font-size: 18px;
        float: left;
      }
      .tabs-top-addTask {
        float: right;
      }
    }
  }
  .page {
    padding-top: 20px;
  }
  .table-task {
    .task-cz {
      margin-bottom: 8px;
      .task-cz-name {
        width: 100px;
        text-align: right;
        display: inline-block;
      }
    }
  }
  .hang {
    display: flex;
    width: 100%;
    overflow: hidden;
    margin-bottom: 12px;
    .flesx {
      flex: 1;
    }
    .qdName {
      display: block;
      float: left;
      line-height: 30px;
      width: 100px;
      text-align: right;
      letter-spacing: 2px;
    }
    .qdselect, .start {
      display: block;
      float: left;
      width: 200px;
      margin-right: 30px;
    }
  }
  .ivu-input {
    width: 100% !important;
  }
  .subtj {
    text-align: left;
  }
</style>

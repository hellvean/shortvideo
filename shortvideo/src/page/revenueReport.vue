<template>
  <div class="tabs">
    <div class="tabs-top">
      <div class="tabs-top-name">
        收入报表
      </div>
    </div>

    <div class="hang">
      <div class="flesx">
        <span class="qdName">公司名称：</span>
        <Select v-model="companyId" filterable clearable style="width:200px">
          <Option v-for="item in companyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="flesx">
        <span class="qdName">用途：</span>
        <Select v-model="useOfFunds" filterable clearable style="width:200px">
          <Option v-for="item in userfundList" :value="item.id" :key="item.id">{{ item.value }}</Option>
        </Select>
      </div>
      <div class="flesx" style="">
        <span class="qdName">申请人：</span>
        <Select v-model="applyUserId" filterable clearable style="width:200px">
          <Option v-for="item in applyuserlist" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
    </div>
    <div class="hang">
      <div class="flesx">
        <span class="qdName">开始时间：</span>
        <DatePicker type="datetime" v-model="startTime" format="yyyy-MM-dd HH:mm"
                    placeholder="请选择开始时间"
                    class="qdselect"></DatePicker>
      </div>
      <div class="flesx">
        <span class="qdName">结束时间：</span>
        <DatePicker type="datetime" v-model="endTime" format="yyyy-MM-dd HH:mm"
                    placeholder="请选择结束时间"
                    class="qdselect"></DatePicker>
      </div>
      <div class="flesx">
        <Button type="primary" class="subtj" @click="applySelect">查询</Button>
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

  </div>
</template>

<script>
  export default {
    data() {
      return {
        companyList: '',
        companyId: '',
        userfundList: [
          {
            value: '淘宝订单',
            id: '0'
          },
          {
            value: '运营推广',
            id: '1'
          }
        ],
        startTime: '',
        endTime: '',
        useOfFunds: '',
        applyUserId: '',
        applyuserlist: '',
        tots: 0,
        page: 1,
        sizes: [10, 20, 30, 50, 80, 100],
        limit: 10,
        pages: 1,
        tures: false,
        columns: [
          {
            title: '收入',
            align: 'center',
            key: 'actualAmountReceive'
          },
          {
            title: '支出',
            align: 'center',
            key: 'totalPrice'
          },
          {
            title: '利润',
            align: 'center',
            key: 'totalProfit'
          },
        ],
        data: [],
      }
    },
    created() {

    },
    mounted: function () {
      this.endTime = new Date(new Date().getTime());
      this.startTime = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
      this.companylist();
      this.apply();
      this.applySelect();
    },
    methods: {
      pageChange: function (e) {
        this.page = e;
        this.applySelect()
      },
      pageSize: function (e) {
        this.limit = e;
        this.page = 1;
      },
      applySelect:function(){
        this.companyId = ((this.companyId == 'undefined' || this.companyId == undefined) ? '' : this.companyId);
        this.useOfFunds = ((this.useOfFunds == 'undefined' || this.useOfFunds == undefined) ? '' : this.useOfFunds);
        this.applyUserId = ((this.applyUserId == 'undefined' || this.applyUserId == undefined) ? '' : this.applyUserId);
        let t1, t2;
        if (this.startTime == '') {
          t1 = '';
        } else {
          t1 = this.startTime.getFullYear() + '-' + this.times(this.startTime.getMonth() + 1) + '-' + this.times(this.startTime.getDate()) + ' ' + this.times(this.startTime.getHours()) + ':' + this.times(this.startTime.getMinutes())
        }
        if (this.endTime == '') {
          t2 = '';
        } else {
          t2 = this.endTime.getFullYear() + '-' + this.times(this.endTime.getMonth() + 1) + '-' + this.times(this.endTime.getDate()) + ' ' + this.times(this.endTime.getHours()) + ':' + this.times(this.endTime.getMinutes())
        }
        if (this.tures) {
          this.pages = this.page
        } else {
          this.pages = 1;
        }
        this.$http({
          method: 'get',
          url: this.url + '/v1/orderApply/findOrderApplyProfitList?page=' + this.page + '&limit=' + this.limit+'&companyId='+this.companyId+"&useOfFunds="+this.useOfFunds+"&applyUserId="+this.applyUserId+"&startTime="+t1+"&endTime="+t2,
          data: {},
          success: ((res) => {
            // console.log(res)
            if (res.data.code == 20000) {
              this.tots = res.data.count;
              this.data = res.data.data;
              let da = res.data.data;
              let actualsum=0,pricesum=0,profitsum=0;
              for(let i=0;i<da.length;i++){
                actualsum+=da[i].actualAmountReceive*1;
                pricesum+=da[i].totalPrice*1;
                profitsum+=da[i].totalProfit*1;
              }
              this.data.push({actualAmountReceive:'总计：'+actualsum.toFixed(2),totalPrice:pricesum.toFixed(2),totalProfit:profitsum.toFixed(2)})
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
      companylist: function () {
        this.$http({
          method: 'get',
          url: this.url + '/v1/company/findCompanySel',
          data: {},
          success: ((res) => {
            // console.log(res);
            if (res.data.code == 20000) {
              this.companyList = res.data.data;
            } else if (res.data.code == 4001) {
              this.$router.push({path: '/login'});
            }
          })
        })
      },
      apply:function () {
        this.$http({
          method: 'get',
          url: this.url + '/v1/user/findApplyUserListSel',
          data: {},
          success: ((res) => {
            // console.log(res);
            if (res.data.code == 20000) {
              this.applyuserlist = res.data.data;
            } else if (res.data.code == 4001) {
              this.$router.push({path: '/login'});
            }
          })
        })
      },
      times: function (i) {
        if (i < 10) {
          return "0" + i
        } else {
          return i;
        }
      },
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

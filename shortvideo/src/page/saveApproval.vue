<template>
  <div class="tabs">
    <div class="tabs-top">
      <div class="tabs-top-name">
        审批申请
      </div>
      <div class="tabs-top-addTask">
        <Button type="info" @click="modal">添加审批</Button>
      </div>
    </div>

    <div class="hang">
      <div class="flesx">
        <span class="qdName">公司：</span>
        <Select v-model="companyId" filterable clearable style="width:200px">
          <Option v-for="item in companyList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="flesx">
        <span class="qdName">打款用途：</span>
        <Select v-model="useOfFunds" filterable clearable style="width:200px">
          <Option v-for="item in userfundList" :value="item.id" :key="item.id">{{ item.value }}</Option>
        </Select>
      </div>
      <div class="flesx">
        <span class="qdName">审批状态：</span>
        <Select v-model="approvalFinish" filterable clearable style="width:200px">
          <Option v-for="item in approvalList" :value="item.id" :key="item.id">{{ item.value }}</Option>
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
        <span class="qdName">说明：</span>
        <Input v-model="usedDescribe" placeholder='说明' class="qdselect"/>
      </div>
    </div>
    <div class="hang">
      <div class="flesx"></div>
      <div class="flesx"></div>
      <div class="flesx">
        <Button type="primary" class="subtj" @click="approvalSelect">查询</Button>
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
      :width="1090"
      :mask-closable="fa"
      @on-ok=""
      @on-cancel="">
      <div class="table-task">
        <div class="spxx">基本信息</div>
        <div class="task-cz">
          <div class="task-li">
            <span class="task-cz-name">
            公司名称：
          </span>
            <Select v-model="editsave.companyId" filterable :label-in-value="true" style="width:150px"
                    :disabled="displays"
                    @on-change="selectcompany">
              <Option v-for="item in companyList" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            用途：
          </span>
            <Select v-model="editsave.useOfFunds" filterable style="width:150px" :disabled="displays"
                    @on-change="selectuserfund">
              <Option v-for="item in userfundList" :value="item.id" :key="item.id">{{ item.value }}</Option>
            </Select>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            用途说明：
          </span>
            <Input placeholder="用途说明" v-model="editsave.usedDescribe" :disabled="displays" style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            用款部门：
          </span>
            <Input placeholder="用款部门" v-model="editsave.fundsDepartment" :disabled="displays" style="width: 150px"/>
          </div>
        </div>

        <div class="task-cz">
          <div class="task-li" v-show="!distinguish">
            <span class="task-cz-name">
            预计播放提升：
          </span>
            <!--<Input placeholder="预计播放提升" v-model="editsave.opExpectIncreasePlay"  :disabled="displays"-->
                   <!--style="width: 150px"/>-->
            <InputNumber v-model="editsave.opExpectIncreasePlay" :disabled="displays" style="width: 150px"></InputNumber>
          </div>
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name" v-show="distinguish">
            淘宝单价：
          </span>
            <Input placeholder="淘宝单价" v-model="editsave.tbOrderPrice"  :disabled="displays"
                   style="width: 150px"/>
          </div>
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name">
            淘宝数量：
          </span>
            <Input placeholder="淘宝数量" v-model="editsave.tbOrderNum"  :disabled="displays"
                   style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            总价：
          </span>
            <!--<Input placeholder="总价" v-model="editsave.totalPrice"  :disabled="displays" @on-focus="compute"-->
                   <!--style="width: 150px"/>-->
            <InputNumber v-model="editsave.totalPrice" :disabled="displays" @on-focus="compute" style="width: 150px"></InputNumber>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            申请时间：
          </span>
            <!--<DatePicker type="datetime" v-model="editsave.applyTime" @on-change="handleChange2" format="yyyy-MM-dd HH:mm"-->
            <!--placeholder="请选择申请时间" :disabled="displays"-->
            <!--class="qdselect" style="width: 150px"></DatePicker>-->
            <DatePicker type="datetime" v-model="editsave.applyTime" @on-change="editsave.applyTime=$event"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="请选择申请时间" :disabled="displays"
                        class="qdselect" style="width: 150px"></DatePicker>
            <!--<Input placeholder="总价" v-model="editsave.applyTime" style="width: 150px"/>-->
          </div>
        </div>


        <div class="spxx">打款信息</div>
        <div class="task-cz">
          <div class="task-li">
            <span class="task-cz-name">
            收款单位：
          </span>
            <Input placeholder="收款单位名称" v-model="editsave.receiveCompanyName" :disabled="displays"
                   style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            收款账户：
          </span>
            <Input placeholder="收款账户" v-model="editsave.receiveAccount" :disabled="displays" style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            开户银行：
          </span>
            <Input placeholder="开户银行" v-model="editsave.openAccountBank" :disabled="displays" style="width: 150px"/>
          </div>
        </div>

        <div class="spxx" v-show="distinguish">回款信息</div>
        <div class="task-cz">
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name">
            预计回款金额：
          </span>
            <Input placeholder="预计回款金额" v-model="editsave.refundAmount" :disabled="displays" style="width: 150px"/>
          </div>
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name">
            预计回款时间：
          </span>
            <DatePicker type="datetime" v-model="editsave.refundTime" @on-change="handleChange1"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="预计回款时间" :disabled="displays"
                        class="qdselect" style="width: 150px"></DatePicker>
          </div>

        </div>

        <div class="spxx" v-show="annexshow">财务附件</div>
        <div class="task-cz" v-show="annexshow">
          <div class="demo-upload-list" v-for="(item,index) in uploadList">
            <img :src="item" v-if="its(item) == '1'">
            <img src="http://javastore.oss-cn-hangzhou.aliyuncs.com/bug/img1553564542066.png" v-else>
            <div class="demo-upload-list-cover" v-if="its(item) == '1'">
              <Icon type="ios-eye-outline" @click.native="handleView(item)" style="font-size: 10px;"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(index)" style="font-size: 10px;"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)" style="font-size: 10px;"></Icon>
            </div>
            <div class="demo-upload-list-cover" v-else>
              <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
          </div>
          <!--:format="['jpg','jpeg','png']"-->
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :before-upload="progresss"
            :max-size="102400"
            :on-format-error="handleFormatError"
            multiple
            :disabled="displays"
            type="drag"
            :action="action"
            :headers='headers'
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </div>

        <div class="spxx" v-show="!annexshow">财务附件</div>
        <div class="task-cz" v-show="!annexshow">
          <div class="demo-upload-list" v-for="(item,index) in uploadList">
            <img :src="item" v-if="its(item) == '1'">
            <img src="http://javastore.oss-cn-hangzhou.aliyuncs.com/bug/img1553564542066.png" v-else>
            <div class="demo-upload-list-cover" v-if="its(item) == '1'">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
            <div class="demo-upload-list-cover" v-else>
              <!--<Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>-->
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
          </div>
        </div>

        <Modal title="大图" v-model="visible">
          <img :src="imgName" v-if="visible" class="imgses" :style="{transform:'rotateZ('+this.deg+'deg)'}">
          <div slot="footer">
            <Button type="info" prefix="md-sync" size="large" @click="rotate">旋转90°</Button>
            <!--<Button type="primary" size="large" @click="editsave_ok(2)">提交申请</Button>-->
          </div>
        </Modal>

        <div class="spxx">审批人</div>
        <div class="task-cz" style="">
          <div class="task-li">
            <span class="task-cz-name">
            一级审批人：
          </span>
            <Select v-model="editsave.leaderApprovalId" filterable :label-in-value="true" :disabled="displays"
                    style="width:150px"
                    @on-change="selectspr1">
              <Option v-for="item in user1list" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            二级审批人：
          </span>
            <Select v-model="editsave.financeApprovalId" filterable :label-in-value="true" :disabled="displays"
                    style="width:150px"
                    @on-change="selectspr2">
              <Option v-for="item in user2list" :value="item.id" :key="item.name">{{ item.name }}</Option>
            </Select>
          </div>
        </div>

        <div class="task-cz" style="height: 36px;" v-show="saveshow">
          <Button type="info" size="large" style="float: right;margin-right: 20px;" @click="ok(2)">提交申请
          </Button>
          <Button type="primary" size="large" style="float: right;margin-right: 20px;" @click="ok(1)">保存
          </Button>
        </div>

        <div class="spxx" v-show="payshow" style="padding-top: 10px;border-top: 1px solid #ccc">财务打款凭证</div>
        <div class="task-cz" v-show="payshow">
          <div class="demo-upload-list" v-for="(item,index) in payList">
            <img :src="item">
            <div class="demo-upload-list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
          </div>
        </div>


        <div v-if="invoiceshow" style="padding-top: 10px;border-top: 1px solid #ccc">
          <div class="spxx">发票信息</div>
          <div class="task-cz">
            <div class="demo-upload-list" v-for="(item,index) in invoiceList">
              <img :src="item" v-if="its(item) == '1'">
              <img src="http://javastore.oss-cn-hangzhou.aliyuncs.com/bug/img1553564542066.png" v-else>
              <div class="demo-upload-list-cover" v-if="its(item) == '1'">
                <Icon type="ios-eye-outline" @click.native="handleView(item)" style="font-size: 10px;"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove1(index)" style="font-size: 10px;"></Icon>
                <Icon type="ios-cloud-download" @click.native="download(item)" style="font-size: 10px;"></Icon>
              </div>
              <div class="demo-upload-list-cover" v-else>
                <!--<Icon type="ios-eye-outline" @click.native="handleView(item)" style="font-size: 10px;"></Icon>-->
                <Icon type="ios-trash-outline" @click.native="handleRemove1(index)"></Icon>
                <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
              </div>
            </div>
            <!--:format="['jpg','jpeg','png']"-->
            <Upload
              ref="upload"
              :show-upload-list="false"
              :on-success="handleSuccess1"
              :before-upload="progresss"
              :max-size="102400"
              :on-format-error="handleFormatError"
              multiple
              type="drag"
              :action="action"
              :headers='headers'
              style="display: inline-block;width:58px;">
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </div>
          <div class="task-cz" style="height: 36px;">
            <Button type="info" size="large" style="float: right;margin-right: 20px;" @click="invoice_ok">上传发票</Button>
          </div>
        </div>

        <div class="spxx" v-show="invoiceshows" style="padding-top: 10px;border-top: 1px solid #ccc">发票信息</div>
        <div class="task-cz" v-show="invoiceshows">
          <div class="demo-upload-list" v-for="(item,index) in invoiceList">
            <img :src="item" v-if="its(item) == '1'">
            <img src="http://javastore.oss-cn-hangzhou.aliyuncs.com/bug/img1553564542066.png" v-else>
            <div class="demo-upload-list-cover" v-if="its(item) == '1'">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
            <div class="demo-upload-list-cover" v-else>
              <!--<Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>-->
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
          </div>
        </div>

        <div class="spxx" v-show="paybackshow" style="padding-top: 10px;border-top: 1px solid #ccc">回款信息</div>
        <div class="task-cz" v-show="paybackshow">
          <div class="demo-upload-list" v-for="(item,index) in paybackList">
            <img :src="item" v-if="its(item) == '1'">
            <img src="http://javastore.oss-cn-hangzhou.aliyuncs.com/bug/img1553564542066.png" v-else>
            <div class="demo-upload-list-cover" v-if="its(item) == '1'">
              <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
            <div class="demo-upload-list-cover" v-else>
              <!--<Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>-->
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
          </div>
        </div>
        <div class="task-cz" v-show="paybackshow">
          <div class="task-li">
            <span class="task-cz-name">
            实际回款金额：
          </span>
            <Input placeholder="实际回款金额" v-model="actualAmountReceive" style="width: 150px"/>
          </div>
        </div>


      </div>

      <div slot="footer">
        <!--<Button type="primary" size="large" @click="editsave_ok(1)">保存</Button>-->
        <!--<Button type="primary" size="large" @click="editsave_ok(2)">提交申请</Button>-->
      </div>
    </Modal>

    <Modal
      v-model="historymodel"
      title="审批记录"
      @on-ok=""
      @on-cancel="">
      <Timeline>
        <TimelineItem v-for="item in history" color="green">{{item.time}}&nbsp;&nbsp;&nbsp;{{item.name}}&nbsp;&nbsp;&nbsp;{{item.content}}</TimelineItem>
      </Timeline>
      <div slot="footer">
      </div>
    </Modal>

    <Modal v-model="modal1"
           title="审批"
           @on-ok="editsave_ok"
           @on-cancel="cancel">
      <div>确认操作？</div>
    </Modal>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        modal1: false,
        ids: '',
        fa: false,
        companyId: '',
        startTime: '',
        endTime: '',
        useOfFunds: '',
        approvalFinish: '0',
        saveshow: true,
        tots: 0,
        page: 1,
        sizes: [10, 20, 30, 50, 80, 100],
        limit: 10,
        pages: 1,
        tures: false,
        deg: 0,
        columns: [
          {
            title: '公司',
            align: 'center',
            key: 'company'
          },
          {
            title: '用途',
            align: 'center',
            key: 'useOfFunds',
            render: (h, params) => {
              const row = params.row;
              return h('div', [
                h('span', {}, this.userfund(row.useOfFunds)),
              ]);
            }
          },
          {
            title: '说明',
            align: 'center',
            key: 'usedDescribe'
          },
          {
            title: '预计回款时间',
            align: 'center',
            key: 'refundTime'
          },
          {
            title: '申请金额',
            align: 'center',
            key: 'totalPrice'
          },
          {
            title: '回款金额',
            align: 'center',
            key: 'actualAmountReceive'
          },
          {
            title: '申请时间',
            align: 'center',
            key: 'applyTime'
          },
          {
            title: '审批状态',
            align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('div', [
                h('span', {}, this.approval(row.applyState)),
              ]);
            }
          },
          {
            title: '审批记录',
            key: 'key15',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'info',
                    size: 'small'
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.approvalHislist(params.row.id)
                    }
                  }
                }, '查看'),
              ]);
            }
          },
          {
            title: '操作',
            key: 'key15',
            width: 80,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {},
                  on: {
                    click: () => {
                      this.edit(params.row.id, params.row.applyState)
                    }
                  }
                }, '编辑'),
              ]);
            }
          }
        ],
        displays: false,
        data: [],
        editsave: {
          companyId: '',
          company: '',
          useOfFunds: '0',
          usedDescribe: '',
          tbOrderPrice: '',
          tbOrderNum: '',
          totalPrice: 0,
          opExpectIncreasePlay: 0,
          receiveCompanyName: '',
          receiveAccount: '',
          openAccountBank: '',
          fundsDepartment: '',
          refundAmount: '',
          refundTime: '',
          applyTime: '',
          leaderApprovalId: '',
          leaderApprovalName: '',
          financeApprovalId: '',
          financeApprovalName: '',
          applyState: '',
          pictureFile: {
            type: '',
            urls: []
          }
        },
        modals1: false,
        modals2: false,
        distinguish: true,   //区分淘宝还是运营
        tits: '',
        companyList: '',
        usedDescribe: '',
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
        approvalList: [
          {
            value: '进行中',
            id: '0'
          },
          {
            value: '已完成',
            id: '1'
          }
        ],
        defaultList: [],
        imgName: '',
        visible: false,
        uploadList: [],
        action: this.url + '/v1/file/upload',
        headers: {'token': sessionStorage.getItem('HT_token')},
        user1list: [],
        user2list: [],
        imaglist: '',
        id: '',  //修改的id
        payshow: false,  //展示打款
        payList: '',  //打款图片
        invoiceshows: false,
        invoiceshow: false, //展示发票
        invoiceList: '',  //发票图片
        paybackshow: false, //展示回款
        paybackList: '', //回款图片
        payshow1: false,  // 运营打款展示
        invoicesave: {
          type: 3,
          urls: [],
        },
        history: [],
        historymodel: false,
        actualAmountReceive: '',
        annexshow: true,
      }
    },
    created() {

    },
    mounted: function () {
      this.endTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      this.startTime = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
      this.approvalSelect();
      this.companylist();
      this.onefinduserlist();
      this.twofinduserlist();
    },
    methods: {
      progresss: function (e) {
        // console.log(e)
        this.$Notice.info({
          title: '提示',
          desc: '正在上传'
        });
      },
      ok: function (i) {
        this.ids = i;
        this.modal1 = true;
      },
      cancel: function () {
        this.modal1 = false;
      },
      its: function (i) {
        if (!/\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(i)) {
          return 0;
        } else {
          return 1;
        }
      },
      download: function (i) {
        var alink = document.createElement("a");
        alink.href = i;
        // alink.download = "pic"; //图片名
        alink.click();
      },
      compute: function () {
        // console.log('dsds')
        if (this.distinguish) {
          // console.log('tb')
          if (this.editsave.tbOrderPrice == '') {
            this.$Notice.warning({
              title: '提示',
              desc: '请输入淘宝单价'
            });
            return false;
          }
          if (this.editsave.tbOrderNum == '') {
            this.$Notice.warning({
              title: '提示',
              desc: '请输入淘宝数量'
            });
            return false;
          }
          this.editsave.totalPrice = this.editsave.tbOrderNum * this.editsave.tbOrderPrice;
        } else {
          // console.log('yy')
        }
      },
      approvalHislist: function (i) {
        // console.log(i)
        this.$http({
          method: 'get',
          url: this.url + '/v1/orderApprovalHis/findOrderApprovalHisList?orderApplyId=' + i,
          data: this.invoicesave,
          success: ((res) => {
            // console.log(res)
            if (res.data.code == 20000) {
              let da = res.data.data;
              let strs = [];
              for (let i = 0; i < da.length; i++) {
                let str = {};
                str.name = da[i].approvalName;
                str.time = this.timeStamp(da[i].approvalTime / 1000)
                str.content = this.approval(da[i].approvalState)
                strs.push(str)
              }
              this.history = strs;
              this.historymodel = true;
              // console.log(strs);
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
      invoice_ok: function () {
        if (this.invoiceList.length == 0) {
          this.$Notice.warning({
            title: '提示',
            desc: '请上传发票'
          });
          return false;
        }
        this.invoicesave.urls = this.invoiceList;
        this.$http({
          method: 'put',
          url: this.url + '/v1/pictureFile/updatePictureFile/' + this.id,
          data: this.invoicesave,
          success: ((res) => {
            // console.log(res)
            if (res.data.code == 20000) {
              this.$Message.success('发票上传成功');
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
      rotate: function () {
        this.deg += 90;
      },
      handleView(name) {
        this.deg = 0;
        this.imgName = name;
        this.visible = true;
      },
      handleRemove(i) {   //删除财务附件
        this.uploadList.splice(i, 1)
      },
      handleRemove1(i) {  //删除淘宝发票附件 --申请人上传
        this.invoiceList.splice(i, 1)
      },
      handleSuccess(res, file) {
        // console.log(res)
        this.$Message.info('上传完成');
        this.uploadList.push(res.data)
      },
      handleSuccess1(res, file) {
        this.$Message.info('上传完成');
        this.invoiceList.push(res.data)
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '图片格式不对',
          desc: "只能上传png,jpg,jpeg格式的图片"
        });
      },
      onefinduserlist: function () {
        this.$http({
          method: 'get',
          url: this.url + '/v1/user/findLevel1ApprovalUserList',
          data: {},
          success: ((res) => {
            // console.log(res);
            if (res.data.code == 20000) {
              this.user1list = res.data.data;
            } else if (res.data.code == 4001) {
              this.$router.push({path: '/login'});
            }
          })
        })
      },
      selectspr1: function (e) {
        if (typeof e != 'undefined') {
          this.editsave.leaderApprovalName = e.label;
        } else {
          this.editsave.leaderApprovalName = '';
        }
      },
      selectspr2: function (e) {
        if (typeof e != 'undefined') {
          this.editsave.financeApprovalName = e.label;
        } else {
          this.editsave.financeApprovalName = '';
        }
      },
      twofinduserlist: function () {
        this.$http({
          method: 'get',
          url: this.url + '/v1/user/findLevel2ApprovalUserList',
          data: {},
          success: ((res) => {
            // console.log(res);
            if (res.data.code == 20000) {
              this.user2list = res.data.data;
            } else if (res.data.code == 4001) {
              this.$router.push({path: '/login'});
            }
          })
        })
      },
      handleChange1: function (e) {
        this.editsave.refundTime = e;
      },
      handleChange2: function (e) {
        this.editsave.applyTime = e;
      },
      editsave_cancel: function () {

      },
      editsave_ok: function () {
        if (this.displays) {
          this.$Notice.warning({
            title: '提示',
            desc: '点击无效，现在不能对审批进行修改！'
          });
          return false;
        }
        if (this.editsave.companyId == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择公司名称'
          });
          return false;
        }
        if (this.editsave.company == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择公司名称'
          });
          return false;
        }
        if (this.editsave.usedDescribe == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择用途说明'
          });
          return false;
        }
        if (this.editsave.fundsDepartment == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择用途部门'
          });
          return false;
        }
        if (this.editsave.useOfFunds == 0) {
          // console.log('tb')
          if (this.editsave.tbOrderPrice == '') {
            this.$Notice.warning({
              title: '提示',
              desc: '请输入淘宝单价'
            });
            return false;
          }
          if (this.editsave.tbOrderNum == '') {
            this.$Notice.warning({
              title: '提示',
              desc: '请输入淘宝数量'
            });
            return false;
          }
        }
        if (this.editsave.totalPrice == 0 || typeof(this.editsave.totalPrice)=='object') {
          this.$Notice.warning({
            title: '提示',
            desc: '请输入总金额'
          });
          return false;
        }
        if (this.editsave.applyTime == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择申请时间'
          });
          return false;
        }
        if (this.editsave.useOfFunds == 1) {
          // console.log('tb')
          if (this.editsave.opExpectIncreasePlay == 0 || typeof(this.editsave.opExpectIncreasePlay)=='object') {
            this.$Notice.warning({
              title: '提示',
              desc: '请输入预计播放提升'
            });
            return false;
          }


        }
        if (this.editsave.receiveCompanyName == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请输入收款单位'
          });
          return false;
        }
        if (this.editsave.receiveAccount == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请输入收款账户'
          });
          return false;
        }
        if (this.editsave.openAccountBank == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请输入开户银行'
          });
          return false;
        }

        if (this.editsave.useOfFunds == 0) {
          // console.log('tb')
          if (this.editsave.refundAmount == '') {
            this.$Notice.warning({
              title: '提示',
              desc: '请输入预计回款金额'
            });
            return false;
          }
          if (this.editsave.refundTime == '') {
            this.$Notice.warning({
              title: '提示',
              desc: '请输入预计回款时间'
            });
            return false;
          }
        }

        if (this.uploadList == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请上传附件'
          });
          return false;
        }

        if (this.editsave.leaderApprovalId == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择一级审批人'
          });
          return false;
        }

        if (this.editsave.leaderApprovalName == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择一级审批人'
          });
          return false;
        }

        if (this.editsave.financeApprovalId == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择二级审批人'
          });
          return false;
        }
        if (this.editsave.financeApprovalName == '') {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择二级审批人'
          });
          return false;
        }
        // console.log(this.editsave)
        // console.log(this.uploadList);  //提取图拍的url
        this.editsave.pictureFile.type = '1';
        this.editsave.pictureFile.urls = this.uploadList;
        let time = this.editsave.applyTime;
        var d = new Date(time);

        var times = d.getFullYear() + '-' + this.times((d.getMonth() + 1)) + '-' + this.times(d.getDate()) + ' ' + this.times(d.getHours()) + ':' + this.times(d.getMinutes())
        this.editsave.applyTime = times;
        // console.log(i)
        // console.log(this.editsave)
        this.modals1 = false;
        this.modal1 = false;
        if (this.ids == 1) {   //保存
          this.editsave.applyState = 1;
          if (this.modals2) {   //普通保存
            console.log('普通保存');
            // console.log(this.editsave)
            this.$http({
              method: 'post',
              url: this.url + '/v1/orderApply/saveOrderApply',
              data: this.editsave,
              success: ((res) => {
                // console.log(res);
                if (res.data.code == 20000) {
                  this.$Message.success('保存成功');
                  this.approvalSelect();
                } else if (res.data.code == 4001) {
                  this.$router.push({path: '/login'});
                } else {
                  this.$Message.warning(res.data.msg);
                }
              })
            })
          } else {  //修改保存
            this.$http({
              method: 'put',
              url: this.url + '/v1/orderApply/updateOrderApply/' + this.id,
              data: this.editsave,
              success: ((res) => {
                // console.log(res);
                if (res.data.code == 20000) {
                  this.$Message.success('修改保存成功');
                  this.approvalSelect();
                } else if (res.data.code == 4001) {
                  this.$router.push({path: '/login'});
                } else {
                  this.$Message.warning(res.data.msg);
                }
              })
            })
            // console.log('修改保存');
          }
        } else {  //提交
          this.editsave.applyState = 2;
          if (this.modals2) {   //普通提交
            // console.log('普通提交')
            // console.log(this.editsave)
            this.$http({
              method: 'post',
              url: this.url + '/v1/orderApply/saveOrderApply',
              data: this.editsave,
              success: ((res) => {
                // console.log(res);
                if (res.data.code == 20000) {
                  this.$Message.success('提交成功');
                  this.approvalSelect();
                } else if (res.data.code == 4001) {
                  this.$router.push({path: '/login'});
                } else {
                  this.$Message.warning(res.data.msg);
                }
              })
            })
          } else {  //修改提交
            this.$http({
              method: 'put',
              url: this.url + '/v1/orderApply/updateOrderApply/' + this.id,
              data: this.editsave,
              success: ((res) => {
                // console.log(res);
                if (res.data.code == 20000) {
                  this.$Message.success('修改提交成功');
                  this.approvalSelect();
                } else if (res.data.code == 4001) {
                  this.$router.push({path: '/login'});
                } else {
                  this.$Message.warning(res.data.msg);
                }
              })
            })
            // console.log('修改提交')
          }
        }
      },
      edit: function (i, j) {
        this.tits = '修改审批';
        this.modals1 = true;
        this.modals2 = false;
        // console.log(i)
        this.id = i;
        if (j == 1) {
          this.displays = false;
          this.saveshow = true;
        } else {
          this.displays = true;
          this.saveshow = false;
        }
        this.$http({
          method: 'get',
          url: this.url + '/v1/orderApply/findOrderApplyById/' + i,
          data: this.editsave,
          success: ((res) => {
            // console.log(res)
            if (res.data.code == 20000) {
              let da = res.data.data;
              if (da.applyState == 24) {
                this.payshow = true;
                this.invoiceshows = true;
                this.paybackshow = true;
                this.annexshow = false;
              } else if (da.applyState == 23) {
                this.payshow = true;
                this.invoiceshows = true;
                this.annexshow = false;
              } else if (da.applyState == 22 && da.useOfFunds == 0) {
                // console.log('yxl')
                this.payshow = true;  //淘宝-要上传打款凭证
                this.invoiceshow = true;
                this.annexshow = false;
              } else if (da.applyState == 22 && da.useOfFunds == 1) {
                this.payshow = true; //运营-要上传打款凭证
                this.invoiceshow = false;
                this.annexshow = false;
              } else {
                this.payshow = false;
                this.invoiceshow = false;
                this.invoiceshows = false;
                this.paybackshow = false;
                this.payshow1 = false;
              }
              if (da.applyState == 11 || da.applyState == 2 || da.applyState == 21) {
                this.annexshow = false;
              }
              this.uploadList = [];
              this.payList = [];
              this.invoiceList = [];
              this.paybackList = [];
              this.editsave.companyId = da.companyId;
              this.editsave.company = da.company;
              this.editsave.useOfFunds = da.useOfFunds.toString();  //用途
              if (this.editsave.useOfFunds == 0) {
                this.distinguish = true;
              } else {
                this.distinguish = false;
              }
              this.editsave.usedDescribe = da.usedDescribe;
              this.editsave.tbOrderPrice = da.tbOrderPrice;
              this.editsave.tbOrderNum = da.tbOrderNum;
              this.editsave.totalPrice = da.totalPrice;
              this.editsave.opExpectIncreasePlay = da.opExpectIncreasePlay;
              this.editsave.receiveCompanyName = da.receiveCompanyName;
              this.editsave.receiveAccount = da.receiveAccount;
              this.editsave.openAccountBank = da.openAccountBank;
              this.editsave.fundsDepartment = da.fundsDepartment;
              this.editsave.refundAmount = da.refundAmount;
              this.editsave.refundTime = da.refundTime;
              this.editsave.applyTime = da.applyTime;
              this.editsave.applyState = da.applyState;
              this.editsave.leaderApprovalId = da.leaderApprovalId;
              this.editsave.leaderApprovalName = da.leaderApprovalName;
              this.editsave.financeApprovalId = da.financeApprovalId;
              this.editsave.financeApprovalName = da.financeApprovalName;
              this.actualAmountReceive = da.actualAmountReceive;
              let d = da.pictureFile;
              // console.log(d)
              for (let i in d) {
                if (d[i].type == 1) {
                  // console.log(d[i])
                  this.editsave.pictureFile.type = da.pictureFile[i].type;
                  this.editsave.pictureFile.urls = da.pictureFile[i].urls;
                  this.uploadList = da.pictureFile[i].urls;
                } else if (d[i].type == 2) {
                  this.payList = da.pictureFile[i].urls;
                } else if (d[i].type == 3) {
                  this.invoiceList = da.pictureFile[i].urls;
                } else if (d[i].type == 4) {
                  this.paybackList = da.pictureFile[i].urls;
                }
              }
              // console.log(this.uploadList)
              // console.log(this.payList)
            } else if (res.data.code == 4001) {
              this.$router.push({path: '/login'});
            }
          }),
          error: function (err) {
            console.log(err);
          },
        })
      },
      modal: function () {
        this.id = '';
        this.tits = '添加审批';
        this.modals1 = true;
        this.modals2 = true;
        this.displays = false;
        this.distinguish = true;
        this.editsave.companyId = '';
        this.editsave.company = '';
        this.editsave.useOfFunds = '0';
        this.editsave.usedDescribe = '';
        this.editsave.tbOrderPrice = '';
        this.editsave.tbOrderNum = '';
        this.editsave.totalPrice = 0;
        this.editsave.opExpectIncreasePlay = 0;
        this.editsave.receiveCompanyName = '';
        this.editsave.receiveAccount = '';
        this.editsave.openAccountBank = '';
        this.editsave.fundsDepartment = '';
        this.editsave.refundAmount = '';
        this.editsave.refundTime = '';
        this.editsave.applyTime = new Date(new Date().getTime());    //申请时间
        // this.editsave.applyTime = '2019-03-15 14:28:00';
        this.editsave.applyState = '';
        this.editsave.leaderApprovalId = '';
        this.editsave.leaderApprovalName = '';
        this.editsave.financeApprovalId = '';
        this.editsave.financeApprovalName = '';
        this.editsave.pictureFile.type = '';
        this.editsave.pictureFile.urls = '';
        this.uploadList = [];
        this.annexshow = true;
        this.saveshow = true;
        this.payshow = false;
        this.invoiceshow = false;
        this.invoiceshows = false;
        this.paybackshow = false;
        this.payshow1 = false;
      },
      pageChange: function (e) {
        this.page = e;
        this.approvalSelect()
      },
      pageSize: function (e) {
        this.limit = e;
        this.page = 1;
      },
      selectcompany: function (e) {
        // console.log(e)
        if (typeof e != 'undefined') {
          // console.log('lk')
          this.editsave.company = e.label;
        } else {
          // console.log('121221121212')
          this.editsave.company = '';
        }
      },
      selectuserfund: function (i) {
        if (i == 0) {
          this.distinguish = true;
          this.editsave.refundAmount = '';
          this.editsave.refundTime = '';
          this.editsave.opExpectIncreasePlay = 0;
        } else {
          this.distinguish = false;
          this.editsave.tbOrderPrice = '';
          this.editsave.tbOrderNum = '';
        }
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
      approvalSelect: function () {
        this.companyId = ((this.companyId == 'undefined' || this.companyId == undefined) ? '' : this.companyId);
        this.useOfFunds = ((this.useOfFunds == 'undefined' || this.useOfFunds == undefined) ? '' : this.useOfFunds);
        this.approvalFinish = ((this.approvalFinish == 'undefined' || this.approvalFinish == undefined) ? '' : this.approvalFinish);
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
        // console.log(this.usedDescribe)
        let ts = encodeURIComponent(this.usedDescribe);
        this.$http({
          method: 'get',
          url: this.url + '/v1/orderApply/findOrderApplyList?page=' + this.page + '&limit=' + this.limit + '&companyId=' + this.companyId + "&useOfFunds=" + this.useOfFunds + "&approvalFinish=" + this.approvalFinish + "&startTime=" + t1 + "&endTime=" + t2 + '&usedDescribe=' + ts,
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
      userfund: function (i) {
        if (i == 0) {
          return '淘宝订单';
        } else if (i == 1) {
          return '运营推广';
        } else {
          return '其他';
        }
      },
      approval: function (i) {
        switch (i) {
          case 1:
            return '未提交';
            break;
          case 2:
            return '已提交';
            break;
          case 10:
            return '领导拒绝';
            break;
          case 11:
            return '领导通过';
            break;
          case 20:
            return '财务拒绝';
            break;
          case 21:
            return '财务通过';
            break;
          case 22:
            return '财务确认打款';
            break;
          case 23:
            return '财务确认发票';
            break;
          case 24:
            return '财务确认收款';
            break;
          default:
            return '其他';
        }
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
      padding-bottom: 8px;
      /*display: inline-block;*/
      .task-li {
        display: inline-block;
      }
      .task-cz-name {
        width: 85px;
        font-size: 12px;
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

  .spxx {
    line-height: 30px;
    font-size: 14px;
    font-weight: bold;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .imgses {
    width: 100%;
  }

  /*.demo-upload-list-cover i{*/
  /*font-size: 10px;*/
  /*}*/
</style>

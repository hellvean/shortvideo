<template>
  <div class="tabs">
    <div class="tabs-top">
      <div class="tabs-top-name">
        审批申请
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
      title="审批"
      :width="1090"
      @on-ok=""
      @on-cancel="">
      <div class="table-task">
        <div class="spxx">基本信息</div>
        <div class="task-cz">
          <div class="task-li">
            <span class="task-cz-name">
            公司名称：
          </span>
            <Input placeholder="公司名称" v-model="editsave.company" style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            用途：
          </span>
            <Input placeholder="用途" v-model="editsave.useOfFunds"  style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            用途说明：
          </span>
            <Input placeholder="用途说明" v-model="editsave.usedDescribe"  style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            用款部门：
          </span>
            <Input placeholder="用款部门" v-model="editsave.fundsDepartment"  style="width: 150px"/>
          </div>
        </div>

        <div class="task-cz">
          <div class="task-li" v-show="!distinguish">
            <span class="task-cz-name">
            预计播放提升：
          </span>
            <Input placeholder="预计播放提升" v-model="editsave.opExpectIncreasePlay"
                   style="width: 150px"/>
          </div>
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name" v-show="distinguish">
            淘宝单价：
          </span>
            <Input placeholder="淘宝单价" v-model="editsave.tbOrderPrice"  style="width: 150px"/>
          </div>
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name">
            淘宝数量：
          </span>
            <Input placeholder="淘宝数量" v-model="editsave.tbOrderNum"  style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            总价：
          </span>
            <Input placeholder="总价" v-model="editsave.totalPrice"  style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            申请时间：
          </span>
            <Input placeholder="总价" v-model="editsave.applyTime" style="width: 150px"/>
          </div>
        </div>


        <div class="spxx">打款信息</div>
        <div class="task-cz">

          <div class="task-li">
            <span class="task-cz-name">
            收款单位：
          </span>
            <Input placeholder="收款单位" v-model="editsave.receiveCompanyName"
                   style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            收款账户：
          </span>
            <Input placeholder="收款账户" v-model="editsave.receiveAccount"  style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            开户银行：
          </span>
            <Input placeholder="开户银行" v-model="editsave.openAccountBank"  style="width: 150px"/>
          </div>
        </div>

        <div class="spxx" v-show="distinguish">回款信息</div>
        <div class="task-cz">
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name">
            预计回款金额：
          </span>
            <Input placeholder="预计回款金额" v-model="editsave.refundAmount"  style="width: 150px"/>
          </div>
          <div class="task-li" v-show="distinguish">
            <span class="task-cz-name">
            预计回款时间：
          </span>
            <Input placeholder="预计回款金额" v-model="editsave.refundTime"  style="width: 150px"/>
          </div>

        </div>

        <div class="spxx">财务附件</div>
        <div class="task-cz">
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

        <Modal title="大图" v-model="visible" >
          <img :src="imgName" v-if="visible"  class="imgssss" :style="{transform:'rotateZ('+this.deg+'deg)'}">
          <div slot="footer">
            <Button type="info" prefix="md-sync" size="large" @click="rotate">旋转90°</Button>
            <!--<Button type="primary" size="large" @click="editsave_ok(2)">提交申请</Button>-->
          </div>
        </Modal>

        <div class="spxx">审批人</div>
        <div class="task-cz">
          <div class="task-li">
            <span class="task-cz-name">
            一级审批人：
          </span>
            <Input placeholder="一级审批人" v-model="editsave.leaderApprovalName"  style="width: 150px"/>
          </div>
          <div class="task-li">
            <span class="task-cz-name">
            二级审批人：
          </span>
            <Input placeholder="二级审批人" v-model="editsave.financeApprovalName"  style="width: 150px"/>
          </div>
        </div>
        <div class="task-cz" style="height: 36px;" v-show="shows">
          <Button type="primary" size="large" style="float: right;margin-right: 20px;" @click="oks(21)">通过</Button>
          <Button type="error" size="large" style="float: right;margin-right: 20px;" @click="oks(20)">拒绝</Button>
        </div>

        <div class="spxx" v-show="payshow">财务打款凭证</div>
        <div class="task-cz" v-show="payshow">
          <div class="demo-upload-list" v-for="(item,index) in payList">
            <img :src="item" v-if="its(item) == '1'">
            <img src="http://javastore.oss-cn-hangzhou.aliyuncs.com/bug/img1553564542066.png" v-else>
            <div class="demo-upload-list-cover" v-if="its(item) == '1'">
              <Icon type="ios-eye-outline" @click.native="handleView(item)" style="font-size: 10px;"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(index)" style="font-size: 10px;"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)" style="font-size: 10px;"></Icon>
            </div>
            <div class="demo-upload-list-cover" v-else>
              <!--<Icon type="ios-eye-outline" @click.native="handleView(item)" style="font-size: 10px;"></Icon>-->
              <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
          </div>
          <Upload
            ref="upload"
            :before-upload="progresss"
            :show-upload-list="false"
            :max-size="102400"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
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
        <div class="task-cz" style="height: 36px;" v-show="payshow">
          <Button type="success" size="large" style="float: right;margin-right: 20px;" @click="payoks(0)">确认打款</Button>
          <Button type="info" size="large" style="float: right;margin-right: 20px;" @click="payoks(1)">保存</Button>
        </div>

        <div class="spxx" v-show="payshows" style="padding-top: 10px;border-top: 1px solid #ccc">财务打款凭证</div>
        <div class="task-cz" v-show="payshows">
          <div class="demo-upload-list" v-for="(item,index) in payList">
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

        <div class="spxx" v-show="invoiceshow" style="padding-top: 10px;border-top: 1px solid #ccc">发票信息</div>
        <div class="task-cz" v-show="invoiceshow">
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

        <div class="task-cz" style="height: 36px;" v-show="invoiceshows">
          <Button type="info" size="large" style="float: right;margin-right: 20px;" @click="invoice_okss">确认发票</Button>
        </div>



        <div class="spxx" v-show="paybackshow" style="padding-top: 10px;border-top: 1px solid #ccc">回款信息</div>
        <div class="task-cz" v-show="paybackshow">
          <div class="demo-upload-list" v-for="(item,index) in paybackList">
            <img :src="item" v-if="its(item) == '1'">
            <img src="http://javastore.oss-cn-hangzhou.aliyuncs.com/bug/img1553564542066.png" v-else>
            <div class="demo-upload-list-cover" v-if="its(item) == '1'">
              <Icon type="ios-eye-outline" @click.native="handleView(item)" style="font-size: 10px;"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove1(index)" style="font-size: 10px;"></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)" style="font-size: 10px;"></Icon>
            </div>
            <div class="demo-upload-list-cover" v-else>
              <!--<Icon type="ios-eye-outline" @click.native="handleView(item)" style="font-size: 10px;"></Icon>-->
              <Icon type="ios-trash-outline" @click.native="handleRemove1(index)" ></Icon>
              <Icon type="ios-cloud-download" @click.native="download(item)"></Icon>
            </div>
          </div>
          <Upload
            ref="upload"
            :before-upload="progresss"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess1"
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
        <div class="task-cz" v-show="paybackshow">
          <div class="task-li">
            <span class="task-cz-name">
            回款金额：
          </span>
            <Input placeholder="预计回款金额" v-model="actualAmountReceive" style="width: 150px"/>
          </div>
        </div>


        <div class="task-cz" style="height: 36px;" v-show="paybackshow">
          <Button type="success" size="large" style="float: right;margin-right: 20px;" @click="payback_oks(0)">确认收款</Button>
          <Button type="info" size="large" style="float: right;margin-right: 20px;" @click="payback_oks(1)">保存</Button>
        </div>

        <div class="spxx" v-show="paybackshows" style="padding-top: 10px;border-top: 1px solid #ccc">回款信息</div>
        <div class="task-cz" v-show="paybackshows">
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

        <div class="task-cz" v-show="paybackshows">
          <div class="task-li">
            <span class="task-cz-name">
            实际回款金额：
          </span>
            <Input placeholder="实际回款金额" v-model="actualAmountReceive" style="width: 150px"/>
          </div>
        </div>

      </div>

      <div slot="footer">
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

    <Modal v-model="modal13"
           title="审批"
           @on-ok="ok"
           @on-cancel="cancel">
      <div>确认操作？</div>
    </Modal>

    <Modal v-model="modal14"
           title="审批"
           @on-ok="payok"
           @on-cancel="cancels">
      <div>确认操作？</div>
    </Modal>

    <Modal v-model="modal15"
           title="审批"
           @on-ok="invoice_ok"
           @on-cancel="cancelss">
      <div>确认操作？</div>
    </Modal>

    <Modal v-model="modal16"
           title="审批"
           @on-ok="payback_ok"
           @on-cancel="cancelsss">
      <div>确认操作？</div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        paybackid:'',
        modal16:false,
        modal15:false,
        modal14:false,
        payid:'',
        icons:'',
        modal13:false,
        companyId: '',
        startTime: '',
        endTime: '',
        useOfFunds: '',
        usedDescribe:'',
        approvalFinish: '0',
        modals1:false,
        tots: 0,
        page: 1,
        sizes: [10, 20, 30, 50, 80, 100],
        limit: 10,
        pages: 1,
        tures: false,
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
            title:'预计回款时间',
            align:'center',
            key:'refundTime'
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
        visible: false,
        data:[],
        distinguish: true, //淘宝订单还是运营订单
        defaultList:[],
        editsave: {
          companyId: '',
          company: '',
          useOfFunds: '0',
          usedDescribe: '',
          tbOrderPrice: '',
          tbOrderNum: '',
          totalPrice: '',
          opExpectIncreasePlay: '',
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
        uploadList:[],
        action:this.url+'/v1/file/upload',
        headers:{'token': sessionStorage.getItem('HT_token')},
        id:'',
        imgName:'',
        shows:true,
        payshow:false,
        payList:[],
        paysave:{
          type:'2',
          urls:[]
        },
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
        payshows:false,
        invoiceList:[],
        invoiceshow:false,
        invoiceshows:false,

        paybackshow:false, //展示回款包括上传
        paybackshows:false, //展示回款图片
        paybackList:[], //回款图片
        paybacksave:{
          type:4,
          urls:[],
          actualAmountReceive:'',
        },
        companyList:[],
        history:[],
        historymodel:false,
        actualAmountReceive:'',
        deg:0,
      }
    },
    created() {

    },
    mounted:function(){
      this.endTime = new Date(new Date().getTime()+24 * 60 * 60 * 1000);
      this.startTime = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
      this.companylist();
      this.approvalSelect()
    },
    methods: {
      progresss:function(e){
        console.log(e)
        this.$Notice.info({
          title: '提示',
          desc: '正在上传'
        });
      },
      its:function(i){
        if (!/\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(i)) {
          return 0;
        }else{
          return 1;
        }
      },
      download:function(i){
        var alink = document.createElement("a");
        alink.href = i;
        alink.download = "pic"; //图片名
        alink.click();
      },
      payback_oks:function(i){
        this.paybackid = i;
        this.modal16 = true;
      },
      cancelsss:function(){
        this.modal16 = false;
      },
      invoice_okss:function(){
        this.modal15 = true;
      },
      cancel:function(){
        this.modal13 = false;
      },
      cancelss:function(){
        this.modal15 = false;
      },
      oks:function(i){
        this.icons = i;
        this.modal13 = true;
      },
      approvalHislist:function(i){
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
              for(let i =0;i<da.length;i++){
                let str={};
                str.name = da[i].approvalName;
                str.time = this.timeStamp(da[i].approvalTime/1000)
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
      payback_ok:function(){

        if(this.paybackList.length == 0){
          this.$Notice.warning({
            title: '提示',
            desc: '请上传回款'
          });
          return false;
        }
        if(this.paybackid == 0){   //确认收款
          this.$http({
            method: 'put',
            url: this.url + '/v1/orderApply/updateOrderApplyState/'+this.id+'/24',
            success: ((res) => {
              // console.log(res)
              if (res.data.code == 20000) {
                this.$Message.success('确认收款成功');
                this.paybackshows = true;
                this.paybackshow = false;
                // this.payshow = false;
                // this.payshows = true;
              }else if (res.data.code == 4001) {
                this.$router.push({path: '/login'});
              } else if(res.data.code == 2004){
                this.$Message.warning('请先保存打款凭证然后在确认打款');
              } else{
                this.$Message.warning(res.data.msg);
              }
            }),
            error: function (err) {
              console.log(err);
            }
          })
        }else{     //保存
          if(this.actualAmountReceive == ''){
            this.$Notice.warning({
              title: '提示',
              desc: '请输入实际回款金额'
            });
            return false;
          }
          this.paybacksave.urls = this.paybackList;
          this.paybacksave.actualAmountReceive = this.actualAmountReceive;
          this.$http({
            method: 'put',
            url: this.url + '/v1/pictureFile/updatePictureFile/'+this.id,
            data:this.paybacksave,
            success: ((res) => {
              // console.log(res)
              if (res.data.code == 20000) {
                this.$Message.success('回款保存成功');
              }else if (res.data.code == 4001) {
                this.$router.push({path: '/login'});
              } else {
                this.$Message.warning(res.data.msg);
              }
            }),
            error: function (err) {
              console.log(err);
            }
          })
        }
      },
      invoice_ok:function(){
        if(this.invoiceList.length == 0){
          this.$Notice.warning({
            title: '提示',
            desc: '请上传发票'
          });
          return false;
        }
        this.$http({
          method: 'put',
          url: this.url + '/v1/orderApply/updateOrderApplyState/'+this.id+'/23',
          success: ((res) => {
            // console.log(res)
            if (res.data.code == 20000) {
              this.$Message.success('确认发票成功');
              this.invoiceshows = false;
              this.paybackshow = true;
            }else if (res.data.code == 4001) {
              this.$router.push({path: '/login'});
            } else if(res.data.code == 2004){
              this.$Message.warning('请申请人先保存上传发票然后在确认发票');
            } else{
              this.$Message.warning(res.data.msg);
            }
          }),
          error: function (err) {
            console.log(err);
          }
        })
      },
      payoks:function(i){
        this.payid = i;
        this.modal14 = true;
      },
      cancels:function(){
        this.modal14 = false;
      },
      payok:function(){
        if(this.payid ==0){   //确认打款
          if(this.payList.length == 0){
            this.$Notice.warning({
              title: '提示',
              desc: '请上传打款凭证'
            });
            return false;
          }
          this.$http({
            method: 'put',
            url: this.url + '/v1/orderApply/updateOrderApplyState/'+this.id+'/22',
            success: ((res) => {
              // console.log(res)
              if (res.data.code == 20000) {
                this.$Message.success('确认打款成功');
                this.payshow = false;
                this.payshows = true;
              }else if (res.data.code == 4001) {
                this.$router.push({path: '/login'});
              } else if(res.data.code == 2004){
                this.$Message.warning('请先保存打款凭证然后在确认打款');
              } else{
                this.$Message.warning(res.data.msg);
              }
            }),
            error: function (err) {
              console.log(err);
            }
          })
        }else{      //保存
          if(this.payList.length == 0){
            this.$Notice.warning({
              title: '提示',
              desc: '请上传打款凭证'
            });
            return false;
          }
          this.paysave.urls = this.payList;
          // console.log(this.payList)
          this.$http({
            method: 'put',
            url: this.url + '/v1/pictureFile/updatePictureFile/'+this.id,
            data:this.paysave,
            success: ((res) => {
              // console.log(res)
              if (res.data.code == 20000) {
                  this.$Message.success('打款凭证保存成功');
              }else if (res.data.code == 4001) {
                this.$router.push({path: '/login'});
              } else {
                this.$Message.warning(res.data.msg);
              }
            }),
            error: function (err) {
              console.log(err);
            }
          })
        }
      },
      handleSuccess (res, file) {
        this.$Message.info('上传完成');
        this.payList.push(res.data)
      },
      handleSuccess1 (res, file) {
        this.$Message.info('上传完成');
        this.paybackList.push(res.data)
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '图片格式不对',
          desc: "只能上传png,jpg,jpeg格式的图片"
        });
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
      rotate:function(){
        this.deg+=90;
      },
      handleView (name) {
        this.deg = 0;
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (i) {   //删除财务附件
        this.payList.splice(i,1)
      },
      handleRemove1 (i) {   //删除回款
        this.paybackList.splice(i,1)
      },
      edit: function (i,j) {
        this.tits = '修改审批';
        this.modals1 = true;
        // this.modals2 = false;
        // console.log(i)
        this.id = i;
        if(j == 1){
          this.displays = false;
        }else{
          this.displays = true;
        }
        this.$http({
          method: 'get',
          url: this.url + '/v1/orderApply/findOrderApplyById/'+i,
          data: this.editsave,
          success: ((res) => {
            // console.log(res)
            if(res.data.code == 20000){
              // console.log(this.valueSaveEdit)
              let da = res.data.data;
              // if(da.applyState == 24){
              //   this.payshow = true;
              //   this.invoiceshow = true;
              //   this.paybackshow = true;
              // }else if(da.applyState == 23){
              //   this.payshow = true;
              //   this.invoiceshow = true;
              // }else if(da.applyState == 22 && da.useOfFunds ==0){
              //   console.log('yxl')
              //   this.payshow = true;  //淘宝-要上传打款凭证
              // }else if(da.applyState == 22 && da.useOfFunds ==1){
              //   this.payshow1 = true; //运营-要上传打款凭证
              // }else{
              //   this.payshow = false;
              //   this.invoiceshow = false;
              //   this.paybackshow = false;
              //   this.payshow1 = false;
              // }
              this.uploadList=[];
              this.payList=[];
              this.invoiceList=[];
              this.paybackList=[];
              this.editsave.companyId = da.companyId;
              this.editsave.company = da.company;
              if(da.useOfFunds == 0){
                this.distinguish = true;
              }else{
                this.distinguish = false;
              }

              if(da.applyState == 24){
                this.paybackshows = true;
                this.paybackshow = false;
                this.invoiceshow = true;
                this.invoiceshows = false;
                this.payshows = true;
                this.payshow = false;
                this.shows = false;
              }else if(da.applyState == 23){
                this.paybackshows = false;
                this.paybackshow = true;
                this.invoiceshow = true;
                this.invoiceshows = false;
                this.payshows = true;
                this.payshow = false;
                this.shows = false;
              }else if(da.applyState == 22 && da.useOfFunds ==0){  //淘宝-已经打款
                this.paybackshows = false;
                this.paybackshow = false;
                this.invoiceshow = true;
                this.invoiceshows = true;
                this.payshows = true;
                this.payshow = false;
                this.shows = false;
              }else if(da.applyState == 22 && da.useOfFunds ==1){//运营-已经打款
                this.paybackshows = false;
                this.paybackshow = false;
                this.invoiceshow = false;
                this.invoiceshows = false;
                this.payshows = true;
                this.payshow = false;
                this.shows = false;
              }else if(da.applyState == 21){
                this.paybackshows = false;
                this.paybackshow = false;
                this.invoiceshow = false;
                this.invoiceshows = false;
                this.payshows = false;
                this.payshow = true;
                this.shows = false;
              }else if(da.applyState == 11){
                this.paybackshows = false;
                this.paybackshow = false;
                this.invoiceshow = false;
                this.invoiceshows = false;
                this.payshows = false;
                this.payshow = false;
                this.shows = true;
              }else{
                this.paybackshows = false;
                this.paybackshow = false;
                this.invoiceshow = false;
                this.invoiceshows = false;
                this.payshows = false;
                this.payshow = false;
                this.shows = false;
              }

              this.editsave.useOfFunds = this.userfund(da.useOfFunds);
              this.editsave.usedDescribe = da.usedDescribe;
              this.editsave.tbOrderPrice = da.tbOrderPrice;
              this.editsave.tbOrderNum = da.tbOrderNum;
              this.editsave.totalPrice = da.totalPrice;
              this.editsave.opExpectIncreasePlay=da.opExpectIncreasePlay;
              this.editsave.receiveCompanyName=da.receiveCompanyName;
              this.editsave.receiveAccount=da.receiveAccount;
              this.editsave.openAccountBank=da.openAccountBank;
              this.editsave.fundsDepartment=da.fundsDepartment;
              this.editsave.refundAmount=da.refundAmount;
              this.editsave.refundTime=da.refundTime;
              this.editsave.applyTime=da.applyTime;
              this.editsave.applyState =da.applyState;
              this.editsave.leaderApprovalId=da.leaderApprovalId;
              this.editsave.leaderApprovalName=da.leaderApprovalName;
              this.editsave.financeApprovalId=da.financeApprovalId;
              this.editsave.financeApprovalName=da.financeApprovalName;
              this.actualAmountReceive = da.actualAmountReceive;
              let d = da.pictureFile;
              // console.log(d)
              for(let i in d){
                if(d[i].type == 1){
                  // console.log(d[i])
                  // this.editsave.pictureFile.type=da.pictureFile[i].type;
                  // this.editsave.pictureFile.urls=da.pictureFile[i].urls;
                  this.uploadList = da.pictureFile[i].urls;
                }else if(d[i].type == 2){
                  this.payList = da.pictureFile[i].urls;
                }else if(d[i].type == 3){
                  this.invoiceList = da.pictureFile[i].urls;
                }else if(d[i].type == 4){
                  this.paybackList = da.pictureFile[i].urls;
                }
              }
              // console.log(this.uploadList)
            }else if(res.data.code == 4001){
              this.$router.push({path: '/login'});
              // this.bj = false;
            }
          }),
          error: function (err) {
            console.log(err);
          },
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
        let ts = encodeURIComponent(this.usedDescribe);
        this.$http({
          method: 'get',
          url: this.url + '/v1/orderApply/findOrderApplyList?page=' + this.page + '&limit=' + this.limit+'&companyId='+this.companyId+"&useOfFunds="+this.useOfFunds+"&approvalFinish="+this.approvalFinish+"&startTime="+t1+"&endTime="+t2+'&usedDescribe='+ts,
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
        this.approvalSelect()
      },
      pageSize: function (e) {
        this.limit = e;
        this.page = 1;
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
      ok:function () {
        this.modal13 = false;
        this.modals1 = false;
        this.$http({
          method: 'put',
          url: this.url + '/v1/orderApply/updateOrderApproval/'+this.id+'/'+this.icons,
          success: ((res) => {
            // console.log(res)
            if (res.data.code == 20000) {
              if(this.icons == 20){
                this.$Message.success('拒绝请求成功');
              }else{
                this.$Message.success('通过请求成功');
                this.payshow = true;
                this.shows = false;
              }
              this.approvalSelect();
            }else if (res.data.code == 4001) {
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
      approval:function (i) {
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
      margin-bottom: 8px;
      /*display: inline-block;*/
      .task-li {
        display: inline-block;
      }
      .task-cz-name {
        font-size: 12px;
        width: 85px;
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
  .imgssss{
    width: 100%;
  }
  /*.demo-upload-list-cover i{*/
    /*font-size: 10px;*/
  /*}*/
</style>

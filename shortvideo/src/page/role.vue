<template>
  <div class="role">
        <div class="tabs-top">
        <div class="tabs-top-name">
          角色管理
        </div>
        <div class="tabs-top-addTask">
          <Button type="info" @click="addjs">添加角色</Button>
        </div>
      </div>
    <div class="yingying" v-if="threeshow"></div>
    <div class="openthree" v-if="threeshow">
      <div class="threeover">
       <Tree :data="data2" show-checkbox></Tree>
      </div>
    <Icon type="md-close" class="mdclose" @click="closethree"/>
    <div class="button">
      <Button type="primary" class="qdthree" @click="qdthree">确定</Button>
      <Button class="qxthree" @click="qxthree">取消</Button>
    </div>
    </div>
      <div class="yingying" v-show="typeshow"></div>
      <div class="openthree" v-show="typeshow">
        <div class="threeover">
        <Tree :data="data2_type" show-checkbox></Tree>
        </div>
      <Icon type="md-close" class="mdclose" @click="closethree_type"/>
      <div class="button">
        <Button type="primary" class="qdthree" @click="qdthree_type">确定</Button>
        <Button class="qxthree" @click="qxthree_type">取消</Button>
      </div>
      </div>

       <Modal
      v-model="modal1"
      :title="tits"
      @on-ok=""
      >
      <div class="table-task">
        <div class="task-cz">
          <span class="task-cz-name">
            角色名称：
          </span>
          <Input placeholder="请输入角色名称" style="width: auto" v-model.trim="jsname"/>
        </div>
        <div class="task-cz">
          <span class="task-cz-name">
            角色编码：
          </span>
          <Input placeholder="请输入角色编码" style="width: auto" v-model.trim="jscode"/>
        </div>
      </div>
        <div slot="footer">
        <Button type="text" size="large"  @click="cancel">取消</Button>
        <Button type="primary" size="large"  @click="okjs">确定</Button>
      </div>
    </Modal>

    <Modal
        :title="Title"
        v-model="modal" 
         @on-ok="ok"
        :mask-closable="false">
        <p>{{tip}}</p>
    </Modal>
    <div class="hang">
        <span class="qdName">角色名称：</span>
        <Input v-model="roleName" placeholder="请输入角色名称" class="qdselect"/>
        <span class="qdName">角色编码：</span>
        <Input v-model="roleCode" placeholder="请输入角色编码" class="qdselect" />
        <Button type="primary" class="subtj" @click="subtj">查询</Button>
    </div>
    <div class="table">
      <Table stripe :columns="columns1" :data="data1"></Table>
    </div>
    <div class="pagediv">
        <Page :total="zongcount" :page-size="optsarr[0]" show-elevator show-total show-sizer :page-size-opts='optsarr' @on-change="changepage" @on-page-size-change="pagesizechange"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'role',
  data () {
    return {
      disab:false,
      typeshow:false,
      updateleixname:'',
      updatalelxid:'',

      optsarr:[10,20,30,50,80,100],
      parms:'',//点击权限那一行的数据
      pageIdList:'',//权限选中的id
      threeshow:false,
      deleteid:'',
      tip:'确认删除吗',
      Title:'提示',
      modal: false,
      modal1:false,
      tits:'创建角色',
      jsname:'',
      jscode:'',
      token:'',
      zongcount:1,
      page:1,
      limit:0,
      roleName:'',
      roleCode:'',
      columns1: [
                    {
                        title: 'ID',
                        align:'center',
                        key: 'id'
                    },
                    {
                        title: '角色名称',
                        align:'center',
                        key: 'username'
                    },
                    {
                        title: '角色编码',
                        align:'center',
                        key: 'code'
                    },
                    {
                        title: '创建时间',
                        align:'center',
                        key: 'addtime'
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
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params)
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                     style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.qxset(params)
                                        }
                                    }
                                }, '权限设置'),
                                // h('Button', {
                                //     props: {
                                //         type: 'warning',
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.typeleix(params)
                                //         }
                                //     }
                                // }, '类型')
                            ]);
                        }
                    }
                ],
                data1: [],
                data2: [
                    {
                        title: '菜单列表',
                        expand: true,
                        children: []
                    }
                ],
                data2_type:[
                      {
                                title: '任务类型',
                                expand: true,
                                checked:false,
                                children: []
                            },
                ]
    }
  },
  created:function(){
    this.limit=(this.optsarr)[0];
     this.token = sessionStorage.getItem('HT_token');
     this.listdom();
    // this.menulist();
    //  this.typelxlist();
  },
  methods:{
    closethree_type:function(){
      this.typeshow=false;
    },
    qdthree_type:function(){
       var _this=this;
       var taskTypeIdList=[];
       var arr=((_this.data2_type)[0].children);
       for(var i=0;i<arr.length;i++){
           if(arr[i].checked){
             taskTypeIdList.push(arr[i].id);
           }
       }
       this.$http({
         method:'put',
         url:_this.url+'/v1/role/updateRoleType/'+this.updatalelxid,
         data:{
           roleName:_this.updateleixname,
           taskTypeIdList:taskTypeIdList
         },
         success:function(response){
                if(response.data.code==20000){
                   _this.$Message.success('修改成功!');
                   _this.typeshow=false;
                }else if(response.data.code==4001){
                     _this.$router.push({path:'/login'});
                }else{
                     _this.$Message.warning(response.data.msg);
                     _this.typeshow=false;
                  }
         },
         error:function(err){
            console.log(err);
         },
     })
    },
    qxthree_type:function(){
      this.typeshow=false;
    },
    typelxlist:function(){
     var _this=this;
       this.$http({
         method:'get',
         url:_this.url+'/v1/taskType/findTaskTypeSel',
         data:{},
         success:function(response){
                if(response.data.code==20000){
                    var d=response.data.data;
                    for(var i=0;i<d.length;i++){
                      var obj={};
                      obj.title=d[i].name;
                      obj.id=d[i].id;
                      obj.checked=false;
                      ((_this.data2_type)[0].children).push(obj);
                    }
                }else if(response.data.code==4001){
                     _this.$router.push({path:'/login'});
                }else{
                     _this.$Message.warning(response.data.msg);
                  }
         },
         error:function(err){
            console.log(err);
         },
     })
    },
    typeleix:function(params){
       this.updateleixname=params.row.username;
       this.updatalelxid=params.row.id;
       var _this=this;
       (_this.data2_type)[0].checked=false;
       for(var k=0;k<(_this.data2_type)[0].children.length;k++){
              ((_this.data2_type)[0].children)[k].checked=false;
        }
       this.$http({
         method:'get',
         url:_this.url+'/v1/role/findRoleType/'+this.updatalelxid,
         data:{},
         success:function(response){
                if(response.data.code==20000){
                  var d=response.data.data.taskTypeIdList;
                  if(d.length>0){
                   for(var j=0;j<d.length;j++){
                      for(var i=0;i<(_this.data2_type)[0].children.length;i++){
                          if(d[j]==((_this.data2_type)[0].children)[i].id){
                            ((_this.data2_type)[0].children)[i].checked=true;
                            break;
                          }
                      }
                   }
                  }
                   _this.typeshow=true;
                }else if(response.data.code==4001){
                     _this.$router.push({path:'/login'});
                }else{
                     _this.$Message.warning(response.data.msg);
                  }
         },
         error:function(err){
            console.log(err);
         },
     })
    },
    searchjs:function(id){
      var _this=this;
      this.$http({
         method:'get',
         url:_this.url+'/v1/role/findRole/'+id,
         data:{},
         success:function(response){
                if(response.data.code==20000){
                   _this.pageIdList=response.data.data.pageIdList;
                   //选中菜单
                   _this.select();
                }else if(response.data.code==4001){
                     _this.$router.push({path:'/login'});
                }else{
                     _this.$Message.warning(response.data.msg);
                  }
         },
         error:function(err){
            console.log(err);
         },
     })
    },
    select:function(){
      var warlist=(this.data2)[0].children;
      var LIST=this.pageIdList;
       for(var v=0;v<warlist.length;v++){
         warlist[v].checked=false;
         if(warlist[v].children.length>0){
            var clist=warlist[v].children;
            for(var w=0;w<clist.length;w++){
              clist[w].checked=false;
            }
         }
       }
       
      for(var i=0;i<warlist.length;i++){
          if(warlist[i].children.length>0){
            var clist=warlist[i].children;
            var arr3=[];//判断父菜单的子菜单是否全部勾上
             for(var j=0;j<clist.length;j++){
                var id=clist[j].id;
                for(var k=0;k<LIST.length;k++){
                   if(LIST[k]==id){
                     clist[j].checked=true;
                     arr3.push(LIST[k]);
                     break;
                   }
                }
             }
             if(arr3.length==clist.length){
               for(var q=0;q<LIST.length;q++){
                   if(LIST[q]==warlist[i].id){
                     warlist[i].checked=true;
                     break;
                   }
                }
             }
          }
      }
     this.threeshow=true;
    },
    qxthree:function(){
      this.threeshow=false;
    },
    //修改权限
    qdthree:function(){
      var _this=this;
      this.threeshow=false;
      var jsId=this.parms.row.id;
      var name=this.parms.row.username;
      var data=(this.data2)[0];
      var wlist=data.children;
      var arr=[];
      for(var i=0;i<wlist.length;i++){
           //arr.push(wlist[i].id);
           if(wlist[i].children.length>0){
                var nlist=wlist[i].children;
                var arr2=[];//判断子菜单是否有勾上  有的话 父菜单也要勾上
                for(var j=0;j<nlist.length;j++){
                     if(nlist[j].checked){
                       arr.push(nlist[j].id);
                       arr2.push(nlist[j].id);
                     }
                }
                if(arr2.length>0){
                  arr.push(wlist[i].id);
                }
           }
      }
       this.$http({
         method:'put',
         url:_this.url+'/v1/role/updateRolePage/'+jsId,
         data:{"roleName":name,'pageIdList':arr},
         success:function(response){
                if(response.data.code==20000){
                       _this.$Message.warning('修改成功');
                }else if(response.data.code==4001){
                     _this.$router.push({path:'/login'});
                }else{
                       _this.$Message.warning(response.data.msg);
                  }
         },
         error:function(err){
            console.log(err);
         },
     })
    },
    //权限
    qxset:function(parms){
      this.parms=parms;
      var id=parms.row.id;
      //查询角色
    this.menulist(id);
    },
    closethree:function(){
      this.threeshow=false;
    },
    menulist:function(_id){
    //  (this.data2)[0].children=[];
      (this.data2)=[];
      (this.data2).push(  {
                        title: '菜单列表',
                        expand: true,
                        children: []
                    });   
      var _this=this;
       this.$http({
         method:'get',
         url:_this.url+'/v1/pageFunction/findPageTree',
         data:{},
         success:function(response){
                if(response.data.code==20000){
                   if(response.data.data.children.length>0){
                     var d=response.data.data.children;
                     for(var i=0;i<d.length;i++){
                       var obj={};
                       obj.title=d[i].name;
                       obj.id=d[i].id;
                       obj.expand=true;
                       obj.checked=false;
                       obj.children=[];
                       if(d[i].children.length>0){
                           for(var j=0;j<d[i].children.length;j++){
                              var c_obj={};
                              c_obj.title=(d[i].children)[j].name;
                              c_obj.id=(d[i].children)[j].id;
                              c_obj.checked=false;
                              (obj.children).push(c_obj);
                           }
                       }
                       ((_this.data2)[0].children).push(obj);
                     }
                   }
                   _this.searchjs(_id);
                }else if(response.data.code==4001){
                     _this.$router.push({path:'/login'});
                }else{
                       _this.$Message.warning(response.data.msg);
                  }
         },
         error:function(err){
            console.log(err);
         },
     })
    },
    addjs:function(){
      this.modal1=true;
      this.disab=false;
    },
    cancel:function(){
       this.modal1=false;
    },
    okjs:function(){
      if(this.jsname=='' || this.jscode==''){
        this.$Message.success('请填写完整');
        return false
      }
      var _this=this;
      if(this.disab){
        return false;
      }
      this.disab=true;
      this.modal1=false;
       this.$http({
         method:'post',
         url:_this.url+'/v1/role/saveRole',
         data:{roleName:this.jsname,roleCode:this.jscode},
         success:function(response){
                if(response.data.code==20000){
                  _this.$Message.success('保存成功！');
                  _this.page=1;
                  _this.listdom();
                  
                }else if(response.data.code==4001){
                     _this.$router.push({path:'/login'});
                }else{
                       _this.$Message.warning(response.data.msg);
                  }
         },
         error:function(err){
            console.log(err);
         },
     })
    },
    remove:function(parms){
      this.deleteid=parms.row.id;
       var _this=this;
       this.modal=true;
    },
    ok:function(){
       var _this=this;
       this.$http({
         method:'put',
         url:_this.url+'/v1/role/updateRoleState/'+this.deleteid+'/0',
         data:{},
         success:function(response){
                if(response.data.code==20000){
                   _this.page=1;
                   _this.listdom();
                  }else if(response.data.code==4001){
                          _this.$router.push({path:'/login'});
                  }else{
                       _this.$Message.warning(response.data.msg);
                  }
         },
         error:function(err){
              _this.$Message.warning('删除失败');
         },
     })
    },
    subtj:function(){
      this.listdom();
    },
    changepage:function(v){
      this.page=v;
      this.listdom();
    },
    pagesizechange:function(v){
        this.limit=v;
        this.page=1;
        this.listdom();
      },
    listdom:function(){
      var _this=this;
       this.$http({
         method:'get',
         url:_this.url+'/v1/role/findRoleList?page='+this.page+'&limit='+this.limit+'&roleName='+this.roleName+'&roleCode='+this.roleCode,
         data:{},
         success:function(response){
               if(response.data.code==20000){
                  _this.zongcount=response.data.count;
                  _this.dom(response.data.data);
                }else if(response.data.code==20003){
                  _this.data1=[];
                }else if(response.data.code==4001){
                        _this.$router.push({path:'/login'});
                }else{
                     _this.$Message.warning(response.data.msg);
                }
         },
         error:function(err){
             console.log(err);
         },
     })
    },
    timestampToTime:function(timestamp){
       var date = new Date(timestamp);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
    },
   dom:function(data){
     this.data1=[];
    for(var i=0;i<data.length;i++){
      var obj={};
      if(typeof data[i].id!='undefined'){
          obj.id=data[i].id;
      }else{
        obj.id='';
      }
      if(typeof data[i].roleCode!='undefined'){
        obj.code=data[i].roleCode;
      }else{
        obj.code='';
      }
      if(typeof data[i].roleName!='undefined'){
        obj.username=data[i].roleName;
      }else{
        obj.username='';
      }
      
       if(typeof data[i].addtime!='undefined'){
        obj.addtime=this.timestampToTime(data[i].addtime);
      }else{
        obj.addtime='';
      }
      (this.data1).push(obj);
    }
    
   },
 },
  computed:{

	},
}
</script>
<style scoped lang='less'>
.addjs{
  margin:30px 0 0 30px;
}
.table{
  margin-top:30px;
}
.hang{
  overflow:hidden;
  margin-top:30px;
  .qdName{
    display:block;
    float:left;
    line-height:30px;
    width:100px;
    text-align:right;
    letter-spacing:2px;
  }
  .qdselect,.start{
    display:block;
    float:left;
    width:200px;
    margin-right:30px;
  }
}
.subtj{
  display:block;
  float:left;
}
.pagediv{
  margin:30px 0 0 30px;
}
  .table-task{
    .task-cz{
      margin-bottom: 8px;
      .task-cz-name{
        width: 100px;
        text-align: right;
        display: inline-block;
      }
    }
  }
.yingying{
  position:fixed;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,.5);
  z-index:3;
}
.openthree{
  background:#ffffff;
  position:fixed;
  left:50%;
  top:50%;
  z-index:5;
  height:450px;
  width:400px;
  padding:30px 30px 70px 30px;
  margin-top:-225px;
  margin-left:-200px;
  .threeover{
  height:350px;
  width:340px;
 overflow:auto;
  }
}
.mdclose{
  position:absolute;
  right:10px;
  top:10px;
  font-size:24px;
  cursor: pointer;
}
.button{
  width:400px;
  height:40px;
  position:absolute;
  left:0;
  bottom:0;
  background: #ffffff!important;
  border-top:solid 1px #dddddd;
  border-bottom:none;
.qdthree{
  float:right;
  margin-right:10px;
  margin-top:2px;
}
.qxthree{
  float:right;
  margin-right:10px;
  margin-top:2px;
}
}
.role{
  padding:10px;
}
  .tabs-top {
      width: 100%;
      height: 50px;
      border-bottom:solid 1px #cccccc;
      line-height:40px;
      padding-bottom:10px;
      .tabs-top-name {
        font-size: 18px;
        float: left;
      }
      .tabs-top-addTask {
        float: right;
      }
    }
</style>

<template>
  <div class="home">
    <div class="fixtop">
      <div class="top_left">
        <!--<span class="toprq">2018年11月15日 星期四</span>
        <span class="typetitle">咪咕阅读中心</span>-->
      </div>
      <div class="top_right">
        <span class="top_renyuan">您好：开发人员，欢迎你登录运营后台!</span>
        <a href="#" class="top_zx" @click="out">退出</a>
      </div>
    </div>
    <div class="mian">
      <div class="mian_left">
        <div class="menulist">
          <Row>
            <Col span="24">
              <Menu ref="side_menu" :theme="theme2" :open-names="namearr" :active-name="keys">
                <cpamenu v-for="(item,index) in menu" :data="item"></cpamenu>
              </Menu>
            </Col>
          </Row>
        </div>
      </div>
      <div class="mian_right">
        <!--<transition mode="out-in" enter-active-class="animated rollIn" leave-active-class="animated rollOut">-->
        <router-view></router-view>
        <!--
                <keep-alive>
                    <router-view v-if="$route.meta.isKeepAlive"></router-view>
                </keep-alive>

        <router-view v-if="!$route.meta.isKeepAlive"></router-view>
        -->
        <!--</transition>-->
      </div>
    </div>
  </div>
</template>
<script>
  import cpamenu from '@/components/cpamenu'
  import {setTimeout} from 'timers';

  export default {
    name: 'home',
    data() {
      return {
        theme2: 'dark',
        menu: '',//侧边栏菜单
        namearr: [],
        keys: ''
      }
    },
    mounted: function () {
      let url = window.location.href;
      let index = url.lastIndexOf("\/");
      this.keys = url.substring(index, url.length);
      var _this = this;
      this.$http({
        method: 'get',
        url: _this.url + '/v1/pageFunction/getMenuListByUser',
        data: {},
        success: function (response) {
          // console.log(response.data.data)
          if (response.data.code == 20000) {
            if (response.data.data.length > 0) {
              _this.menulist(response.data.data);
            }
          } else if (response.data.code == 4001) {
            _this.$router.push({path: '/login'});
          } else {
            _this.$Message.warning(response.data.message);
          }
        },
        error: function (err) {
          console.log(err);
        },
      })
    },
    components: { // 定义组件
      cpamenu: cpamenu,
    },
    methods: {
      out: function () {
        sessionStorage.removeItem('HT_token');
        this.$router.push({path: '/login'});
      },
      sortBy: function (field) {
        return function (a, b) {
          return a[field] - b[field];
        }
      },
      menulist: function (data) {
        this.namearr.length = 0;
        var namearr = [];
        var list = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].parentId == 0) {
            var obj = data[i];
            obj.index = 'name' + i;
            obj.children = [];
            list.push(obj);
          }
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].parentId != 0) {
            for (var j = 0; j < list.length; j++) {
              if (data[i].parentId == list[j].id) {
                data[i].index = list[j].index + '-' + i + j;
                namearr.push(list[j].index);
                (list[j].children).push(data[i]);
              }
            }
          }
        }
        for (var k = 0; k < list.length; k++) {
          list[k].children.sort(this.sortBy('pageOrder'));
        }
        this.menu = list.sort(this.sortBy('pageOrder'));
        var _this = this;
        this.namearr = namearr;
        this.$nextTick(() => {
          this.$refs.side_menu.updateOpened();
          this.$refs.side_menu.updateActiveName();
        })

      },

    },
    computed: {},
  }
</script>
<style scoped lang='less'>
  .home {
    padding-top: 40px;
    height: 100%;
  }

  .fixtop {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #304156;
    position: fixed;
    left: 0;
    top: 0;
  }

  .top_left {
    float: left;
    margin-left: 20px;
    color: #ffffff;
    .toprq {
      float: left;
      font-size: 12px;
    }
    .typetitle {
      float: left;
      font-size: 12px;
      font-weight: bold;
      margin-left: 20px;
    }
  }

  .top_right {
    float: right;
    margin-right: 20px;
    font-size: 12px;
    color: #CBDAB3;
    .top_renyuan {
      float: left;
      margin-right: 20px;
    }
    .top_zx {
      float: left;
      color: #CBDAB3;
      &:hover {
        color: #ffffff;
      }
    }
  }

  .mian {
    overflow: hidden;
    height: 100%;
    .mian_left {
      float: left;
      height: 100%;
      width: 240px;
      background: #304156;
    }
    .mian_right {
      margin-left: 240px;
      height: 100%;
      overflow: auto;
    }
  }

  .menulist {
    height: 100%;
    overflow: auto;
  }

  .menulist::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .menulist::-webkit-scrollbar-track {
    border-radius: 2.5px;
    background-color: #e6e6e6;
  }

  .menulist::-webkit-scrollbar-thumb {
    border-radius: 2.5px;
    background-color: #57c2ff;
  }

  .mian_right::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  .mian_right::-webkit-scrollbar-track {
    border-radius: 2.5px;
    background-color: #e6e6e6;
  }

  .mian_right::-webkit-scrollbar-thumb {
    border-radius: 2.5px;
    background-color: #57c2ff;
  }
</style>

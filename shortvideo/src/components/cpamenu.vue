<template>
    <Submenu :name="data.index" v-if="data.children.length>0">
        <template slot="title">
            <Icon type="ios-paper" />
            {{data.name}}
        </template>
        <MenuItem v-for="(item,index) in data.children" :name="item.url"><router-link :to='item.url' style="color:#ffffff;display:block;">{{item.name}}</router-link></MenuItem>
    </Submenu>
</template>

<script>
export default {
  props: ['data'],
  name: 'cpamenu',
  data () {
    return {
      list:'',
    }
  },
  watch:{

  },
  created:function(){
    // console.log(this.data)

  },
  components: { // 定义组件

  },
  methods:{

 },
  computed:{

	},
  mounted() {

  }
}
</script>
<style scoped lang='less'>
  .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{padding:0 !important;height:50px;line-height:50px;text-indent:43px;}
</style>


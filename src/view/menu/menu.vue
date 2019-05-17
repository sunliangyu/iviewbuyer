<template>
  <div>
    <div v-show="divshow">
      <Card shadow>
        <row><Input v-model="keyname"  type="text"    placeholder="请输入要查询的菜名关键字" style="width: 300px" /></row>
        <row><Button type="primary" @click="inquiry">查询</Button></row>
        <Table :columns="columns1" :data="data1"></Table>
        <Page :total="foodnum" show-total="true" @on-change="pagchange"/>
        <Button type="primary" @click="gocart">购物车</Button>
      </Card>
    </div>
    <div v-show="!divshow" >
      <Carousel  loop>
        <CarouselItem v-for="(item,index) in showmessage" :key="index" >
          <div > <img :src= "'http://localhost:8779/image/' + item " style="height: 200px; width: 900px" > </div>
        </CarouselItem>
      </Carousel>
      <Table :columns="columns2" :data="data2"></Table>
      <row>耗时{{this.showcost}}分钟</row>
      <row>已售{{this.showsell}}份</row>
      <Button type="primary" @click="reback">返回</Button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'menu',
  data () {
    return {
      columns1: [
        {
          title: '菜名',
          key: 'name'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '描述',
          key: 'des'
        },
        {
          title: '销量',
          key: 'out'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.addcart(params.index)
                  }
                }
              }, '加入购物车'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.infrmation(params.index)
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      columns2: [
        {
          title: '配料名',
          key: 'name'
        },
        {
          title: '数量(g)',
          key: 'count'
        }
      ],
      data2: [],
      data1: [],
      currentpage: 0,
      foodnum: null,
      foods: [],
      keyname: null,
      currentlike: null,
      showmessage: null,
      divshow: false,
      visible: true,
      showcost: null,
      showsell: null
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getMaterial',
      'getFoods',
      'addCart',
      'getFoodInfo'
    ]),
    pagchange (id) {
      var index = id - 1
      this.currentpage = index
      if (this.foods[index] != null) {
        this.data1 = this.foods[index]
      } else {
        this.getFoods({ 'page': index, 'like': this.currentlike }).then(res => {
          this.data1 = res.foods
          this.foods[index] = res.foods
          this.currentpage = index
        })
      }
    },
    inquiry () {
      this.foods = []
      this.data1 = []
      this.foodnum = 0
      if (this.keyname !== null && this.keyname != '') {
        this.currentlike = this.keyname.trim()
      } else {
        this.currentlike = null
        this.keyname = null
      }
      this.getFoods({ 'page': null, 'like': this.currentlike }).then(res => {
        this.data1 = res.foods
        this.foods[0] = res.foods
        this.foodnum = res.count
        this.currentpage = 0
      })
    },
    addcart (index) {
      var food = this.data1[index].id
      this.addCart(food).then(res => {
        if (res.state) {
          this.$Message.success('加入成功')
        } else {
          this.$Message.warning('加入失败')
        }
      })
    },
    infrmation (index) {
      var food = this.data1[index].id
      this.getFoodInfo(food).then(res => {
        this.data2 = res.need
        this.showmessage = res.image
        this.showcost = res.cost
        this.showsell = res.sell
        this.divshow = false
      })
    },
    reback () {
      this.divshow = true
    },
    gocart () {
      this.$router.push({
        name: 'cart_inquiry'
      })
    }
  },
  mounted () {
    this.divshow = true
    this.getFoods({ 'page': null, 'like': null }).then(res => {
      this.data1 = res.foods
      this.foods[0] = res.foods
      this.foodnum = res.count
      this.currentpage = 0
    })
  },
  created () {
  }
}
</script>

<style>

</style>

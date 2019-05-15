<template>
  <div class="container" >
    <h2 class="page-header">购物车</h2>
    <table class="table">
      <tr>
        <th><label><input type="checkbox" @click="check_all" :checked="select.length == cart_list.length"/>全选</label></th>
        <th>商品名称</th>
        <th>商品价格</th>
        <th>数量</th>
        <th>操作</th>
      </tr>
      <tr v-for="(cart,index) in cart_list" :key="index">
        <td><input type="checkbox" :value="cart" v-model="select" /></td>
        <td>{{cart.name}}</td>
        <td>{{cart.price}}</td>
        <td class="col-xs-3">
          <span class="btn btn-default" v-on:click="reduce(cart)">-</span>
          <input class="btn-group" type="number" disabled="true" v-model="cart.num"  />
          <span class="btn btn-default" v-on:click="add_num(cart)">+</span>
        </td>
        <td>
          <button class="btn btn-danger" v-on:click="delete_num">删除</button>
        </td>
      </tr>
    </table>
    <div>
      总计：共 {{cart_list.length    }}件商品，已选择 {{total_num}} 件
      <div class="pull-right">
        合计：{{total_price}}元
        <button  v-on:click="delete_num" :disabled="select.length <= 0">去结算</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'cart',
  data () {
    return {
      cart_list: [],
      select: []
    }
  },
  methods: {
    ...mapActions([
      'getcart'
    ]),
    reduce (cart) {
      if (cart.num <= 1) {
        cart.num = 1
      } else {
        cart.num--
      }
    },
    add_num (cart) {
      cart.num++
    },
    delete_num (cart) {
      this.select.splice(this.select.indexOf(cart), 1)
      this.cart_list.splice(this.cart_list.indexOf(cart), 1)
    },
    check_all () {
      if (this.select.length > 0) {
        this.select = []
      } else {
        this.cart_list.forEach(item => {
          this.select.push(item)
        })
      }
    }
  },
  computed: {
    total_price () {
      let price = 0
      this.select.forEach(item => {
        price += Number(item.price) * Number(item.num)
      })
      return price
    },
    total_num () {
      let t_num = 0
      this.select.forEach(item => {
        t_num += Number(item.num)
      })
      return t_num
    }
  },
  mounted () {
    this.getcart().then(res => {
      this.cart_list = res
    })
  }
}
</script>

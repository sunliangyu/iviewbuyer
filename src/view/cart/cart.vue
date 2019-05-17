<template>
    <div>
      <div>
        <row><Button @click="handleSelectAll(true)">全选</Button>
          <Button @click="handleSelectAll(false)">取消全选</Button></row>
        <Table border ref="selection" :columns="columns4" :data="cart_list" @on-selection-change="change"></Table>
        <row> 总计：共 {{total_all   }}件商品，已选择 {{total_num}} 件 </row>
        <row> 合计：{{total_price}}元
          <Button  @click="check" :disabled="select.length <= 0">去结算</Button>
        </row>
        <modal v-model="modal1" title="编辑"  @on-ok="saveadd" @on-cancel="cancel">
          <Input v-model="inputnum"  type="number"   placeholder="请输入要修改的数量" style="width: 300px" />
        </modal>
        <modal v-model="modal2" title="位置" ok-text="确认下单" cancel-text="取消订单" @on-ok="settle" @on-cancel="scancel">
          <row>
            <Select  v-model="flag" size="small"  style="width:100px">
              <Option label="外卖"  value="A">外卖</Option>
              <Option label="到店"  value="B">到店</Option>
            </Select>
          </row>
          <row><Input v-model="address"  type="text"   placeholder="请输入位置" style="width: 300px" /></row>
          <row><Input v-model="people"  type="number"   placeholder="请输入用餐人数" style="width: 300px" /></row>
          <row><Input v-model="remark"  type="text"   placeholder="请输备注" style="width: 300px" /></row>
          <Table border  :columns="columns1" :data="select"></Table>
          <row>共计：{{total_num}} 件 </row>
          <row>合计：{{total_price}}元</row>
        </modal>
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
      select: [],
      currentfood: null,
      currentnum: 0,
      inputnum: 0,
      modal1: false,
      modal2: false,
      flag: 'B',
      address: null,
      people: null,
      remark: null,
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商品名',
          key: 'name'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '数量',
          key: 'num'
        },
        {
          title: '数量操作',
          key: 'action',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delete(params.index)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params.index)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      columns1: [
        {
          title: '商品名',
          key: 'name'
        },
        {
          title: '价格',
          key: 'price'
        },
        {
          title: '数量',
          key: 'num'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'getcart',
      'alertCart',
      'purchase'
    ]),
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    change (select) {
      this.select = select
    },
    check () {
      this.modal2 = true
    },
    settle () {
      var address = this.address.trim()
      if (address == null) {
        this.$Message.warning('地址不能为空')
      } else {
        var food = []
        var len = this.select.length
        for (var i = 0; i < len; i++) {
          food.push({ 'food': this.select[i].food, 'num': this.select[i].num, 'name': this.select[i].name, 'price': this.select[i].price })
        }
        var p = 1
        if (this.people != null) {
          p = this.people
        }
        var price = this.total_price
        var remark = null
        if (this.remark != null) {
          remark = this.remark
        }
        var count = this.total_num
        this.purchase({ food, 'address': address, 'flag': this.flag, 'remark': remark, price, 'people': p, count }).then(res => {
          if (res.state) {
            this.$refs.selection.selectAll(false)
            this.$Message.success('下单成功' + '订单号' + res.id)
            this.modal2 = false
          } else {
            this.$Message.warning('下单失败')
            this.modal2 = false
          }
        })
      }
    },
    scancel () {
      this.$Message.warning('你取消了订单')
      this.modal2 = false
    },
    delete (index) {
      var cart = this.cart_list[index]
      this.alertCart({ 'food': cart.food, 'num': null, 'type': 'c' }).then(() => {
        this.cart_list.splice(index, 1)
      })
    },
    saveadd () {
      if (this.inputnum < 1) {
        this.$Message.warning('请输入大于0的数量')
      } else if (this.inputnum == this.currentnum) {
        this.$Message.warning('数据未修改')
      } else {
        var food = this.cart_list[this.currentfood].food
        this.alertCart({ 'food': food, 'num': this.inputnum, 'type': 'b' }).then(() => {
          this.cart_list[this.currentfood].num = this.inputnum
          console.log(this.select)
          this.modal1 = false
          this.$Message.success('修改成功')
        })
      }
    },
    cancel () {
      this.modal1 = false
    },
    edit (arg) {
      this.currentfood = arg
      this.currentnum = this.cart_list[arg].num
      this.inputnum = this.currentnum
      this.modal1 = true
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
    },
    total_all () {
      let t_num = 0
      this.cart_list.forEach(item => {
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

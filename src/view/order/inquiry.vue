<template>
  <div>
    <Form  v-show="showform"   :label-width="400">
      <FormItem label="开始日期">
        <Row>
          <Col span="11">
            <FormItem >
              <Date-picker
                @on-change="handleChange"
                type="daterange"
                format="yyyy-MM-dd"
                placeholder="请选择时间段"
                placement="bottom-end">
              </Date-picker>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="订单状态">
        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
          <Checkbox
            :indeterminate="indeterminate"
            :value="checkAll"
            @click.prevent.native="handleCheckAll(true)">全选</Checkbox>
        </div>
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
          <Checkbox label="b">接单</Checkbox>
          <Checkbox label="c">拒单</Checkbox>
          <Checkbox label="d">完成</Checkbox>
          <Checkbox label="e">已评价</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="订单性质">
        <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
          <Checkbox
            :indeterminate="indeterminate1"
            :value="checkAll1"
            @click.prevent.native="handleCheckAll(false)">全选</Checkbox>
        </div>
        <CheckboxGroup v-model="checkAllGroup1" @on-change="checkAllGroupChange1">
          <Checkbox label="Y">到店</Checkbox>
          <Checkbox label="N">外卖</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">查询</Button>
        <Button @click="handleReset" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <Form v-show="!showform"   :label-width="80">
      <FormItem label="订单总支出">
        <Icon type="md-thumbs-up" />
        {{allprice}}元
      </FormItem>
      <FormItem>
        <Table :columns="columns" :data="data"></Table>
      </FormItem>
      <FormItem>
        <Modal
          v-model="modal1"
          title="订单信息"
          @on-ok="saveadd"
        >
          <p>
            订单号：{{foodid}}
          </p>
          <p>
            价格：{{content.price}}
          </p>
          <p>
            用餐地址：{{content.location}}
          </p>
          <p>
            用餐人数：{{content.people}}
          </p>
          <p>
            菜品：{{content.foods}}
          </p>
          <p v-show="modelshow">
            拒单理由：{{content.reason}}
          </p>
        </Modal>
        <Page :total="allpage" show-total="true" @on-change="pagchange"/>
        <Button @click="returnback">返回上一层</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'inquiry',
  components: {},
  data () {
    return {
      start: null,
      indeterminate: false,
      checkAll: true,
      checkAllGroup: ['b', 'c', 'd', 'e'],
      indeterminate1: false,
      checkAll1: true,
      checkAllGroup1: ['Y', 'N'],
      showform: true,
      showarray: [],
      allpage: 0,
      page: 0,
      allprice: 0,
      modelshow: false,
      content: {
        price: 0,
        location: '',
        foods: [],
        people: 0
      },
      modal1: false,
      foodid: null,
      currentPage: 0,
      columns: [
        {
          title: '订单号',
          key: 'id'
        },
        {
          title: '创建时间',
          key: 'time'
        },
        {
          title: '状态(b 接单 c 拒单 d 完成 e 已评价)',
          key: 'flow'
        },
        {
          title: '性质(True 外卖 False 到店)',
          key: 'flag'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.edit(params.index)
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      data: []
    }
  },
  methods: {
    ...mapActions([
      'cifQuiryOrder',
      'getOrderDetail'
    ]),
    handleCheckAll (bool) {
      if (bool) {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        this.indeterminate = false

        if (this.checkAll) {
          this.checkAllGroup = ['b', 'c', 'd', 'e']
        } else {
          this.checkAllGroup = []
        }
      } else {
        if (this.indeterminate1) {
          this.checkAll1 = false
        } else {
          this.checkAll1 = !this.checkAll1
        }
        this.indeterminate1 = false

        if (this.checkAll1) {
          this.checkAllGroup1 = ['Y', 'N']
        } else {
          this.checkAllGroup1 = []
        }
      }
    },
    checkAllGroupChange (data) {
      if (data.length === 4) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    checkAllGroupChange1 (data) {
      if (data.length === 2) {
        this.indeterminate1 = false
        this.checkAll1 = true
      } else if (data.length > 0) {
        this.indeterminate1 = true
        this.checkAll1 = false
      } else {
        this.indeterminate1 = false
        this.checkAll1 = false
      }
    },
    handleReset () {
      this.start = null
      this.indeterminate = false
      this.checkAll = true
      this.checkAllGroup = ['b', 'c', 'd', 'e']
      this.indeterminate1 = false
      this.checkAll1 = true
      this.checkAllGroup1 = ['Y', 'N']
    },
    handleSubmit () {
      if (this.checkAllGroup.length <= 0) {
        this.$Message.warning('状态不能为空')
      } else if (this.checkAllGroup1.length <= 0) {
        this.$Message.warning('订单性质不能为空')
      } else {
        var start
        if (this.start != null && this.start !== '') {
          start = this.start
        } else {
          start = null
        }
        this.cifQuiryOrder({ start: start, condition: this.checkAllGroup, quality: this.checkAllGroup1, page: null }).then(res => {
          this.allpage = res.all
          this.showarray[0] = res.page
          this.allprice = res.out
          this.data = this.showarray[0]
          this.currentPage = 1
          this.showform = false
        })
      }
    },
    handleChange (daterange) {
      this.start = daterange
    },
    edit (index) {
      this.foodid = this.data[index].id
      if (this.data[index].flow === 'c') {
        this.modelshow = true
      } else {
        this.modelshow = false
      }
      this.getOrderDetail(this.foodid).then(res => {
        this.content = res
        console.log(this.content)
        this.modal1 = true
      })
    },
    returnback () {
      this.data = []
      this.showarray = []
      this.allpage = 0
      this.showform = true
    },
    pagchange (id) {
      alert('start')
      var index = id - 1
      if (this.showarray[index] == null) {
        var start
        if (this.start != null && this.start !== '') {
          start = this.start
        } else {
          start = null
        }
        this.cifQuiryOrder({ start: start, condition: this.checkAllGroup, quality: this.checkAllGroup1, page: index }).then(res => {
          this.showarray[index] = res.page
          this.data = res.page
          this.currentPage = id
        })
      } else {
        this.data = this.showarray[index]
        this.currentPage = id
      }
    }
  }
}
</script>

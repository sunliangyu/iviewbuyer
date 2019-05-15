<template>
  <Card shadow>
    <div>
      <div class="message-page-con message-category-con">
        <Menu width="auto" active-name="unread" @on-select="handleSelect">
          <MenuItem name="unread">
            <span class="category-title">未处理订单</span><Badge style="margin-left: 10px" :count="UnreadCount"></Badge>
          </MenuItem>
          <MenuItem name="coding">
            <span class="category-title">正在制作订单</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="codingCount"></Badge>
          </MenuItem>
          <MenuItem name="finish">
            <span class="category-title">今日已完成订单</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="finishCount"></Badge>
          </MenuItem>
          <MenuItem name="refuse">
            <span class="category-title">今日已拒订单</span><Badge style="margin-left: 10px" class-name="gray-dadge" :count="refuseCount"></Badge>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-list-con">
        <Menu
          width="auto"
          active-name=""
          :class="titleClass"
          @on-select="handleView"
        >
          <MenuItem  v-for="item in messageList" :name="item.id" :key="item.id">
            <div>
              <p class="msg-title">订单号{{ item.id }}</p>
              <Badge status="default" :text="item.time" />
            </div>
          </MenuItem>
        </Menu>
      </div>
      <div class="message-page-con message-view-con"   v-show=" display">
        <Spin fix v-if="contentLoading" size="large"></Spin>
        <div>{{ messageContent.location }}</div>
        <div>共计{{ messageContent.people }}人用餐</div>
        <div>价格总计{{ messageContent.price }}元</div>
        <div>菜品：{{messageContent.foods}} </div>
        <div v-show=" messageContent.reason != null">
          拒绝理由{{messageContent.reason}}
        </div>
        <br> <br> <br> <br> <br>
        <div v-show="currentMessageType === 'unread'  "   >
          <Button
            style="float: left;margin-left: 10px;"
            size="small"
            title="取消订单"
            type="error"
            @click.native.stop="modal6 = true">
            <Icon type="ios-arrow-back"></Icon>取消订单
          </Button>
          <Modal
            v-model="modal6"
            title="请填写取消订单原因"
            @on-ok="refuseOrder()"
            @on-cancel="cancel">
            <Input v-model="refusereason" placeholder="Enter something..." style="width: 300px" />
          </Modal>
        </div>
        <div v-show="currentMessageType === 'coding'  "   >
          <Button
            style="float: left;margin-left: 10px;"
            size="small"
            title="订单进展"
            type="dashed"
            @click="getprogress"
          >
            <Icon type="ios-arrow-back"></Icon>订单进展
          </Button>
          <Modal
            v-model="modal3"
            title="订单进展"
            @on-ok="onok"
            @on-cancel="onok">
            <Table :columns="columns" :data="data"></Table>
          </Modal>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      contentLoading: false,
      currentMessageType: null,
      messageContent: {},
      showingMsgItem: {},
      display: false,
      modal6: false,
      refusereason: '',
      currentorder: null,
      UnreadCount: 0,
      codingCount: 0,
      refuseCount: 0,
      finishCount: 0,
      messageList: [],
      modal3: false,
      columns: [
        {
          title: '菜名',
          key: 'name'
        },
        {
          title: '数量',
          key: 'count'
        },
        {
          title: '状态(a 准备中 b 烹饪中 c 完成)',
          key: 'flow'
        }
      ],
      data: []

    }
  },
  computed: {
    ...mapState({
    }),
    ...mapGetters([
    ])
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getOrderDetail',
      'getorderlist',
      'orderCount',
      'getprogresss'
    ]),
    stopLoading (name) {
      this[name] = false
    },
    handleSelect (name) {
      this.display = false
      if (name !== this.currentMessageType) {
        this.currentMessageType = name
        if (name === 'unread') {
          this.getorderlist('a').then(res => {
            this.messageList = res
          })
        } else if (name === 'coding') {
          this.getorderlist('b').then(res => {
            this.messageList = res
            console.log(this.messageList)
          })
        } else if (name === 'refuse') {
          this.getorderlist('c').then(res => {
            this.messageList = res
          })
        } else {
          this.getorderlist('d').then(res => {
            this.messageList = res
          })
        }
      }
    },
    handleView (id) {
      this.contentLoading = true
      this.display = true
      this.currentorder = id
      this.getOrderDetail(id).then(res => {
        this.messageContent = res
        this.contentLoading = false
      })
    },
    getprogress () {
      this.getprogresss({ 'id': this.currentorder }).then(res => {
        this.data = res
        this.modal3 = true
      })
    },
    onok () {
      this.modal3 = false
    }
  },
  mounted () {
    this.orderCount().then(res => {
      this.UnreadCount = res.a
      this.codingCount = res.b
      this.refuseCount = res.c
      this.finishCount = res.d
    })
  },
  refuseOrder (id) {
  },
  progess (id) {

  }
}
</script>

<style lang="less">
  .message-page{
    &-con{
      height: ~"calc(100vh - 176px)";
      display: inline-block;
      vertical-align: top;
      position: relative;
      &.message-category-con{
        border-right: 1px solid #e6e6e6;
        width: 200px;
      }
      &.message-list-con{
        border-right: 1px solid #e6e6e6;
        width: 230px;
      }
      &.message-view-con{
        position: absolute;
        left: 446px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
        .message-view-header{
          margin-bottom: 20px;
          .message-view-title{
            display: inline-block;
          }
          .message-view-time{
            margin-left: 20px;
          }
        }
      }
      .category-title{
        display: inline-block;
        width: 65px;
      }
      .gray-dadge{
        background: gainsboro;
      }
      .not-unread-list{
        .msg-title{
          color: rgb(170, 169, 169);
        }
        .ivu-menu-item{
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
            display: none;
          }
          &:hover{
            .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only{
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>

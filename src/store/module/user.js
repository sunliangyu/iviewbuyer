import {
  login,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  alertmessage,
  getUnreadCount,
  cifQuiryOrder,
  getcart
} from '@/api/user'
import {
  getOrderById,
  getorderlist,
  orderCount,
  getprogress
} from '@/api/order'

import {
  getfoodClass,
  getFoodsByClass,
  getFoodById,
  getImage,
  getRestaurants
} from '@/api/food'

import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    restaurant: 0,
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setRestaurant (state, id) {
      state.restaurant = id
    }
  },
  getters: {
    userid: state => state.userId,
    restaurant: state => state.restaurant
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password, restaurant }) {
      var username = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password,
          restaurant
        }).then(res => {
          const data = res.data
          if (data.token == null) {
            alert('账户或者密码错误')
            reject(res.message)
          } else {
            commit('setToken', data.token)
            resolve()
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setAccess', [])
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          var token = getToken()
          getUserInfo(token).then(res => {
            const data = res.data
            if (data.user_id == null) {
              alert('请重新登录')
              commit('setToken', '')
              commit('setAccess', [])
            } else {
              commit('setAvatar', data.avatar)
              commit('setUserName', data.name)
              commit('setUserId', data.user_id)
              commit('setAccess', data.access)
              commit('setHasGetInfo', true)
              commit('setRestaurant', data.restaurant)
            }
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount(state.restaurant).then(res => {
        const data = res.data
        commit('setMessageCount', data.message)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage(state.restaurant).then(res => {
          const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageReadedList', readed.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          var restaurant = state.restaurant
          getContentByMsgId(restaurant, msg_id).then(res => {
            const content = res.data.message
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        var state = 'b'
        alertmessage(restaurant, msg_id, state).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ state, commit }, { msg_id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        var state = 'c'
        alertmessage(restaurant, msg_id, state).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ state, commit }, { msg_id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        var state = 'b'
        alertmessage(restaurant, msg_id, state).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前订单点击的消息的id获取内容
    getOrderContentByMsgId: function ({ commit, state }, order) {
      return new Promise((resolve, reject) => {
        let content = state.orderContentStore[order]
        if (content) {
          resolve(content)
        } else {
          getOrderById(order, state.restaurant).then(res => {
            const content = res.data
            commit('updateOrder', { order, content })
            resolve(content)
          })
        }
      })
    },
    getOrderDetail: function ({ commit, state }, order) {
      return new Promise((resolve, reject) => {
        getOrderById(order, state.restaurant).then(res => {
          const content = res.data
          resolve(content)
        })
      })
    },
    getfoodClass ({ commit, state }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getfoodClass({ restaurant }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getFoodsByClass  ({ commit, state }, { type }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getFoodsByClass({ restaurant, type }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getFoodById ({ commit, state }, id) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getFoodById({ restaurant, id }).then((res) => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getImage ({ commit, state }, id) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getImage({ restaurant, start, condition, quality, page }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getRestaurants () {
      return new Promise((resolve, reject) => {
        getRestaurants().then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    cifQuiryOrder ({ commit, state }, { start, condition, quality, page }) {
      var restaurant = state.restaurant
      var user = state.userId
      return new Promise((resolve, reject) => {
        cifQuiryOrder({ restaurant, start, condition, quality, page, user }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getorderlist ({ commit, state }, type) {
      var restaurant = state.restaurant
      var cif = state.userId
      return new Promise((resolve, reject) => {
        getorderlist({ restaurant, cif, type }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    orderCount ({ commit, state }) {
      var restaurant = state.restaurant
      var cif = state.userId
      return new Promise((resolve, reject) => {
        orderCount({ restaurant, cif }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getprogresss ({ commit, state }, { id }) {
      var restaurant = state.restaurant
      return new Promise((resolve, reject) => {
        getprogress({ restaurant, id }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    },
    getcart ({ commit, state }) {
      var restaurant = state.restaurant
      var cif = state.userId
      return new Promise((resolve, reject) => {
        getcart({ restaurant, cif }).then(res => {
          var data = res.data
          resolve(data)
        })
      })
    }
  }
}

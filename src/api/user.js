import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

const axios = new HttpRequest(baseUrl)

export const registry = ({ username, password }) => {
  const data = JSON.stringify({ 'username': username, 'password': password })
  return axios.request({
    url: 'user/registry',
    data,
    method: 'post',
    timeout: 1000 * 60 * 2
  })
}

export const login = ({ username, password, restaurant }) => {
  return axios.request({
    url: 'client/client/login',
    data: JSON.stringify({ 'username': username, 'password': password, 'restaurant': restaurant }),
    method: 'post',
    timeout: 1000 * 60 * 2,
    headers: {
    }
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'client/client/getUserInfo',
    data: JSON.stringify({ 'token': token }),
    headers: {
    },
    timeout: 1000 * 60 * 2,
    method: 'post'
  })
}

export const logout = (restaurant) => {
  // 未写 后期进行长连接 websocket 的时候添加
}

export const getUnreadCount = (restaurant) => {
  return axios.request({
    url: 'system/system/messageCount',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

export const getMessage = (restaurant) => {
  return axios.request({
    url: 'system/system/getMessage',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}

export const getContentByMsgId = (restaurant, msg_id) => {
  return axios.request({
    url: 'system/system/getmessageid',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'mag_id': msg_id })
  })
}
export const alertmessage = (restaurant, msg_id, state) => {
  return axios.request({
    url: 'system/system/altermessage',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'msg_id': msg_id, 'state': state })
  })
}

export const cifQuiryOrder = ({ restaurant, start, condition, quality, page, user }) => {
  return axios.request({
    url: 'client/order/cifQuiryOrder',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'start': start, 'condition': condition, 'quality': quality, 'page': page, 'user': user })
  })
}

export const getcart = ({ restaurant, cif }) => {
  return axios.request({
    url: 'kitchen/food/getCart',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      cif
    }
  })
}

export const alertCart = ({ restaurant, cif, food, num, type }) => {
  return axios.request({
    url: 'kitchen/food/alertCart',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'cif': cif, 'food': food, 'num': num, 'type': type })
  })
}

export const addCart = ({ restaurant, food, cif }) => {
  return axios.request({
    url: 'kitchen/food/addCart',
    method: 'post',
    timeout: 1000 * 60 * 2,
    data: JSON.stringify({ 'restaurant': restaurant, 'food': food, 'cif': cif })
  })
}

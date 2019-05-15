import axios from '@/libs/api.request'

// 获取订单详细信息
export const getOrderById = (order, restaurant) => {
  return axios.request({
    url: 'client/order/getOrderById',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      order,
      restaurant
    }
  })
}

export const getorderlist = ({ restaurant, cif, type }) => {
  return axios.request({
    url: 'client/order/todayOrder',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant, cif, type
    }
  })
}

export const orderCount = ({ restaurant, cif }) => {
  return axios.request({
    url: 'client/order/orderCount',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant, cif
    }
  })
}

export const getprogress = ({ restaurant, id }) => {
  return axios.request({
    url: 'kitchen/food/getProgress',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant, id
    }
  })
}

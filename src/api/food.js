import axios from '@/libs/api.request'
// 拒绝或接受订单
export const getfoodClass = ({ restaurant }) => {
  return axios.request({
    url: 'kitchen/food/getfoodClass',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant
    }
  })
}
export const getFoodById = ({ restaurant, id }) => {
  return axios.request({
    url: 'kitchen/food/getFoodById',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      id
    }
  })
}

export const getFoodsByClass = ({ restaurant, type }) => {
  return axios.request({
    url: 'kitchen/food/getfoodByclass',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant,
      type
    }
  })
}

export const getRestaurants = () => {
  return axios.request({
    url: 'system/system/getRestaurants',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
    }
  })
}

export const getFoods = ({ restaurant, like, page }) => {
  return axios.request({
    url: 'kitchen/food/getMenu',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant, like, page
    }
  })
}

export const getFoodInfo = ({ restaurant, food }) => {
  return axios.request({
    url: 'kitchen/food/getFoodInfo',
    method: 'get',
    timeout: 1000 * 60 * 2,
    params: {
      restaurant, food
    }
  })
}

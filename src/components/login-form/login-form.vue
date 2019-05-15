<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem label="餐厅"  prop="restaurant">
      <i-select  style="width:200px" filterable v-model="form.restaurant" clearable="true">
        <i-option v-for="item in restaurants"  :key="item.id" :value="item.id">
          {{ item.label }}
        </i-option>
      </i-select>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        userName: '',
        password: '',
        restaurant: 1
      },
      restaurants: []
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules,
        restaurant: this.restaurantRules
      }
    }
  },
  methods: {
    ...mapMutations([
      //
    ]),
    ...mapActions([
      'getRestaurants'
    ]),
    handleSubmit () {
      // return this.$axios({
      //   url: 'http://localhost:8762/user/userlogin',
      //   method: 'post',
      //   data: JSON.stringify({ 'username': 'sly', 'password': '123' }),
      //   headers: { 'Content-Type': 'application/json'
      //   }
      // }).then(res => {
      //   console.log(res)
      // })
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            restaurant: this.form.restaurant
          })
        }
      })
    }
  },
  mounted () {
    this.getRestaurants().then(res => {
      this.restaurants = res
    })
  }
}
</script>

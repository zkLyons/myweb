//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由，pinia里面是外部组件，没有生命周期，所以不能够直接使用vue-router的useRoute和useRouter
// 如果需要引入路由组件的话，需要直接从路由实例的创建文件中引入它
import router from '@/router'

//引入路由(常量路由)
import {
  constantRoute,
  // anyRouteUserState,
  asnycRoute,
  anyRoute,
} from '@/router/routes'
// import { asnycRoute } from '@/router/routes'

//引入深拷贝方法，需要使用pnpm安装lodash，它有实现深拷贝的方法。
import cloneDeep from 'lodash/cloneDeep'
// 对用户路由进行过滤
function filterAsyncRoute(asyncRoute: any, Routes: any) {
  // asyncRoute:异步路由
  // Routes：用户路由，从后端传递过来的一个数组，表示用户可以访问的路由数组
  return asyncRoute.filter((item: any) => {
    if (Routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, Routes)
      }
      return true
    }
  })
}

//创建用户小仓库
const useUserStore = defineStore('User', {
  //小仓库存储数据地方
  // UserState指的是返回值类型。
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识token
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组(路由)
      username: '',
      avatar: '',
      //存储当前用户是否包含某一个按钮，该按钮代表权限
      buttons: [],
    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      //登录请求
      const result: loginResponseData = await reqLogin(data)
      //登录请求:成功200->token
      //登录请求:失败201->登录失败错误的信息
      if (result.code == 200) {
        //pinia仓库存储一下token
        //由于pinia|vuex存储数据其实利用js对象
        this.token = result.data as string
        //本地存储持久化存储一份
        SET_TOKEN(result.data as string)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息方法
    async userInfo() {
      //获取用户信息进行存储仓库当中[用户头像、名字]
      const result: userInfoReponseData = await reqUserInfo()
      //如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        console.log(result.data)
        this.username = result.data.name
        this.avatar = result.data.avatar
        // 按钮权限存储
        this.buttons = result.data.buttons
        // 计算用户可以展示的路由，常量路由+异步路由+任意路由
        // 这里不能直接插入asnycRoute，第一个用户更改了item.children，第二个用户在使用asyncRoute就是更改后的了，所以要使用深拷贝。
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asnycRoute),
          result.data.routes,
        )
        console.log(userAsyncRoute, 'userAsyncRoute')
        // 将路由手动添加到仓库变量中，但是新加入的路由并没有注册，还不能够使用
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        // 依次将新路由注册
        this.menuRoutes.forEach((route: any) => {
          router.addRoute(route)
        })

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      //退出登录请求
      const result: any = await reqLogout()
      if (result.code == 200) {
        //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
//对外暴露获取小仓库方法
export default useUserStore

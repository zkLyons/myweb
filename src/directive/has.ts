import pinia from '@/store'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
  //获取对应的用户仓库
  //全局自定义指令:实现按钮的权限
  app.directive('has', {
    //代表使用这个全局自定义指令的DOM|组件挂载完毕的时候会执行一次
    // el:表示使用该自定义指令的dom元素，这里指的是button对象
    // options：表示v-has右侧的键值。
    mounted(el: any, options: any) {
      //自定义指令右侧的数值:如果在用户信息buttons数组当中没有
      //从DOM树上干掉
      console.log('123')
      console.log(userStore.buttons, 'buttons')
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
/**
 * 1. 封装性与逻辑集中
v-if='useStore.buttons.includes('btn.Trademark.add')：这种写法将权限判断的具体逻辑暴露在了每一个模板中。
这意味着，如果你未来需要改变权限判断的逻辑（比如，从 includes 改为其他更复杂的判断方式，或者权限数据源发生了变化），你必须遍历项目中所有使用到这个判断的按钮，并逐一修改。
v-has='btn.Trademark.add'：这种写法将权限判断的核心逻辑封装在了自定义指令 v-has 的实现中。模板中只关心“这个按钮是否有 btn.Trademark.add 这个权限”，而不关心如何判断。
如果将来你需要修改权限判断逻辑，只需要修改 isHasButton 这个自定义指令的定义即可，所有使用 v-has 的地方都会自动应用新的逻辑。
 */

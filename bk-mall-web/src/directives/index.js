/**
 * BK商城 自定义指令集合
 * 统一注册所有自定义指令
 */

import lazyLoad from './lazyLoad'
import numberAnimate from './numberAnimate'

export default {
  install(app) {
    app.directive('lazy', lazyLoad)
    app.directive('number-animate', numberAnimate)
  },
}

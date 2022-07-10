import router from "./router";
import userUserStore from "./store/user";

const user = userUserStore()

router.beforeEach(
    (to,from) => {
        //如果userStore里的token有值
        if (user.token) {
            console.log(user.token)
            //如果目标网址是登录页，则跳转到首页，不需要再次登录
            if (to.name === 'login') {
                return {name : 'home'}
            }
        }
    }
)

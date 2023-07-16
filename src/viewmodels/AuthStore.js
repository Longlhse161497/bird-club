import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import authService from "../services/AuthService";
import {NOTIFICATION} from "../utils/toast.const.app";
import userService from "../services/UserService";
import {User} from "../models/User";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {AUTH_KEY} from "../utils/auth.const.app";

class AuthStore {
    // init state
    user = {}
    isLogin = false;
    notification = null
    isFetching = false;

    constructor() {
        makeAutoObservable(this)
    }

    getIsLogin = () => {
        return this.isLogin;
    }
    setIsLogin = (value) => {
        this.isLogin = value;
    }

    getUser = () => {
        return this.user;
    }
    setUser = (value) => {
        this.user = value;
    }

    setIsFetching = (v) => {
        this.isFetching = v
    };

    setNotification = (v) => {
        this.notification = v;
    }

    async login(email, password, isRe = false) {
        try {
            this.setIsFetching(true)
            setTimeout(async () => {
                let resp = await authService.login(email, password)
                if (resp == null) {
                    this.setNotification({
                        type: NOTIFICATION.TYPE_NOTIFICATION.TYPE_ERROR,
                        msg: NOTIFICATION.MSG_NOTIFICATION.MSG_ERROR.msg_login_error
                    })
                }
                if (resp != null && resp?.uid) {
                    /// get data from use collection
                    let user = await userService.getUserById(resp.uid)
                    console.log("user :::", user)
                    if (user == null) {
                        this.setNotification({
                            type: 'error', msg: 'không tìm thấy dữ liệu người dùng hãy liên hệ admin để kiểm tra'
                        })
                    } else {
                        //
                        this.setUser(user)
                        this.setIsLogin(true)
                        if (isRe) {
                            // set token
                            await asyncStorage.setItem(AUTH_KEY, JSON.stringify({email: email, password: password}))
                        }
                    }
                }
                this.setIsFetching(false)
            }, 500)
        } catch (e) {
            console.log(e)
            this.setIsFetching(false)
            this.setNotification({
                type: 'error', msg: 'Có lỗi xảy ra'
            })
        }
    }

    async reg(email, password, username) {
        try {
            this.setIsFetching(true)
            setTimeout(async () => {
                const resp = await AuthService.reg(email, password);
                if (resp != null && resp?.uid) {
                    // create user object
                    const user = new User(resp.uid, username, email, "user", "")
                    const result = await userService.createNewUser(user);
                    if (result == null) {
                        this.setNotification({type: 'error', msg: 'có lỗi xảy ra'})
                    }
                    if (result) {
                        this.setNotification({type: 'success', msg: 'đăng ký thành công'})
                        // login
                        await this.login(email, password)
                    }
                }

                if (resp == null) {
                    this.setNotification({type: "error", msg: 'email đã được đăng ký'})
                }
                this.setIsFetching(false)
            }, 500)
        } catch (e) {
            console.log(e)
            this.setIsFetching(false)
            this.setNotification({
                type: 'error', msg: 'Có lỗi xảy ra'
            })
        }
    }

    async logout() {
        this.setUser({})
        this.setIsLogin(false)
        await asyncStorage.removeItem(AUTH_KEY);
    }
}

const authStore = new AuthStore();
export default authStore;
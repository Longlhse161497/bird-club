import {observer} from "mobx-react";
import {useLayoutEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import Toast from "react-native-toast-message";
import authStore from "../viewmodels/AuthStore";
import WrapperLayout from "../layouts/WrapperLayout";
import {Checkbox, HStack, KeyboardAvoidingView, Text, VStack} from "native-base";
import {ActivityIndicator, Image, Platform, TextInput, TouchableOpacity} from "react-native";
import logo from "../images/logo.png";
import {SW} from "../utils/layout.const.app";

const RegisterScreen = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('')
    const [rePass, setRepass] = useState('');
    const showToast = (type, msg) => {
        Toast.show({
            type: type, text1: 'Thông báo', text2: msg
        })
    }
    const Nav = useNavigation();

    const reg = async () => {
        if (email.trim() === '') {
            showToast('error', 'Email Không được để trống')
            return;
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) {
            showToast('error', 'Email không đúng định dạng.')
            return;
        }
        if (password.trim() === "") {
            showToast("error", "Mật khẩu không được để trống")
            return;
        }
        if (password !== rePass) {
            showToast("error", "Mật khẩu xác nhận không đúng")
            return;
        }
        if (username.trim() === "") {
            showToast("error", "Tên người dùng không được để trống")
            return;
        }
        if (authStore.isFetching) {
            return;
        }
        await authStore.reg(email, password, username);
    }

    useLayoutEffect(() => {
        if (authStore.notification) {
            Toast.show({
                type: authStore.notification.type, text2: authStore.notification.msg
            })
        }
    }, [authStore.notification])

    const handleToReg = () => {
        Nav.goBack();
    }
    return (<WrapperLayout>
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
            <VStack space={3} flex={1} alignItems={'center'}>
                <Image source={logo} style={{width: SW, height: 180, objectFit: 'contain', marginVertical: 20}}/>
                <TextInput defaultValue={username} onChangeText={text => setUsername(text)} style={{
                    backgroundColor: '#eaeaea',
                    width: SW - 55,
                    borderRadius: 4,
                    fontSize: 14,
                    paddingVertical: 12,
                    paddingHorizontal: 6
                }} placeholder={'Tên người dùng'}/>
                <TextInput defaultValue={email} onChangeText={text => setEmail(text)} style={{
                    backgroundColor: '#eaeaea',
                    width: SW - 55,
                    borderRadius: 4,
                    fontSize: 14,
                    paddingVertical: 12,
                    paddingHorizontal: 6
                }} placeholder={'E-MAIL'}/>
                <TextInput defaultValue={password} onChangeText={text => setPassword(text)} style={{
                    backgroundColor: '#eaeaea',
                    width: SW - 55,
                    borderRadius: 4,
                    fontSize: 14,
                    paddingVertical: 12,
                    paddingHorizontal: 6
                }} placeholder={'Mật khẩu'}/>
                <TextInput defaultValue={rePass} onChangeText={text => setRepass(text)} style={{
                    backgroundColor: '#eaeaea',
                    width: SW - 55,
                    borderRadius: 4,
                    fontSize: 14,
                    paddingVertical: 12,
                    paddingHorizontal: 6
                }} placeholder={'Xác nhận mật khẩu'}/>
                <TouchableOpacity activeOpacity={1} onPress={reg} style={{
                    backgroundColor: '#ff9d25', width: SW - 55, paddingVertical: 12, borderRadius: 6
                }}>
                    {authStore.isFetching ? <ActivityIndicator size={21} color={'white'}/> :
                        <Text color={'white'} textAlign={'center'}>Đăng ký</Text>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} onPress={handleToReg}>
                    <Text>Đăng nhập</Text>
                </TouchableOpacity>
            </VStack>
        </KeyboardAvoidingView>
    </WrapperLayout>)
}
export default observer(RegisterScreen)
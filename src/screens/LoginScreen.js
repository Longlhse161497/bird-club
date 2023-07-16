import {observer} from "mobx-react";
import WrapperLayout from "../layouts/WrapperLayout";
import {ActivityIndicator, Image, Platform, TextInput, TouchableOpacity} from "react-native";
import logo from '../images/logo.png'
import {Checkbox, HStack, KeyboardAvoidingView, Text, VStack} from "native-base";
import {SW} from "../utils/layout.const.app";
import {useLayoutEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import {useNavigation} from "@react-navigation/native";
import authStore from "../viewmodels/AuthStore";

const LoginScreen = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true)
    const [re, setRe] = useState(false);
    const Nav = useNavigation();

    const showToast = (type, msg) => {
        Toast.show({
            type: type, text1: 'Thông báo', text2: msg
        })
    }
    const login = async () => {
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
        if (authStore.isFetching) {
            return;
        }
        await authStore.login(email, password, re);
    }

    useLayoutEffect(() => {
        if (authStore.notification) {
            Toast.show({
                type: authStore.notification.type, text2: authStore.notification.msg
            })
        }
    }, [authStore.notification])

    const handleToReg = () => {
        Nav.navigate('reg')
    }
    return (<WrapperLayout>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
                <VStack space={3} flex={1} alignItems={'center'}>
                    <Image source={logo} style={{width: SW, height: 180, objectFit: 'contain', marginVertical: 20}}/>
                    <TextInput defaultValue={email} onChangeText={text => setEmail(text)} style={{
                        backgroundColor: '#eaeaea',
                        width: SW - 55,
                        borderRadius: 4,
                        fontSize: 14,
                        paddingVertical: 12,
                        paddingHorizontal: 6
                    }} placeholder={'E-MAIL'}/>
                    <HStack borderRadius={4} width={SW - 55} bgColor={'#eaeaea'} justifyContent={'space-between'}
                            alignItems={'center'}
                            paddingRight={2}>
                        <TextInput secureTextEntry={hidePassword} defaultValue={password}
                                   onChangeText={text => setPassword(text)}
                                   style={{
                                       width: SW - 88,
                                       backgroundColor: '#eaeaea',
                                       borderRadius: 6,
                                       fontSize: 14,
                                       paddingVertical: 12,
                                       paddingHorizontal: 6
                                   }} placeholder={'Mật khẩu'}/>
                        <TouchableOpacity onPress={() => {
                            setHidePassword(c => !c)
                        }}>
                            <Ionicons name={hidePassword ? 'eye-off-sharp' : 'eye-sharp'} color={'#969696'} size={24}/>
                        </TouchableOpacity>
                    </HStack>
                    <HStack width={SW - 55} my={3}>
                        <HStack w={(SW - 55) / 2}>
                            <Checkbox value={re} onChange={(value) => {
                                setRe(value)
                            }}/>
                            <Text ml={2}>Ghi nhớ đăng nhập</Text>
                        </HStack>
                        <HStack w={(SW - 55) / 2} justifyContent={'flex-end'}>
                            <Text color={'#4b74ff'} textDecorationLine={'underline'}>Quên mật khẩu?</Text>
                        </HStack>
                    </HStack>
                    <TouchableOpacity activeOpacity={1} onPress={login} style={{
                        backgroundColor: '#ff9d25', width: SW - 55, paddingVertical: 12, borderRadius: 6
                    }}>
                        {authStore.isFetching ? <ActivityIndicator size={21} color={'white'}/> :
                            <Text color={'white'} textAlign={'center'}>Đăng nhập</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={handleToReg}>
                        <Text>Đăng ký</Text>
                    </TouchableOpacity>
                </VStack>
            </KeyboardAvoidingView>
        </WrapperLayout>
    )
}
export default observer(LoginScreen)
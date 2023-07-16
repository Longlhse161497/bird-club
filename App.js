import {StatusBar} from 'expo-status-bar';
import {LogBox, StyleSheet, Text, View} from 'react-native';
import {observer} from 'mobx-react';
import {Box, Center, NativeBaseProvider} from "native-base";
import {NavigationContainer} from "@react-navigation/native";
import authStore from "./src/viewmodels/AuthStore";
import AppRoute from "./src/routes/AppRoute";
import AuthRoute from "./src/routes/AuthRoute";
import Toast from "react-native-toast-message";
import {useLayoutEffect} from "react";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import {AUTH_KEY} from "./src/utils/auth.const.app";

function App() {
    LogBox.ignoreAllLogs(true)
    useLayoutEffect(() => {
        const bs = async () => {
            const raw_data = await asyncStorage.getItem(AUTH_KEY);
            if (raw_data != null) {
                const data = JSON.parse(raw_data);
                await authStore.login(data.email, data.password, true)
            }
        }
        bs()
    }, [])
    useLayoutEffect(() => {

    }, [authStore.isLogin])
    return (
        <NativeBaseProvider>
            <NavigationContainer>
                {authStore.getIsLogin() ? <AppRoute/> : <AuthRoute/>}
            </NavigationContainer>
            <Toast/>
        </NativeBaseProvider>
    );
}

export default observer(App)

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    },
});

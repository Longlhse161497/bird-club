import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import {observer} from "mobx-react";

const AuthRoute = () => {

    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name={'login'} component={LoginScreen}/>
            <Stack.Screen name={'reg'} component={RegisterScreen}/>
        </Stack.Navigator>
    )

}
export default observer(AuthRoute)
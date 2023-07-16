import {observer} from "mobx-react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import CreateEventScreen from "../screens/CreateEventScreen";

const HomeRoute = (props) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name={'home_nav'} component={HomeScreen}/>
            <Stack.Screen name={'create_post'} component={CreatePostScreen}/>
            <Stack.Screen name={'create_event'} component={CreateEventScreen}/>
        </Stack.Navigator>
    )
}
export default observer(HomeRoute)
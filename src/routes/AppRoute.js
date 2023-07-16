import HomeScreen from "../screens/HomeScreen";
import EventScreen from "../screens/EventScreen";
import ProfileScreen from "../screens/ProfileScreen";
import {observer} from "mobx-react";
import {createMaterialBottomTabNavigator} from "react-native-paper/react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeRoute from "./HomeRoute";

const AppRoute = (props) => {
    const Tab = createMaterialBottomTabNavigator()
    const screenOptions = ({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        hideKeyboardOnSwipe: true,
        tabBarIcon: ({focused, color, size}) => {
            let iconName;
            switch (route.name) {
                case 'home':
                    iconName = focused ? 'home-sharp' : 'home-outline'
                    break;
                case 'event':
                    iconName = focused ? 'paper-plane-sharp' : 'paper-plane-outline'
                    break;
                case 'profile':
                    iconName = focused ? 'person-circle-sharp' : 'person-circle-outline'
                    break;
            }

            return <Ionicons name={iconName} size={24} color={'black'}/>;
        },
    })

    return (<Tab.Navigator
        activeColor="black"
        inactiveColor="#000000"
        screenOptions={screenOptions}
        barStyle={{backgroundColor: '#f9f9f9'}}
    >
        <Tab.Screen name={'home'} component={HomeRoute}/>
        <Tab.Screen name={'event'} component={EventScreen}/>
    </Tab.Navigator>)
}
export default observer(AppRoute)
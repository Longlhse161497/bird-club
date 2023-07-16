import {observer} from "mobx-react";
import {SafeAreaView} from "react-native";

const WrapperLayout = (props) => {
    return (
        <SafeAreaView style={{flex: 1, marginVertical: 12, backgroundColor: props?.bg}}>
            {props.children}
        </SafeAreaView>
    )
}
export default observer(WrapperLayout)
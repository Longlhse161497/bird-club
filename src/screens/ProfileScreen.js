import {Box, Center} from "native-base";
import {observer} from "mobx-react";

const ProfileScreen = (props) => {
    return (
        <Box flex={1}>
            <Center>profile screen</Center>
        </Box>
    )
}
export default observer(ProfileScreen)
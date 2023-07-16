import {observer} from "mobx-react";
import {Box, HStack, Text} from "native-base";
import {Image, TouchableOpacity} from "react-native";
import avt from '../images/default_avt.png'
import {SW} from "../utils/layout.const.app";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useCallback, useMemo, useRef} from "react";
import BottomSheet from "@gorhom/bottom-sheet";

const UserBar = ({user, handleOpen, handleClose}) => {


    return (
        <TouchableOpacity onPress={handleOpen} activeOpacity={.7} style={{marginBottom: 12}}>
            <HStack space={3} width={SW - 22} shadow={6} justifyContent={'space-between'} alignItems={'center'}
                    borderRadius={6}
                    backgroundColor={'white'} p={2}>
                <HStack space={3} alignItems={'center'} justifyContent={'center'}>
                    <Image source={avt} style={{borderRadius: 50, width: 50, height: 50, objectFit: "cover"}}/>
                    <Text textAlign={'center'} fontWeight={'semibold'} fontSize={16}>{user.username}</Text>
                </HStack>
                <TouchableOpacity>
                    <Ionicons size={24} color={'#808080'} name="chevron-down-circle"></Ionicons>
                </TouchableOpacity>
            </HStack>
        </TouchableOpacity>

    )
}
export default observer(UserBar)
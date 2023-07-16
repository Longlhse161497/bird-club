import {observer} from "mobx-react";
import {HStack, Text, VStack} from "native-base";
import {Alert, Image, TouchableOpacity} from "react-native";
import avt from '../images/logo.png'
import {SW} from "../utils/layout.const.app";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useLayoutEffect, useState} from "react";
import authStore from "../viewmodels/AuthStore";
import eventStore from "../viewmodels/EventStore";
import Toast from "react-native-toast-message";

const EventCpn = ({event}) => {
    const [showTool, setShowTool] = useState(true)
    const [hasJoin, setHasJoin] = useState(false);

    const handleJoinEvent = async () => {
        if (event.lock) {
            Toast.show({type: 'error', text2: 'Sự kiện đã khóa'})
            return;
        }
        if (!hasJoin) {
            if (event.time.timeEnd > Date.now()) {
                await eventStore.joinEvent(event.id, authStore.user.id)
            } else {
                Toast.show({type: 'error', text2: 'Sự kiện đã kết thúc'})
            }
        } else {
            Toast.show({
                type: 'error',
                text2: 'Bạn đã tham gia rồi!'
            })
        }
    }
    const handleRemoveEvent = async () => {
        Alert.alert("Xóa", "Bạn có thực sự muốn xóa sự kiện?", [
            {
                style: 'destructive', text: 'Xóa', onPress: async () => {
                    await eventStore.removeEvent(event.id)
                }
            },
            {
                style: 'default', text: 'Cancel', onPress: () => {
                }
            }
        ])
    }
    const handleLockEvent = async () => {
        if (!event.lock) {
            await eventStore.lockEvent(event.id)
        }
    }

    useLayoutEffect(() => {
        for (let j = 0; j < event?.userJoins.length; j++) {
            if (event.userJoins[j] === authStore.user.id) {
                setHasJoin(true)
            }
        }
    }, [])
    return (<VStack space={2} alignItems={'center'} w={SW - 22} mx={2} px={2} py={2} borderRadius={4}
                    backgroundColor={'white'}
                    shadow={9}>
            <HStack space={2} justifyContent={'space-between'}

            >
                <Image source={avt}
                       style={{
                           marginTop: 4,
                           width: 50,
                           height: 50,
                           objectFit: 'cover',
                           borderRadius: 4,
                           backgroundColor: '#b9b9b9'
                       }}/>
                <VStack space={1} width={'70%'}>
                    <HStack w={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                        <Text maxW={'60%'} fontWeight={'semibold'} fontSize={16} color={'black'}>
                            {event?.title}
                        </Text>
                        <Text maxW={'40%'} fontSize={12} color={'black'}>
                            {event?.userJoins.length} người tham gia
                        </Text>
                    </HStack>
                    <Text fontWeight={'light'} fontSize={12} color={'gray.400'}>
                        {new Date(event?.time.timeStart).toLocaleString()} - {new Date(event?.time.timeEnd).toLocaleString()}
                    </Text>
                    <Text maxW={'100%'} fontWeight={'light'} fontSize={12} color={'gray.400'}>
                        {event?.location}
                    </Text>
                </VStack>
                <TouchableOpacity onPress={() => {
                    setShowTool(!showTool)
                }} style={{alignSelf: 'center', width: '8%'}}>
                    <Ionicons name={showTool ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'} size={30}/>
                </TouchableOpacity>
            </HStack>
            {showTool === true && (
                <VStack w={'100%'} justifyContent={'center'} borderTopWidth={.2} borderTopColor={'gray.400'}
                        alignItems={'center'}>
                    <Text w={'100%'} maxW={'100%'} px={2}>{event?.content}</Text>
                    <HStack space={1} px={2} py={2} w={'100%'}
                            justifyContent={'space-between'}
                            alignItems={'center'}>
                        <TouchableOpacity
                            onPress={handleJoinEvent}
                            style={{
                                backgroundColor: '#4068ff', paddingVertical: 6, paddingHorizontal: 24, borderRadius: 6
                            }}>
                            <Text
                                color={'white'}>{event.lock ? 'Bị khóa' : event.time.timeEnd < Date.now() ? ("Sự kiện kết thúc") : (hasJoin ? "Đã tham gia" : "Tham gia")}</Text>
                        </TouchableOpacity>

                        {authStore.user.role === "admin" && (<TouchableOpacity
                            onPress={handleRemoveEvent}
                            style={{
                                backgroundColor: 'white',
                                borderColor: '#ff7284',
                                borderWidth: .2,
                                paddingVertical: 6,
                                paddingHorizontal: 24,
                                borderRadius: 6
                            }}>
                            <Text color={'#ff7284'}>Xóa</Text>
                        </TouchableOpacity>)}
                        {authStore.user.role === "admin" && (<TouchableOpacity
                            onPress={handleLockEvent}
                            style={{
                                backgroundColor: '#d5d5d5', paddingVertical: 6, paddingHorizontal: 24, borderRadius: 6
                            }}>
                            <Text color={'white'}>{event.lock ? 'Đã khóa' : 'Khóa sự kiện'}</Text>
                        </TouchableOpacity>)}
                    </HStack>
                </VStack>)}
        </VStack>

    )
}
export default observer(EventCpn)
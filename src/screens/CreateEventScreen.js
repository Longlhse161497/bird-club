import { observer } from "mobx-react";
import { Box, HStack, ScrollView, Text, VStack } from "native-base";
import WrapperLayout from "../layouts/WrapperLayout";
import { ActivityIndicator, Platform, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SW } from "../utils/layout.const.app";
import { useLayoutEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import eventStore from "../viewmodels/EventStore";
import { Event } from '../models/Event'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
const CreateEventScreen = (props) => {

    const [eventName, setEventName] = useState('')
    const [eventContent, setEventContent] = useState('')
    const [timeStart, setTimeStart] = useState(0);
    const [timeEnd, setTimeEnd] = useState(0)
    const [location, setLocation] = useState('')

    const [pickStartDate, setPickStartDate] = useState(true)
    const [pickEnDate, setPickEndDate] = useState(true)


    const [dateStartShow, setDateStartShow] = useState(false);
    const [dateEndShow, setDateEndShow] = useState(false)


    const timeStartChange = (event, date) => {
        const {
            type, nativeEvent: { timestamp },
        } = event;
        setTimeStart(timestamp)
        console.log(event.type)
        if (event.type === "dismissed" || event.type === "set") {
            setDateStartShow(false)
        }
    };
    const timeEndChange = (event, date) => {
        const {
            type, nativeEvent: { timestamp },
        } = event;
        setTimeEnd(timestamp)
        if (event.type === "dismissed" || event.type === "set") {
            setDateEndShow(false)
        }
    };
    const Nav = useNavigation()
    const handleGoBack = () => {
        Nav.goBack();
    }
    const showToast = (type, msg) => {
        Toast.show({
            type: type, text2: msg
        })
    }

    const handleCreateEvent = async () => {
        if (eventName.trim() === "") {
            showToast("error", "Tên sự kiện không được trống!")
            return;
        }
        if (eventContent.trim() === "") {
            showToast("error", "Nội dung sự kiện không được trống!")
            return;
        }
        if (location.trim() === "") {
            showToast("error", "Địa điểm không được trống!")
            return;
        }
        if (timeEnd < timeStart) {
            showToast("error", "Thời gian kết thúc phải lớn hơn thời gian bắt đầu");
            return;
        }
        const event = new Event("", eventName, eventContent, [], { timeStart, timeEnd }, location);
        await eventStore.createEvent(event, Nav)
    }
    useLayoutEffect(() => {
        if (eventStore.notification != null) {
            showToast(eventStore.notification.type, eventStore.notification.msg)
        }
    }, [eventStore.notification])

    return (<WrapperLayout bg={'#e8e8e8'}>
        <HStack w={SW} px={3} py={4} bgColor={'#e8e8e8'} justifyContent={'space-between'} alignItems={'center'}>
            <TouchableOpacity onPress={handleGoBack}>
                <Ionicons name={'close'} size={26} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={async () => {
                    if (!eventStore.fetching) {
                        await handleCreateEvent()
                    }
                }}
                style={{ backgroundColor: '#5972ff', paddingHorizontal: 16, paddingVertical: 3, borderRadius: 4 }}>
                {eventStore.fetching ? <ActivityIndicator color={'white'} size={18} /> :
                    <Text color={'white'}>Tạo</Text>}
            </TouchableOpacity>
        </HStack>
        <ScrollView style={{ backgroundColor: 'white', paddingVertical: 20 }}>
            <VStack space={3} alignItems={'center'}>
                <Box width={SW - 22} backgroundColor={'white'} shadow={3}>
                    <TextInput

                        onChangeText={text => setEventName(text)} placeholder={'Nhập tên sự kiện'}
                        style={{
                            width: '100%', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6
                        }} />
                </Box>
                <Box width={SW - 22} backgroundColor={'white'} shadow={3}>
                    <TextInput onChangeText={text => setLocation(text)}
                        placeholder={'Địa điểm tổ chức sự kiện'}
                        style={{
                            width: '100%', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6
                        }} />
                </Box>
                <Box width={SW - 22} backgroundColor={'white'} shadow={3}>
                    <TextInput
                        onChangeText={text => setEventContent(text)}
                        multiline={true}
                        textAlignVertical="top"
                        placeholder={'Nhập nội dung tóm tắt sự kiện'}
                        style={{
                            minHeight: 150, width: '100%', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 6
                        }} />
                </Box>


                <HStack space={2} justifyContent={'center'} alignItems={'center'} w={'100%'}>
                    <TouchableOpacity
                        onPress={() => {
                            if (Platform.OS === "android") {
                                setDateStartShow(true)
                            }
                        }}
                        style={{
                            backgroundColor: '#5972ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 4
                        }}>
                        <Text
                            color={'white'}>{timeStart === 0 ? 'Thời gian bắt đầu' : new Date(timeStart).toLocaleString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setPickStartDate(!pickStartDate)
                        }}
                        style={{
                            backgroundColor: '#5972ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 4
                        }}>
                        <Text color={'white'}>{pickStartDate ? 'Giờ' : 'Ngày'}</Text>
                    </TouchableOpacity>
                </HStack>
                {Platform.OS === "ios" ?
                    <RNDateTimePicker display={'default'} onChange={timeStartChange}
                        mode={pickStartDate ? 'date' : 'time'}
                        value={timeStart === 0 ? new Date() : new Date(timeStart)}
                        minimumDate={new Date()} />
                    :
                    (dateStartShow && <RNDateTimePicker display={'default'} onChange={timeStartChange}
                        mode={pickStartDate ? 'date' : 'time'}
                        value={timeStart === 0 ? new Date() : new Date(timeStart)}
                        minimumDate={new Date()} />)
                }

                <HStack space={2} justifyContent={'center'} alignItems={'center'} w={'100%'}>
                    <TouchableOpacity
                        onPress={() => {
                            if (Platform.OS === "android") {
                                setDateEndShow(true)
                            }
                        }}
                        style={{
                            backgroundColor: '#5972ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 4
                        }}>
                        <Text
                            color={'white'}>{timeEnd === 0 ? 'Thời gian kết thúc' : new Date(timeEnd).toLocaleString()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setPickEndDate(!pickEnDate)
                        }}
                        style={{
                            backgroundColor: '#5972ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 4
                        }}>
                        <Text color={'white'}>{pickEnDate ? 'Giờ' : 'Ngày'}</Text>
                    </TouchableOpacity>
                </HStack>
                {Platform.OS === "ios" ?
                    <RNDateTimePicker display={'default'} onChange={timeEndChange} mode={pickEnDate ? 'date' : 'time'}
                        value={timeEnd === 0 ? new Date() : new Date(timeEnd)}
                        minimumDate={new Date()} maximumDate={new Date(2030, 10, 20)} />
                    :
                    (dateEndShow && (
                        <RNDateTimePicker display={'default'} onChange={timeEndChange} mode={pickEnDate ? 'date' : 'time'}
                            value={timeEnd === 0 ? new Date() : new Date(timeEnd)}
                            minimumDate={new Date()} maximumDate={new Date(2030, 10, 20)} />
                    ))
                }
            </VStack>
        </ScrollView>
    </WrapperLayout>)
}
export default observer(CreateEventScreen)
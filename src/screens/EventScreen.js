import {observer} from "mobx-react";
import {Box, Center, HStack, ScrollView, Text, VStack} from "native-base";
import {SW} from "../utils/layout.const.app";
import {ActivityIndicator, TextInput} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import EventCpn from "../components/EventCpn";
import {useLayoutEffect, useState} from "react";
import eventStore from "../viewmodels/EventStore";
import authStore from "../viewmodels/AuthStore";
import {generateString} from "../utils/string.utils.app";

const EventScreen = (props) => {
    // data

    useLayoutEffect(() => {
        if (eventStore.events.length === 0) {
            const bs = async () => {
                await eventStore.getAllEvent();
                await eventStore.listenEvent();
            }
            bs()
        }
    }, [])
    useLayoutEffect(() => {
    }, [eventStore.events])


    return (<VStack flex={1} alignItems={'center'} paddingY={8}>
        <HStack pr={2} pl={3} borderRadius={4} backgroundColor={'white'} shadow={8} w={SW - 22}
                justifyContent={'space-between'}
                alignItems={'center'}>
            <TextInput placeholder={'Nhập tên sự kiện'} style={{
                width: '90%', borderRadius: 8, paddingVertical: 12,
            }}/>
            <Ionicons name={'search'} color={'#b9b9b9'} size={24}/>
        </HStack>
        <ScrollView flex={1} contentContainerStyle={{paddingVertical: 12}}>
            <VStack space={3} alignItems={'center'}>
                {eventStore.fetching ?
                    <ActivityIndicator color={'black'} size={28}/>
                    :
                    eventStore.events.map((event) => {
                        return <EventCpn key={generateString(12)} event={event}/>
                    })
                }
            </VStack>
        </ScrollView>
    </VStack>)
}
export default observer(EventScreen)
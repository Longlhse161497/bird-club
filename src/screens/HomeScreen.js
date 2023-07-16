import {
    Box, HStack, ScrollView, Stack, Text, useLayout, VStack
} from "native-base";
import {observer} from "mobx-react";
import WrapperLayout from "../layouts/WrapperLayout";
import {ActivityIndicator, Alert, Platform, TextInput, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useNavigation} from "@react-navigation/native";
import UserBar from "../components/UserBar";
import authStore from "../viewmodels/AuthStore";
import BottomSheet from "@gorhom/bottom-sheet";
import {useLayoutEffect, useMemo, useRef, useState} from "react";
import PostCpn from "../components/PostCpn";
import postStore from "../viewmodels/PostStore";
import {SH, SW} from "../utils/layout.const.app";
import {generateString} from "../utils/string.utils.app";
import PostComment from "../components/PostComment";

const HomeScreen = (props) => {

    const userBarBottomSheet = useRef(null);
    const snapPoints = useMemo(() => ['15%', '50%'], []);
    const postScrollViewRef = useRef(null)
    const commentBottomSheet = useRef(null);

    const openUserBar = () => {
        userBarBottomSheet.current.expand();
    }

    const closeUserBar = () => {
        userBarBottomSheet.current.close()
    }

    const Nav = useNavigation();

    const handleOpenComment = async (id, comments) => {
        // load comment by postId
        console.log(comments)
        postStore.setComments(comments)
        postStore.setCurrentPostIndex(id)
        commentBottomSheet.current.expand()
    }

    useLayoutEffect(() => {
        if (postStore.posts.length === 0) {
            // fetch
            const fetchPost = async () => {
                await postStore.getPost();
            }
            fetchPost();
            postStore.listenPost()
        }
    }, [])

    useLayoutEffect(() => {
    }, [postStore.posts])

    useLayoutEffect(() => {
    }, [postStore.notification])
    // reg snapshoot
    return (
        <WrapperLayout>
            <Box flex={1} alignItems={'center'} py={4}>
                <UserBar user={authStore.user} handleOpen={openUserBar} handleClose={closeUserBar}/>
                {/*generate post*/}
                <ScrollView ref={postScrollViewRef} showsVerticalScrollIndicator={false}
                            onContentSizeChange={() => postScrollViewRef.current.scrollTo({y: 0, animated: true})
                            } contentContainerStyle={{paddingVertical: 0}}>
                    {postStore.posts.map((post) => {
                        return <PostCpn handleOpenComment={handleOpenComment} key={generateString(12)} post={post}/>
                    })}
                </ScrollView>
                {postStore.posts.length === 0 && !authStore.isFetching &&
                    <Text position={'absolute'} w={SW - 22} textAlign={'center'} top={SH / 2 - 10}>Không có tin
                        nào</Text>}
                {/*loader post*/}
                {postStore.fetchingPost === true &&
                    <Box w={SW} h={SH} position={'absolute'} justifyContent={'center'} alignItems={'center'}>
                        <ActivityIndicator color={'black'} size={24}/>
                    </Box>}
                {/*user bar bottom sheet*/}
                <BottomSheet
                    enablePanDownToClose={true}
                    ref={userBarBottomSheet}
                    index={-1}
                    snapPoints={snapPoints}
                >
                    <Box flex={1} bgColor={'white'} py={2} px={3}>
                        <VStack space={2} justifyContent={'center'} alignItems={'center'}>
                            <TouchableOpacity style={{
                                width: '100%'
                            }} onPress={() => {
                                Nav.navigate("create_post")
                            }}>
                                <HStack space={3} w={'100%'} p={2} backgroundColor={'white'} shadow={6} borderRadius={4}
                                        alignItems={'center'}>
                                    <Ionicons name={'add-circle-outline'} color={'#39aaff'} size={30}/>
                                    <Text fontWeight={"semibold"} fontSize={16}>Đăng bài viết</Text>
                                </HStack>
                            </TouchableOpacity>
                            {
                                authStore.user.role === "admin" &&
                                (
                                    <TouchableOpacity style={{
                                        width: '100%'
                                    }} onPress={() => {
                                        Nav.navigate("create_event")
                                    }}>
                                        <HStack space={3} w={'100%'} p={2} backgroundColor={'white'} shadow={6}
                                                borderRadius={4}
                                                justifyContent={'flex-start'} alignItems={'center'}>
                                            <Ionicons name={'add-circle-outline'} color={'#39aaff'} size={30}/>
                                            <Text fontWeight={"semibold"} fontSize={16}>Tạo sự kiện</Text>
                                        </HStack>
                                    </TouchableOpacity>
                                )
                            }
                            <TouchableOpacity style={{
                                width: '100%'
                            }} onPress={() => {
                                Alert.alert("Đăng xuất", "Bạn có muốn đăng xuất?", [{
                                    text: 'Cancel', style: 'destructive', onPress: () => {
                                    }
                                }, {
                                    text: "OK", style: 'default', onPress: async () => {
                                        await authStore.logout()
                                    }
                                }])
                            }}>
                                <HStack space={3} w={'100%'} p={2} backgroundColor={'white'} shadow={6} borderRadius={4}
                                        alignItems={'center'}>
                                    <Ionicons name={'log-out-outline'} color={'#ff3e65'} size={30}/>
                                    <Text fontWeight={"semibold"} fontSize={16}>Đăng xuất</Text>
                                </HStack>
                            </TouchableOpacity>
                        </VStack>
                    </Box>
                </BottomSheet>
                <PostComment bottomRef={commentBottomSheet}/>
            </Box>
        </WrapperLayout>)
}
export default observer(HomeScreen)
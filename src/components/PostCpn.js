import {observer} from "mobx-react";
import {Box, HStack, Text, useLayout, VStack} from "native-base";
import {Alert, Image, TouchableOpacity} from "react-native";
import avt from '../images/default_avt.png'
import {SW} from "../utils/layout.const.app";
import Ionicons from "react-native-vector-icons/Ionicons";
import postStore from "../viewmodels/PostStore";
import authStore from "../viewmodels/AuthStore";
import {useLayoutEffect, useState} from "react";
import {generateString} from "../utils/string.utils.app";

const PostCpn = ({post, handleOpenComment}) => {
    const [hasReact, setHasReact] = useState(false);
    const images = post?.images;
    const handleToRemovePost = async () => {
        Alert.alert("Xóa bài viết", "Bạn có muốn xóa bài viết?", [{
            style: 'default', text: "OK", onPress: async () => {
                await postStore.removePost(post.id);
            }
        }, {
            style: 'destructive', text: "Cancel", onPress: () => {
            }
        },])
    }

    const handleToHidePost = async () => {
        await postStore.hidePost(post.id)
    }
    const handleReaction = async () => {
        setHasReact(true)
        await postStore.reactPost(post.id, authStore.user.id);
    }
    const handleRemoveReaction = async () => {
        setHasReact(false)
        await postStore.unReactionPost(post.id, authStore.user.id)
    }
    useLayoutEffect(() => {
        const bs = async () => {
            let reactions = post?.reactions;
            for (let i = 0; i < reactions.length; i++) {
                if (reactions[i]?.userId === authStore.user.id) {
                    setHasReact(true)
                }
            }
        }
        bs()
    }, [])
    return (
        <VStack my={3} justifyContent={'center'} alignItems={'center'} backgroundColor={'white'} w={SW - 22} borderRadius={9} p={2}>
        <HStack width={'100%'} justifyContent={'space-between'}  px={2}>
            <HStack justifyContent={'center'} alignItems={'center'} space={3}>
                <Image source={avt} style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 10}}/>
                <VStack space={.2} justifyContent={'center'} >
                    <Text fontWeight={"semibold"} fontSize={16}>{post?.user.username}</Text>
                    <Text fontSize={14} color={'gray.300'}>{new Date(post.create_at).toLocaleString()}</Text>
                </VStack>
            </HStack>
            <HStack space={4} justifyContent={'center'} alignItems={'center'}>
                <TouchableOpacity>
                    <Ionicons name={'ellipsis-horizontal'} color={'#808080'} size={22}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                    if (authStore.user.role === "admin") {
                        await handleToRemovePost()
                    } else {
                        await handleToHidePost()
                    }
                }}>
                    <Ionicons name={'close'} color={'#808080'} size={24}/>
                </TouchableOpacity>
            </HStack>
        </HStack>
        <Text px={2} width={'100%'} fontSize={16} my={1}>
            {post?.content}
        </Text>
        <HStack flexWrap={'wrap'} justifyContent={'center'} alignItems={'center'}>
            {images.map((item, index) => {
                let x = 1;
                if (images.length === 1) {
                    x = 1;
                }
                if (images.length === 2) {
                    x = 2;
                }
                if (images.length === 3) {
                    x = 3;
                }
                if (images.length % 2 === 0 && images.length > 2) {
                    x = Math.abs(Math.round(images.length / 2))
                }
                if (images.length % 2 !== 0 && images.length > 3) {
                    x = Math.abs(Math.round(images.length / 3))
                }
                return <Image key={generateString(12)} source={item ? {uri: item} : avt}
                              style={{
                                  margin: 4,
                                  width: ((SW - 12) / x) - 30,
                                  height: ((SW - 12) / x) + 20,
                                  objectFit: 'cover',
                                  borderRadius: 4,
                                  backgroundColor: '#d4d4d4'
                              }}/>
            })}

        </HStack>
        <HStack my={2} width={'100%'} px={2} justifyContent={'space-between'} alignItems={'center'}>
            <HStack space={1}>
                <Ionicons color={'#35a8ff'} name="thumbs-up-sharp" size={16}></Ionicons>
                <Text>{post.reactions.length}</Text>
            </HStack>
            <HStack space={1}>
                <Text fontSize={14}>{post.comments.length} Bình luận</Text>
            </HStack>
        </HStack>
        <Box w={SW - 22} height={.2} bgColor={'gray.300'}/>
        <HStack my={2} width={'100%'} px={2} justifyContent={'space-between'} alignItems={'center'}>
            <TouchableOpacity activeOpacity={1} onPress={async () => {
                if (hasReact) {
                    await handleRemoveReaction();
                } else {
                    await handleReaction();
                }
            }}>
                <HStack w={'100%'} space={2} justifyContent={'center'} alignItems={'center'}>
                    <Ionicons color={hasReact ? '#35a8ff' : 'black'} name="thumbs-up-sharp" size={20}></Ionicons>
                    <Text color={hasReact ? '#35a8ff' : 'black'} fontSize={14}>Thích</Text>
                </HStack>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={async () => {
                await handleOpenComment(post.id, post.comments)
            }}>
                <HStack w={'50%'} space={2} justifyContent={'center'} alignItems={'center'}>
                    <Ionicons color={'black'} name="chatbox-outline" size={20}></Ionicons>
                    <Text fontSize={14}>Bình luận</Text>
                </HStack>
            </TouchableOpacity>
        </HStack>
    </VStack>)
}
export default observer(PostCpn)
import BottomSheet from "@gorhom/bottom-sheet";
import {Box, KeyboardAvoidingView, ScrollView, VStack} from "native-base";
import {Platform, TouchableOpacity} from "react-native";
import CommentCPN from "./CommentCPN";
import {generateString} from "../utils/string.utils.app";
import CommentWriter from "./CommentWriter";
import {observer} from "mobx-react";
import postStore from "../viewmodels/PostStore";
import {Comment} from "../models/Post";
import authStore from "../viewmodels/AuthStore";
import {useMemo, useRef} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const PostComment = ({bottomRef}) => {
    const sp = useMemo(() => ['50%', '100%'], []);
    const commentScrollViewRef = useRef(null)
    const handleCreateComment = async () => {
        setTimeout(async () => {
            let commentContent = postStore.comment;
            postStore.setComment('')
            const comment_ = new Comment(generateString(12), commentContent, authStore.user, [])
            await postStore.addComment(postStore.currentPostIndex, comment_)
        }, 100)
    }
    return (
        <BottomSheet
            onChange={(state) => {
                if (state === -1) {
                    postStore.setComments([])
                }
            }}
            enablePanDownToClose={true}
            ref={bottomRef}
            index={-1}
            snapPoints={sp}
        >
            <KeyboardAvoidingView style={{flex: 1, backgroundColor: 'transparent'}}
                                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {Platform.OS === 'android' &&
                    <TouchableOpacity onPress={()=>{bottomRef.current.close()}} style={{alignSelf: 'flex-end', paddingHorizontal: 12}}>
                        <Ionicons name={'close'} size={24}/>
                    </TouchableOpacity>
                }
                <Box flex={1} bgColor={'white'} py={2} px={3}>
                    <ScrollView
                        onContentSizeChange={() => commentScrollViewRef.current.scrollToEnd({animated: true})}
                        ref={commentScrollViewRef} contentContainerStyle={{paddingBottom: 100}}
                        showsVerticalScrollIndicator={false}>
                        <VStack space={2} flex={.9} justifyContent={'center'} alignItems={'center'}
                                w={'100%'}
                                p={2}>
                            {postStore.comments.map((comment) => {
                                return (<CommentCPN key={generateString(12)} comment={comment}/>)
                            })}
                        </VStack>
                    </ScrollView>
                    <CommentWriter
                        handleCreateComment={handleCreateComment}/>
                </Box>
            </KeyboardAvoidingView>
        </BottomSheet>
    )
}
export default observer(PostComment)
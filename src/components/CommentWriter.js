import {HStack} from "native-base";
import {ActivityIndicator, TextInput, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {observer} from "mobx-react";
import postStore from "../viewmodels/PostStore";
import authStore from "../viewmodels/AuthStore";

const CommentWriter = ({pushingComment, handleCreateComment}) => {
    return (
        <HStack position={'absolute'} zIndex={10} backgroundColor={'white'} bottom={0} flex={.1}
                borderTopColor={'gray.400'} borderTopWidth={.2} paddingTop={4}
                paddingBottom={12}
                space={1}
                alignSelf={'center'}
                justifyContent={'space-between'}
                w={'100%'}
                alignItems={'center'}>
            <TextInput
                defaultValue={postStore.comment}
                onChangeText={text => postStore.setComment(text)}
                placeholder={"Viết bình luận"}
                style={{
                    width: '86%',
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 50,
                    backgroundColor: "#e7e7e7"
                }}
            />
            <TouchableOpacity onPress={handleCreateComment} style={{
                backgroundColor: '#4e48ff', paddingVertical: 12, paddingHorizontal: 13, borderRadius: 8
            }}>
                <Ionicons name={'paper-plane-sharp'} color={'white'} size={18}/>
            </TouchableOpacity>
        </HStack>
    )
}
export default observer(CommentWriter);
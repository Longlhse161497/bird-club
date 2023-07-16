import {HStack, Text, VStack} from "native-base";
import {Image} from "react-native";
import avatar from '../images/default_avt.png'

const CommentCPN = ({comment}) => {
    return (
        <HStack space={2} w={'100%'}>
            <Image source={avatar}
                   style={{backgroundColor: '#cecece', objectFit: 'cover', borderRadius: 50, width: 30, height: 30}}/>
            <VStack w={'auto'} maxW={'90%'} backgroundColor={'gray.200'} py={1} px={2} borderRadius={8}
                    justifyContent={'center'}
            >
                <Text fontWeight={"semibold"} fontSize={12} mb={.5}>{comment.user.username}</Text>
                <Text width={'100%'} fontSize={12}>{comment.content}</Text>
            </VStack>
        </HStack>
    )
}
export default CommentCPN;
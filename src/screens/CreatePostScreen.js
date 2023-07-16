import {observer} from "mobx-react";
import {Box, FlatList, HStack, ScrollView, Text, VStack} from "native-base";
import WrapperLayout from "../layouts/WrapperLayout";
import {ActivityIndicator, Image, TextInput, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import avt from '../images/default_avt.png';
import {SW} from "../utils/layout.const.app";
import {useLayoutEffect, useMemo, useState} from "react";
import {Alert} from 'react-native'
import {useNavigation} from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker'
import {Post} from "../models/Post";
import Toast from "react-native-toast-message";
import {uploadBytes, ref, getDownloadURL} from 'firebase/storage'
import {db, storage} from "../../firebase.config.app";
import {generateString} from "../utils/string.utils.app";
import authStore from "../viewmodels/AuthStore";
import {addDoc, collection, setDoc} from 'firebase/firestore'
import {COLLECTIONS} from "../services/RootService";

const CreatePostScreen = (props) => {
    const [change, setIsChange] = useState(false)
    const [images, setImages] = useState([])
    const Nav = useNavigation();
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')
    const imageCloud = []
    const handleToClose = () => {
        if (loading) {
            return;
        }
        if (change) {
            Alert.alert("Thông báo", "Bạn có muốn hủy?", [{
                text: 'OK', style: 'default', onPress: () => {
                    Nav.goBack();
                }
            }, {
                text: 'Cancel', style: 'destructive', onPress: () => {
                }
            }])
        } else {
            Nav.goBack();
        }
    }
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [3, 4], quality: 1
        })
        if (!result.canceled) {
            let imgs = [...images]
            imgs.push({uri: result.assets[0].uri, name: generateString(12) + ".png"})
            setImages(imgs)
        }
    }
    const handleUploadImage = async () => {
        for (const image of images) {
            const res = await fetch(image.uri);
            const blob = await res.blob();
            const storageRef = ref(storage, "upload/" + image.name)
            const uploadRef = await uploadBytes(storageRef, blob)
            const downloadUrl = await getDownloadURL(uploadRef.ref)
            imageCloud.push(downloadUrl)
        }
    }
    const createPost = async (post) => {
        await addDoc(collection(db, COLLECTIONS.postCollection), Object.assign({}, post))
    }
    const handleCreatePost = async () => {
        try {
            if (content.trim() === "") {
                Toast.show({
                    type: "error", text2: "Nội dung không được để trống"
                })
                return;
            }
            if (images.length === 0) {
                Toast.show({
                    type: "error", text2: "Hãy thêm ít nhất một ảnh"
                })
                return;
            }

            setLoading(true)
            // push image before
            await handleUploadImage();
            console.log(imageCloud)
            const post = new Post("", "", content, [], 0, [], imageCloud, authStore.user.id)
            // push post
            await createPost(post)
            setLoading(false)
            Toast.show({
                type: "success", text2: "Đã đăng tin"
            })
            Nav.goBack();
        } catch (e) {
            setLoading(false)
            Toast.show({
                type: "error", text2: "Có lỗi xảy ra hãy thử lại sau"
            })
            console.log(e)
        }
    }

    const tools = [{
        id: 1, icon: 'image-sharp', color: '#00dca9', handle: pickImage
    }, {
        id: 2, icon: 'musical-notes-sharp', color: '#db2d00'
    }, {
        id: 3, icon: 'location-sharp', color: "#ff724e"
    }, {
        id: 4, icon: 'person-add-sharp', color: '#6f5cff'
    }];
    const ToolItem = ({item}) => {
        return (<TouchableOpacity onPress={item?.handle}>
            <Ionicons name={item.icon} size={28} color={item.color}/>
        </TouchableOpacity>)
    }


    useLayoutEffect(() => {
    }, [images])

    const ImageItem = ({item: imageItem}) => {
        return (<Image style={{backgroundColor: '#cccccc', borderRadius: 6, margin: 4}} source={{uri: imageItem.uri}}
                       width={80}
                       height={80}/>)
    }
    return (<WrapperLayout>
        <HStack borderBottomWidth={.2} borderBottomColor={'gray.300'} flex={.07} bgColor={'gray.100'} px={2} py={2}
                justifyContent={'space-between'}
                alignItems={'center'}>
            <TouchableOpacity onPress={handleToClose}>
                <Ionicons name={'close'} color={'black'} size={26}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                !loading ? handleCreatePost() : () => {
                }
            }} style={{
                backgroundColor: '#ff9d25', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 3
            }}>
                {loading ? <ActivityIndicator size={21} color={'white'}/> : <Text color={'white'}>Đăng</Text>}
            </TouchableOpacity>
        </HStack>
        <ScrollView showsVerticalScrollIndicator={false} backgroundColor={'white'} flex={.97}
                    _contentContainerStyle={{paddingY: 2, backgroundColor: 'white'}}>
            <VStack px={2} alignItems={'center'}>
                <HStack marginBottom={2} width={'100%'}  alignItems={'center'}>
                    <Image source={avt} alt={'image'}
                           style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 50}}/>
                    <VStack>
                        <Text color={'black'} fontWeight={'semibold'} ml={2}
                              fontSize={16}>{authStore.user.username}</Text>
                        <Text color={'gray.400'} fontStyle={'italic'} ml={2}
                              fontSize={14}>{authStore.user.email}</Text>
                    </VStack>
                </HStack>
                {/*    text edit*/}
                <TextInput defaultValue={content} onChangeText={text => setContent(text)}
                           style={{minHeight: 200, backgroundColor: 'white', width: '100%', fontSize: 16}}
                           placeholder={"Bạn viết gì đi ..."} textAlignVertical={'bottom'} multiline={true}/>
                <HStack width={SW - 8}  alignItems={'center'} flexWrap={'wrap'}>
                    {images.map((item) => {
                        return (<ImageItem key={generateString(3)} item={item}/>)
                    })}
                </HStack>
            </VStack>
        </ScrollView>
        <HStack left={(SW / 2) - ((SW - 200) / 2)} position={'absolute'} bottom={10} space={3} w={SW - 200}
                backgroundColor={'white'} borderRadius={6}
                py={1} shadow={9}
                justifyContent={'center'}
                alignItems={'center'}>
            {tools.map((item) => {
                return <ToolItem item={item}/>
            })}
        </HStack>
    </WrapperLayout>)
}
export default observer(CreatePostScreen)
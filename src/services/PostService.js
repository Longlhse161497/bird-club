import {collection, query, where, getDocs, doc, getDoc, deleteDoc} from 'firebase/firestore'
import {db} from "../../firebase.config.app";
import {COLLECTIONS} from "./RootService";
import userService from "./UserService";

class PostService {
    async getAllPost() {
        try {
            const listPost = []
            const q = query(collection(db, COLLECTIONS.postCollection))
            const querySnapshot = await getDocs(q)
            for (let docSnap of querySnapshot.docs) {
                let post = docSnap.data();
                post.id = docSnap.id;
                const user = await userService.getUserById(post?.userId)
                post = {...post, user: user}
                listPost.push(post)
            }
            return listPost;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    async removePost(id) {
        try {
            await deleteDoc(doc(db, COLLECTIONS.postCollection, id));
            return true;
        } catch (e) {
            console.log(e)
            return false;
        }
    }
}

const postService = new PostService();
export default postService;
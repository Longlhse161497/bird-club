import {doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from "../../firebase.config.app";
import {COLLECTIONS} from "./RootService";

class UserService {
    async getUserById(uid) {
        try {
            const result = await getDoc(doc(db, COLLECTIONS.userCollection, uid))
            return (result != null && result.exists()) ? result.data() : null;
        } catch (e) {
            return null;
        }
    }

    async createNewUser(user) {
        try {
            console.log(user)
            await setDoc(doc(db, COLLECTIONS.userCollection, user.id), Object.assign({}, user));
            return true;
        } catch (e) {
            console.log(e)
            return null;
        }
    }
}

const userService = new UserService();
export default userService;
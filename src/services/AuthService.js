import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from "../../firebase.config.app";

class AuthService {
    async login(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            if (result != null) {
                return result?.user
            }
        } catch (e) {
            return null;
        }

    }

    async reg(email, password) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return result == null ? null : result?.user
        } catch (e) {
            return null;
        }

    }
}

const authService = new AuthService();
export default authService;
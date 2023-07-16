import {collection} from 'firebase/firestore'
import {db, auth} from "../../firebase.config.app";

export const COLLECTIONS = {
    postCollection: 'posts',
    eventCollection: 'events',
    userCollection: 'users',
    clubCollection: 'clubs'
}


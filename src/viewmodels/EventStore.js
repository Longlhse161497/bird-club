import {makeAutoObservable} from "mobx";
import {addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc} from "firebase/firestore";
import {db} from "../../firebase.config.app";
import {COLLECTIONS} from "../services/RootService";
import userService from "../services/UserService";

class EventStore {

    events = []

    fetching = false;

    notification = null;

    constructor() {
        makeAutoObservable(this)
    }

    setFetching = (val) => {
        this.fetching = val
    }

    setEvents = (val) => {
        this.events = val;
    }

    async createEvent(event, nav) {
        try {
            this.setFetching(true)
            setTimeout(async () => {
                await addDoc(collection(db, COLLECTIONS.eventCollection), Object.assign({}, event));
                this.setFetching(false)
                this.setNotification({type: 'success', msg: 'Tạo sự kiện thành công!'})
                nav.goBack();
            }, 300)
        } catch (e) {
            console.log(e)
            this.setFetching(false)
            this.setNotification({type: 'error', msg: 'Có lỗi xảy ra!'})
        }
    }

    setNotification = (val) => {
        this.notification = val
    }

    async getAllEvent() {
        try {
            this.setFetching(true)
            setTimeout(async () => {
                const listEvent = [];
                const result = await getDocs(query(collection(db, COLLECTIONS.eventCollection)));
                if (result.docs.length > 0) {
                    for (let docSnap of result.docs) {
                        listEvent.push({...docSnap.data(), id: docSnap.id})
                    }
                }
                this.setEvents(listEvent)
                this.setFetching(false)
            }, 500)
        } catch (e) {
            console.log(e)
            this.setFetching(false)
        }

    }

    async listenEvent() {
        const q = query(collection(db, COLLECTIONS.eventCollection));
        let listEvent = [...this.events]
        let isChange = false;
        onSnapshot(q, async (querySnapshot) => {
            listEvent = []
            for (let docSnap of querySnapshot.docs) {
                const event = docSnap.data();
                event.id = docSnap.id;
                listEvent.push(event)
            }
            this.setEvents(listEvent)
        });
    }


    async joinEvent(eventId, userId) {
        let events_ = [...this.events]
        let eventUpdate = null;
        for (let event of events_) {
            if (event.id === eventId) {
                event.userJoins.push(userId)
                eventUpdate = event;
            }
        }
        await updateDoc(doc(db, COLLECTIONS.eventCollection, eventId), eventUpdate)
    }

    async removeEvent(id) {
        await deleteDoc(doc(db, COLLECTIONS.eventCollection, id))
    }

    async lockEvent(id, event) {
        await updateDoc(doc(db, COLLECTIONS.eventCollection, id), {...event, lock: true})
    }
}

const eventStore = new EventStore();
export default eventStore;

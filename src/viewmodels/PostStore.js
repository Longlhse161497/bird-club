import {makeAutoObservable, toJS} from "mobx";
import postService from "../services/PostService";
import {query, collection, onSnapshot, updateDoc, doc} from 'firebase/firestore'
import {db} from "../../firebase.config.app";
import {COLLECTIONS} from "../services/RootService";
import userService from "../services/UserService";
import {Reaction} from "../models/Post";

class PostStore {

    posts = [];

    fetchingPost = false;

    notification = {}

    comment = ''

    comments = []

    currentPostIndex = ''

    constructor() {
        makeAutoObservable(this)
    }

    setCurrentPostIndex = (id) => {
        this.currentPostIndex = id;
    }
    setComments = (val) => {
        this.comments = val;
    }
    setFetching = (value) => {
        this.fetchingPost = value;
    }
    setPosts = (value) => {
        this.posts = value;
    }
    setComment = (val) => {
        this.comment = val
    }

    getPost = async () => {
        try {
            this.setFetching(true)
            setTimeout(async () => {
                const reps = await postService.getAllPost();
                if (reps != null && reps.length > 0) {
                    this.posts = reps;
                }
                this.setFetching(false)
            }, 500)
        } catch (e) {
            console.log(e)
            this.setFetching(false)
        }
    }

    listenPost() {
        const q = query(collection(db, COLLECTIONS.postCollection));
        const listPost = [...this.posts]
        let isChange = false;
        onSnapshot(q, async (querySnapshot) => {
            for (let docSnap of querySnapshot.docChanges()) {
                console.log(docSnap.type)
                if (docSnap.type === "added") {
                    let post = docSnap.doc.data();
                    post.id = docSnap.doc.id;
                    const user = await userService.getUserById(post?.userId)
                    post = {...post, user: user}
                    listPost.push(post)
                    isChange = true;
                }
                if (docSnap.type === "modified") {
                    // update
                    isChange = false;
                }
                if (docSnap.type === "removed") {
                    const id = docSnap.doc.id;
                    for (let i = 0; i < listPost.length; i++) {
                        if (listPost[i].id === id) {
                            listPost.splice(i, 1)
                        }
                    }
                    isChange = true;
                }
            }
            if (isChange) {
                this.setPosts(listPost)
            }
        })
    }

    async removePost(id) {
        await postService.removePost(id);
    }

    async hidePost(id) {
        const remove_posts = [...this.posts]
        for (let i = 0; i < remove_posts.length; i++) {
            if (remove_posts[i].id === id) {
                console.log(remove_posts[i])
                remove_posts.splice(i, 1)
            }
        }
        this.setPosts(remove_posts)
    }

    async reactPost(postId, userId) {
        const reaction = new Reaction("", userId)
        let post = {};
        for (let i = 0; i < this.posts.length; i++) {
            if (this.posts[i].id === postId) {
                post = this.posts[i];
            }
        }
        post.reactions.push(Object.assign({}, reaction))
        await updateDoc(doc(db, COLLECTIONS.postCollection, postId), post)
    }

    async addComment(postId, comment) {
        const posts_ = [...this.posts];
        let post = {}
        for (let i = 0; i < posts_.length; i++) {
            if (posts_[i].id === postId) {
                post = posts_[i];
            }
        }
        post.comments.push(Object.assign({}, comment))
        await updateDoc(doc(db, COLLECTIONS.postCollection, postId), post)
    }

    async unReactionPost(postId, userId) {
        let post = {};
        let posts = [...this.posts]
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === postId) {
                post = posts[i]
            }
        }
        console.log(post.reactions)
        for (let j = 0; j < post.reactions.length; j++) {
            if (post.reactions[j].userId === userId) {
                post.reactions.splice(j, 1)
            }
        }
        console.log(post)
        await updateDoc(doc(db, COLLECTIONS.postCollection, postId), post)
    }
}

const postStore = new PostStore();
export default postStore;
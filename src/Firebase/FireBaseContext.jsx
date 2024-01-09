import { createContext, useContext, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, } from "firebase/firestore"
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"
import { getStorage, deleteObject } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBwzbJD426lRkou9xJJOmyTH1ybE8Jle0Y",
    authDomain: "social-media-ed952.firebaseapp.com",
    projectId: "social-media-ed952",
    storageBucket: "social-media-ed952.appspot.com",
    messagingSenderId: "829504777867",
    appId: "1:829504777867:web:a018abfd66911fa9d1ae8e"
};

const Context = createContext()
const app = initializeApp(firebaseConfig);

export const useFireBase = () => {
    return useContext(Context)
}

const db = getFirestore(app)
const Col = collection(db, "users")
const auth = getAuth(app)

export const FireBaseProvider = ({ children }) => {



    const [loader, setLoader] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [userID, setUserId] = useState(null)
    const [info, setInfo] = useState()
    const [userDoc, setUserDoc] = useState("")
    const [allPost, setAllPost] = useState([])
    const [userData, setAllUserData] = useState([])
    const [myPost, setMyPost] = useState([])
    const SignUp = async (email, pass, userName) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass)
            const userId = res.user.uid
            setUserDoc(userID)
            const docRef = await addDoc(Col, {
                userName: userName,
                uid: userId,
                friends: []
            })

            alert("Account Created Please Login")
        } catch (error) {
            alert(error)
        }
        finally {
            setLoader(false)
        }
    }

    const Login = async (email, pass) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass)
            setIsLogin(true)
            alert("login success")
        } catch (error) {
            console.log(error)
        }
    }
    const checkLogin = async () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLogin(true)
                setUserId(user.uid)
            }
            else {
                setIsLogin(false)
            }
        })
    }

    const Logout = async () => {
        try {
            await signOut(auth)
            setIsLogin(false)
            setUserId(null)
            localStorage.removeItem('userData')
        } catch (error) {
            console.log(error)
        }
    }

    const GetUserInfo = async (id) => {

        try {
            const q = query(Col, where("uid", '==', id))
            const querySnapShots = await getDocs(q)
            const userInfo = querySnapShots.docs.map((doc) => {
                return { ...doc.data(), id: doc.id }
            })
            setInfo(userInfo)
            localStorage.setItem("userData", JSON.stringify(userInfo))
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }

    }

    const uploadeImage = async (imageName, image) => {
        try {
            const storage = getStorage(app)
            const imageRef = ref(storage, `images/${imageName + v4()}`)

            await uploadBytes(imageRef, image)

            const url = await getDownloadURL(imageRef)
            return url
        } catch (error) {
            console.log(error)
        }

    }

    const uploadPost = async (dec, url, id, userName, userId) => {
        try {
            const subCol = collection(db, 'users', id, "post")
            const res = await addDoc(subCol, {
                userName: userName,
                caption: dec,
                ImgUrl: url,
                likes: 0,
                time: new Date().getTime(),
                Comments: [],
                userLiked: [],
                userId: userId,
            })

            console.log(res.id)

            await updateDoc(doc(db, 'users', id, "post", res.id), {
                postId: res.id
            })


        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }

    }

    const getAllPost = async () => {
        try {
            const users = await getDocs(Col)
            const userPromises = users.docs.map(async (user) => {
                let userCollRef = collection(db, `users/${user.id}/post`);
                const groupDocs = await getDocs(userCollRef);
                const allPost = groupDocs.docs.map((item) => {
                    return item.data()
                });
                return allPost
            });

            const usersData = await Promise.all(userPromises);
            return usersData
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }
    }


    const postLike = async (postOwnerId, postId, likes, userId) => {
        try {
            const postRef = doc(db, 'users', postOwnerId, "post", postId)
            const docSnap = await getDoc(postRef)
            const post = docSnap.data()



            if (post.userLiked.includes(userId)) {

                const res = await updateDoc(postRef, {
                    likes: likes - 1,
                    userLiked: post.userLiked.filter((id) => {
                        return id !== userId
                    })
                })
            }
            else {

                const res = await updateDoc(postRef, {
                    likes: likes + 1,
                    userLiked: [...post.userLiked, userId]
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const getAllUsers = async () => {
        try {
            const allUserSnaps = await getDocs(Col)
            const data = allUserSnaps.docs.map((user) => {
                return { ...user.data(), id: user.id }
            })
            setAllUserData(data)
        } catch (error) {
            console.log(error)
        }
    }






    const addComments = async (postOwnerId, postId, userId, comment, logUser) => {
        try {

            const postRef = doc(db, 'users', postOwnerId, "post", postId)
            const docSnap = await getDoc(postRef)
            const post = docSnap.data()
            await updateDoc(postRef, {
                Comments: [...post.Comments, { userId: userId, comment: comment, user: logUser }]
            })

        } catch (error) {
            console.log(error)
        }
    }

    const getMyPost = async (id) => {
        console.log(id)
        try {
            const postRef = collection(db, "users", id, "post")
            const res = await getDocs(postRef)
            const myPostData = res.docs.map((data) => {
                return data.data()
            })
            setMyPost(myPostData)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }
    }


    const deletePost = async (userId, postId) => {
        try {
            await deleteDoc(doc(db, "users", userId, "post", postId))
            setMyPost((prev) => {
                return prev.filter((post) => {
                    return post.postId !== postId
                })
            })
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }
    }

    const deleteImg = async (imgUrl) => {

        try {
            console.log(imgUrl)
            const storage = getStorage(app)
            const deletetRef = ref(storage, imgUrl);
            await deleteObject(deletetRef)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }
    }


    // const updateImageUpload = async (imageName,image) => {
    //     try {

    //         const storage = getStorage(app)
    //         const imageRef = ref(storage, `${imageName + v4()}`)

    //         await uploadBytes(imageRef, image)

    //         const url = await getDownloadURL(imageRef)
    //         return url

    //     } catch (error) {

    //         console.log(error)
    //     }
    // }

    const upDatePost = async (userId, postId, cap, img) => {
        try {
            const postRef = doc(db, "users", userId, "post", postId)
            await updateDoc(postRef, {
                caption: cap,
                ImgUrl: img
            })
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoader(false)
        }
    }

    const addFriend = async (userId, user) => {
        try {
            const friendsRef = doc(db, "users", userId)
            const snap = await getDoc(friendsRef)

            const isExist = snap.data().friends.find((friend) => {
                return friend.id === user.id
            })

            if (!isExist) {
                const newfriend = [...snap.data().friends, user]

                await updateDoc(friendsRef, {
                    friends: newfriend
                })
                const data = await getDoc(friendsRef)

                const newLocalHostData = { ...data.data(), id: data.id }

                localStorage.setItem('userData', JSON.stringify(newLocalHostData))
            }

        } catch (error) {
            console.log(error)

        }
    }



    const unFollow = async (user, id) => {
        try {
            const myDocRef = doc(db, "users", id)
            const snap = await getDoc(myDocRef)
            const newlist = snap.data().friends.filter((item) => {
                return item.id !== user.id
            })
            await updateDoc(myDocRef, {
                friends: newlist
            })

            const snapShot = await getDoc(myDocRef)
            const newData = snapShot.data()
            localStorage.setItem("userData", JSON.stringify(newData))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Context.Provider value={{ SignUp, loader, setLoader, Login, checkLogin, Logout, isLogin, userID, info, uploadeImage, GetUserInfo, uploadPost, setInfo, getAllPost, postLike, addComments, getMyPost, myPost, deletePost, deleteImg, upDatePost, uploadeImage, getAllUsers, userData, addFriend, unFollow }}>
            {children}
        </Context.Provider>
    )

}
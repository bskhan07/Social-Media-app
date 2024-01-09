import React, { useEffect, useState } from 'react'
import { useFireBase } from '../../Firebase/FireBaseContext'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/Loader'
import './home.scss'
import RecipeReviewCard from '../instaPost/Post'
import FriendsList from '../FriendList/FriendsList'

const Home = () => {


    const [LoguserData, setLogUserData] = useState({})
    const [post, setAllPost] = useState([])
    const numberOfPost = post?.length
    const { Logout, isLogin, userID, GetUserInfo, checkLogin, info, loader, setLoader, setInfo, getAllPost } = useFireBase()
    const navigate = useNavigate()



    useEffect(() => {

        // const 

        // if (!isLoginCheck) {
        //     navigate("/login")
        // }
        // else {
        //     setLogUserData(isLoginCheck)
        //     allPost()
        //     setLoader(true)
        // }
        checkLogin()
        if (!isLogin) {
            navigate('/login')
        }
        else {
            checkLogin()
            setLoader(true),
                GetUserInfo(userID)
            allPost()
        }
    }, [isLogin])



    const allPost = async () => {
        const posts = await getAllPost()
        setAllPost(posts?.flat())
    }

    const navigateHanler = () => {
        navigate("/mypost")
    }


console.log(post)


    return (

        loader ? <Loader /> : <div className='home-container'>
            <nav>
                <p>Hello, {info && info[0]?.userName}</p>
                <button onClick={() => navigate("/addpost")} className='add-post-btn' >Add post</button>
                <button onClick={navigateHanler} className='add-post-btn' >My post</button>
                <button className='logout-btn' onClick={() => { Logout() }} >Logout</button>
            </nav>

            <div className="home-main-conatainer">
                <FriendsList logUserId={info && info[0]?.id} />

                <div className="post-container">


                    {post && post?.map((post) => {
                        const isCheck = info?.[0]?.friends.some(obj => obj.id == post.userId)
                        return (
                            post.userId !== info[0]?.id && isCheck ?
                                <RecipeReviewCard numberOfPost={numberOfPost} key={post.ImgUrl} userLiked={post.userLiked} date={post.time} img={post.ImgUrl} cap={post.caption} postId={post.postId} likes={post.likes} userName={post.userName} userId={info[0]?.id} postOwnerId={post.userId} allComments={post.Comments} logUser={info[0]?.userName} /> : null
                        )
                    })
                    }
                </div>
            </div>
        </div>
        // <div></div>
    )
}

export default Home
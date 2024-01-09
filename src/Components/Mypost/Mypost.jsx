import React, { useEffect, useState } from 'react'
import "./mypost.scss"
import { useNavigate } from 'react-router-dom'
import { useFireBase } from '../../Firebase/FireBaseContext'
import Loader from '../Loader/Loader'
import RecipeReviewCard from '../instaPost/Post'
const Mypost = () => {
  const navigate = useNavigate()
  const { Logout, isLogin, checkLogin, info, loader, setLoader, getMyPost, myPost, } = useFireBase()
  const logoutHandler = () => {
    navigate("/login")
    Logout()
  }

const [logUserData,setlogUserData] = useState("")

  useEffect(() => {

    const LoginCheck = JSON.parse(localStorage.getItem("userData"))
    if (!LoginCheck) {
      navigate("/login")
    }
    else {
      setlogUserData(LoginCheck)
      console.log()
      setLoader(true)
      getMyPost(LoginCheck[0]?.id)
    }
  }, [])

  
  

  return (
    loader ? <Loader /> :
      <div className="my-post-main-container">
        <nav>
          <p>Hello {logUserData[0]?.userName}</p>
          <button onClick={() => navigate('/home')} className='add-post-btn' >Home</button>
          <button onClick={() => navigate('/addpost')} className='add-post-btn' >Add post</button>
          <button onClick={logoutHandler} className='logout-btn'  >Logout</button>
        </nav>

        <div className="my-post-container">
          {
            myPost?.map((post) => {
              return (
                <RecipeReviewCard key={post.ImgUrl} userLiked={post.userLiked} date={post.time} img={post.ImgUrl} cap={post.caption} postId={post.postId} likes={post.likes} userName={post.userName} userId={logUserData[0]?.id} postOwnerId={post.userId} allComments={post.Comments} logUser={logUserData[0]?.userName} />
              )
            })
          }
        </div>
      </div>
  )
}

export default Mypost
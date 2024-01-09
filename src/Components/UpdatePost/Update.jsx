import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useFireBase } from '../../Firebase/FireBaseContext'
import Loader from '../Loader/Loader'
import { useNavigate } from 'react-router-dom'
const Update = () => {
  const location = useLocation()

  const navigate = useNavigate()

  const { userId, postId } = location.state

  const [caption, setCaption] = useState(location.state.caption)
  const [imgurl, setImgUrl] = useState(location.state.imgUrl)
  const [imageUpdate, setImageUpdate] = useState(null)
  const [updateImageUrl, setUpdateImageUrl] = useState()

  const { loader, setLoader, deleteImg, updateImageUpload, upDatePost, uploadeImage } = useFireBase()

  const handleChange = (e) => {
    setImageUpdate(e.target.files[0])
    setImgUrl(null)
    setUpdateImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const postUpdateHandler = async () => {
    if (imageUpdate) {
      setLoader(true)
      deleteImg(updateImageUrl)
      const url = await uploadeImage(imageUpdate.name, imageUpdate)
      navigate("/mypost")
      upDatePost(userId, postId, caption, url)
    }
    else {
      setLoader(true)
      navigate("/mypost")
      upDatePost(userId, postId, caption, imgurl)
    }

  }
  return (

    loader ? <Loader /> :
      <div className="postFormContainer">
        <h1>Update Post</h1>
        <input onChange={handleChange} required type="file" />
        <img width={200} src={imgurl ? imgurl : updateImageUrl} alt="" />
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{ outline: "none", padding: "10px" }}
          required
          placeholder='Description'
          name=""
          id=""
          cols="30"
          rows="10"
        ></textarea>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={postUpdateHandler} className="uploadButton">Update</button>
          <button className="seeAllButton">See all post Post</button>
        </div>
      </div>
  )
}

export default Update
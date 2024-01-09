import { useEffect, useState } from "react"
import "./addpost.scss"
import { useFireBase } from "../../Firebase/FireBaseContext"
import { useNavigate } from "react-router-dom"
import { CastConnectedSharp, Co2Sharp } from "@mui/icons-material"
import { useLayoutEffect } from "react"
import Loader from "../Loader/Loader"
const AddPost = () => {
    const [dec, setDec] = useState("")
    const [file, setFile] = useState("")
    const { uploadeImage, info, uploadPost, Login, checkLogin, isLogin, userID, loader, setLoader } = useFireBase()
    const [imageUpload, setImageUpload] = useState(null)
    const [imgUrl, setUrl] = useState("")

    const navigate = useNavigate()
    const handleChange = (e) => {
        setImageUpload(e.target.files[0])
        setFile(URL.createObjectURL(e.target.files[0]))
    }
    const data = JSON.parse(localStorage.getItem("userData"))
    const uploadHandler = async () => {
        if (!imageUpload || dec.length == 0) alert("Plase choose All fields")
        else {
            setLoader(true)
            const url = await uploadeImage(imageUpload.name, imageUpload)
            await uploadPost(dec, url, data[0]?.id, data[0]?.userName,data[0]?.id)
            setUrl(url)
            navigate("/home")
        }
    }

    // console.log(data[0].id)

    // console.log(info)

    useEffect(() => {
        checkLogin()
        if (!isLogin) navigate("/login")
    }, [])

    return (
        loader ? <Loader /> :
            <div className="postFormContainer">
                <h1>Create Post</h1>
                <input required onChange={handleChange} type="file" />
                <img width={200} src={file} alt="" />
                <textarea
                    onChange={(e) => setDec(e.target.value)}
                    style={{ outline: "none", padding: "10px" }}
                    required
                    value={dec}
                    placeholder='Description'
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                ></textarea>
                <div style={{ display: "flex", gap: "20px" }}>
                    <button onClick={uploadHandler} className="uploadButton">Upload</button>
                    <button className="seeAllButton"   onClick={() => navigate('/mypost')} >See all post Post</button>
                </div>
            </div>
    )
}

export default AddPost
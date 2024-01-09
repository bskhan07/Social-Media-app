import "./signup.scss"
import { FaGooglePlus } from "react-icons/fa";
import { useFireBase } from "../../Firebase/FireBaseContext";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate()
  const { SignUp, loader, setLoader, AddDoc,isLogin } = useFireBase()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")

  const sigUphandler = () => {
    setLoader(true)
    SignUp(email, password, userName)
    setEmail('')
    setUserName('')
    setPassword('')
  }
  return (
    loader ? <Loader /> : <div className="login">
      <div className="left">
        <img src="https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
      </div>
      <div className="right">
        <div className="card">
          <p className="logo">SocialTime</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Email" />
          <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder="username" />
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
          <button onClick={sigUphandler} >Create Account</button>
          <p>or</p>
          <div>login with Google<FaGooglePlus /></div>
        </div>
        <div className="D-have">
          Already have an Account?<span onClick={() => navigate('/login')} > Login</span>
        </div>
      </div>
    </div>
  )
}

export default SignUp
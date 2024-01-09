import './login.scss'
import { FaGooglePlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useFireBase } from '../../Firebase/FireBaseContext';
import { useEffect, useState } from 'react';
const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { Login, checkLogin, isLogin } = useFireBase()
    const navigate = useNavigate()

    // const data = localStorage.getItem("userData") 
    useEffect(() => {
        if (isLogin) {
            navigate("/home")
        }
        else{
            navigate('/login')
        }
    }, [isLogin])

    return (
        <div className='login-container'>
            <div className="right">
                <div className="card">
                    <p className="logo">SocialTime</p>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' />
                    <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder='password' />
                    <button onClick={() => Login(email, password)} > Log in</button>
                    <p>or</p>
                    <div>login with Google  <FaGooglePlus /></div>
                </div>
                <div className="D-have">
                    Dont have an Account?<span onClick={() => navigate('/')}  > SignUp</span>
                </div>
            </div>
        </div>
    )
}

export default Login
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FireBaseProvider } from './Firebase/FireBaseContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <FireBaseProvider>
      <App />
    </FireBaseProvider>
  // </React.StrictMode>,
)

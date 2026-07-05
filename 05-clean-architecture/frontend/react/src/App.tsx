import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signup () {
    const input = {
      name,
      email,
      document,
      password
    }
    const responseSignup = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(input)
    });
    const outputSignup = await responseSignup.json();
    if (outputSignup.accountId) {
      setMessage("success");
    } else {
      setMessage(outputSignup.error);
    }
  }

  return (
    <>
      <div>
        <input className="input-name" onChange={(e) => setName(e.target.value)} placeholder="Name"/>
        <input className="input-email" onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
        <input className="input-document" onChange={(e) => setDocument(e.target.value)} placeholder="Document"/>
        <input className="input-password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
        <button className="button-signup" onClick={() => signup()}>Signup</button>
        {message && <span className="span-message">{message}</span>}
      </div>
    </>
  )
}

export default App

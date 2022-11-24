import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA9XdJD98cS9Vu26Lc8YUHjPjq9qRTY1Os",
  authDomain: "shreyas-eyrc.firebaseapp.com",
  projectId: "shreyas-eyrc",
  storageBucket: "shreyas-eyrc.appspot.com",
  messagingSenderId: "942458437318",
  appId: "1:942458437318:web:8a74321c9645338f4de1c7",
  measurementId: "G-WDXV9N5Y1M"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <header>
        <h1>{auth.currentUser.displayName.toUpperCase()}</h1>
        <SignOut />
      </header>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type Message..." />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <h2>Superchat Room 🚀🚀🚀</h2>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p className='author'>Made by MD_SHREYAS</p>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out button" onClick={() => auth.signOut()}>Leave Room</button>
  )
}




function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
  <>
    <div className={`message ${messageClass}`}>
      <img alt="" src={photoURL} />
      <p>{text}</p>
    </div>
  </>
  )
}

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}




export default App;

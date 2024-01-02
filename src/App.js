import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { initializeApp } from "firebase/app";
import { addDoc, getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  deleteDoc,
  query,
  writeBatch,
  collection,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import Request from "./Api";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Article from "./Article/Article";
import ReactMarkdown from "react-markdown";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import HomePage from "./Article/Article";

const firebaseConfig = {
  apiKey: "AIzaSyDmgATt0P0R2yz82w7u6b2jVk3sUG-ySnQ",
  authDomain: "mental-health-bot-db.firebaseapp.com",
  projectId: "mental-health-bot-db",
  storageBucket: "mental-health-bot-db.appspot.com",
  messagingSenderId: "896573464589",
  appId: "1:896573464589:web:1fcca34bed556223ecf544",
  measurementId: "G-34CBWDKED3",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const botId = "MentalHealthSupportBot"; // Replace with a unique identifier for your bot
const userId = auth?.currentUser?.uid; // Assuming you're using Firebase Auth
function createBotConversationId(userId) {
  return `bot_${botId}_user_${userId}`;
}

// Usage
const conversationId = createBotConversationId(userId);

async function getResponse(query) {
  return Request(query)
    .then((res) => {
      return res.response;
    })
    .catch((err) => {
      console.error(err);
      throw err; // Rethrow the error for further handling if needed
    });
}

function Navbar() {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.error("Sign out error", error);
      });
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/personal-chat">Personal Chatbot</Link>
        </li>
        <li>
          <Link to="/public-chat">Public Chatbot</Link>
        </li>
        {user && (
          <li>
            <button onClick={handleSignOut} className="nav-sign-out-button">
              <Link to="/" className="sign-out">
                Sign Out
              </Link>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

function App() {
  const [user, loading, error] = useAuthState(auth);

  // Optional: handle error state
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Show loading state while authentication state is being determined
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={user ? <Blog /> : <SignIn />} />
          <Route path="/personal-chat" element={<ChatRoom />} />
          <Route path="/public-chat" element={<PublicChat />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

function SignOut() {
  function sign_out() {
    auth.signOut();
  }
  return auth.currentUser && <button onClick={sign_out}>Sign Out</button>;
}
function SignIn() {
  const auth = getAuth(); // Ensure auth is correctly initialized

  function SignInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle the successful authentication here
        console.log("Successfully signed in with Google");
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error signing in with Google: ", error);
      });
  }

  return (
    <>
      <header className="sign-in-header">Welcome to the Chat App</header>

      <div className="sign-in-container">
        <button onClick={SignInWithGoogle} className="google-sign-in-button">
          <img
            src="data:image/png;base64,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"
            alt="Google sign-in"
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </>
  );
}
function Blog() {
  return (
    <HomePage/>
  );
}
function PublicChat() {
  const [messages, setMessages] = useState([]);
  const [formValue, setFormValue] = useState("");
  const bottomOfChat = useRef(null);

  useEffect(() => {
    // Reference to the public messages collection
    const messagesRef = collection(firestore, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    // Listen for new messages
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsubscribe(); // Detach listener on unmount
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat on new messages
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !formValue.trim()) return;

    const { uid, displayName } = auth.currentUser;
    const messagesRef = collection(firestore, "messages");

    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      displayName: displayName || "Anonymous",
    });

    setFormValue("");
  };

  return (
    auth.currentUser && (
      <div className="chat-container public-chat">
        <div className="message-container">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomOfChat} />
        </div>
        <form onSubmit={sendMessage} className="message-form">
          <input
            className="message-input"
            type="text"
            value={formValue}
            placeholder="Type a message..."
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    )
  );
}

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const messageRef = collection(firestore, "messages");
  const [formValue, setFormValue] = useState("");
  const bottomOfChat = useRef(null);
  const auth = getAuth(); // Ensure that auth is properly initialized in your Firebase configuration
  // const [response, setResponse] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();
    const query = formValue;
    var response = "";
    try {
      response = await getResponse(query);
      // console.log("repone done" + response);
    } catch (error) {
      console.log(error);
    }
    if (!auth.currentUser) return; // Ensure there is a logged-in user

    const { uid, displayName } = auth.currentUser;

    // Assuming 'conversationId' is available in the state, props, or context
    const conversationRef = doc(
      firestore,
      `users/${uid}/conversations/${conversationId}`
    );
    const messagesRef = collection(conversationRef, "messages");
    // Add a new message to Firestore
    await addDoc(messagesRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid: uid,
      displayName: "YOU",
    });
    await addDoc(messagesRef, {
      text: response,
      createdAt: serverTimestamp(),
      uid: "bot",
      displayName: "BOT",
    });

    setFormValue(""); // Reset the input field after sending a message
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (auth.currentUser) {
        // Assuming 'conversationId' is available in the state, props, or context
        const conversationRef = doc(
          firestore,
          `users/${auth.currentUser.uid}/conversations/${conversationId}`
        );
        const messagesRef = collection(conversationRef, "messages");

        const querySnapshot = await getDocs(messagesRef);
        const fetchedMessages = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => {
            const aTimestamp = a.createdAt?.toDate().getTime();
            const bTimestamp = b.createdAt?.toDate().getTime();
            return aTimestamp - bTimestamp;
          });
        setMessages(fetchedMessages);
      }
    };

    fetchMessages().catch(console.error);
  }, [auth.currentUser, formValue]); // Added auth.currentUser to the dependency array

  useEffect(() => {
    bottomOfChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function SignOut() {
    auth.signOut();
  }

  async function Clear() {
    if (!auth.currentUser) {
      console.log("No user logged in");
      return;
    }

    const userId = auth.currentUser.uid;
    const conversationRef = doc(
      firestore,
      `users/${userId}/conversations/${conversationId}`
    );
    const messagesRef = collection(conversationRef, "messages");

    // Query all documents in the messages subcollection
    const querySnapshot = await getDocs(messagesRef);

    // Create a batch to delete all documents
    const batch = writeBatch(firestore);

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref); // Add each message document to the batch
    });

    // Commit the batch
    await batch.commit();

    console.log("All messages cleared for the current user's conversation");
    setMessages([]);
  }

  return (
    <>
      {/* <Navbar/> */}
      {/* <button onClick={SignOut} className="sign-out-button">
        Sign Out
      </button> */}
      <button className="clear-chat-button" onClick={Clear}>
        Clear Chat
      </button>

      <div className="chat-container">
        <div className="message-container">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomOfChat} />
        </div>
        <form onSubmit={sendMessage} className="message-form">
          <input
            className="message-input"
            type="text"
            value={formValue}
            placeholder="Type a message..."
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </div>
    </>
  );
}
function Image(URL) {
  // console.log(URL);
  return <img className="dp" src={URL.URL}></img>;
}
function ChatMessage(props) {
  const { photoURL } = auth.currentUser;
  const { text, uid, displayName } = props.message;
  const messageClass = uid === auth?.currentUser?.uid ? "sent" : "received";
  // console.log(auth.currentUser);
  return (
    <div className={`message ${messageClass}`}>
      <p className="message-sender">{displayName}</p>
      <p className="message-text">{text}</p>
    </div>
  );
}

export default App;

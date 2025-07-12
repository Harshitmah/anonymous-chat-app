
## 🕵️‍♂️ Anonymous Chat Application

A real-time, privacy-focused chat web application where users can join and communicate anonymously. Built using **Node.js**, **Express**, and **Socket.io**, this app ensures **zero data storage**, allowing users to chat without revealing their identity.

---

### 🔐 Features

* **Anonymous Signup/Login**
  Users can sign up or log in without sharing real names or email addresses.

* **Enter With Nickname Only**
  Users can instantly join the chatroom using any nickname — no account required.

* **Real-Time Chat with Socket.io**
  All messages are sent and received instantly using WebSocket-based communication.

* **Zero Data Storage**
  No user or chat data is stored permanently. All messages are wiped when a user leaves the chat.

* **Join/Leave Notifications**
  Get notified when someone joins or exits the chatroom.

* **Client Sessions**
  Handled using `express-session` and `localStorage` for seamless login/logout flow.

---

### 🧰 Tech Stack & Libraries Used

| Library             | Purpose                                               |
| ------------------- | ----------------------------------------------------- |
| **Node.js**         | Backend JavaScript runtime                            |
| **Express.js**      | Web framework for routing and middleware              |
| **Socket.io**       | Real-time, bi-directional communication               |
| **http**            | Native Node module to create the server               |
| **body-parser**     | Parses incoming request bodies                        |
| **bcrypt**          | Password hashing for secure signup/login              |
| **express-session** | Session management for login state                    |
| **LocalStorage**    | Used on the client-side to store session-related info |

---

### 🚫 Privacy First

* No real names or emails required
* No messages or data are stored
* Chat is wiped when a user leaves
* Anonymous and secure communication

---

### ⚙️ How It Works

1. **Signup/Login** anonymously or enter with a nickname.
2. **Join the chatroom** and start chatting in real time.
3. **System notifications** alert everyone when a user joins or leaves.
4. **Leave the app** — your messages and presence are deleted instantly.

---

### 🚀 Getting Started

#### Clone and Run Locally:

```bash
git clone https://github.com/Harshitmah/anonymous-chat-app.git
cd anonymous-chat-app
npm install express body-parser socket.io http bcrypt
node index.js
```

Then open [https://anonymous-chat-application.netlify.app/](https://anonymous-chat-application.netlify.app/) in your browser.

---



This project is open-source and free to use.

---


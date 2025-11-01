# Real-Time Chat Application (CN Project 5th semester)

## Made by Ayushi (2305849)

This is a simple real-time chat application built with Node.js. It serves as a project for a Computer Networks (CN) course, demonstrating client-server communication using WebSockets.

The application allows multiple users to connect to a central server, send messages, and receive messages from all other connected users in real-time.

## 🚀 Features

* **Real-time Messaging:** Messages are sent and received instantly without needing to refresh the page.
* **Multiple Clients:** Supports numerous concurrent users in a single chat room.
* **Simple Interface:** A clean and minimal UI built with HTML, CSS, and JavaScript.

## 💻 Tech Stack

* **Backend:** Node.js
* **Networking:** WebSockets (likely using a library like `ws` or `Socket.io`)
* **Frontend:** HTML, CSS, JavaScript

## 🔧 Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

You must have [Node.js](https://nodejs.org/) installed on your machine (which includes `npm`).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Ayushi40804/CN-Project.git](https://github.com/Ayushi40804/CN-Project.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd CN-Project
    ```

3.  **Install the required dependencies:**
    (This will read the `package.json` file and install libraries like Express or Socket.io)
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the server:**
    ```bash
    node server.js
    ```
    The console should log a message indicating that the server is running (e.g., `Server running on port 3000`).

2.  **Open the application in your browser:**
    Open one or more browser tabs and navigate to:
    ```
    http://localhost:3000
    ```
    *(Note: The port might be different. Check the `server.js` file for the exact port number if `3000` doesn't work.)*

3.  **Start chatting!**
    Type a message in one browser window, and it should appear instantly in all other open windows.
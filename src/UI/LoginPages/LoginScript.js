document.addEventListener("DOMContentLoaded", async function () {
    const terminalInput = document.getElementById("terminal-input");
    const commandDisplay = document.getElementById("command");
    const outputDisplay = document.getElementById("output");
    let username = "";
    let step = 0; // Step 0: Enter username, Step 1: Enter password
    let wrongPass = 0;
    terminalInput.focus();
    let API_BASE_URL = "http://192.168.67.185:9000";
    let URL = "192.168.67.185";

    // Initialize Firebase (Replace with your Firebase config)
    const firebaseConfig = {
        apiKey: "AIzaSyAd0yxPkMVoerKq6pPZvXyTbOEaMILss4A",
        authDomain: "vcode-3b099.firebaseapp.com",
        projectId: "vcode-3b099",
        storageBucket: "vcode-3b099.appspot.com",
        messagingSenderId: "230736955287",
        appId: "1:230736955287:web:926fc8df65c6386eb326d2",
        measurementId: "G-NMDL4TH3T3",
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Session Manager Class
    class SessionManager {
        constructor() {
            this.sessionId = this.getSessionId();
        }

        // Get session ID from localStorage or create a new one
        getSessionId() {
            let sessionId = localStorage.getItem("sessionId");
            if (!sessionId) {
                console.log("No session ID found in localStorage");
            } else {
                console.log("Using session ID from localStorage:", sessionId);
            }
            return sessionId;
        }

        // Save session ID to localStorage
        saveSessionId(sessionId) {
            if (sessionId) {
                localStorage.setItem("sessionId", sessionId);
                console.log("Session ID saved to localStorage:", sessionId);
                this.sessionId = sessionId;
            }
        }

        // Clear session data
        clearSession() {
            localStorage.removeItem("sessionId");
            console.log("Session cleared from localStorage");
            this.sessionId = null;
        }

        // Check if we have a session
        hasSession() {
            return !!this.sessionId;
        }
    }

    // API Client with session handling
    class ApiClient {
        constructor() {
            this.baseUrl = API_BASE_URL;
            this.sessionManager = new SessionManager();
        }

        // Get port from server
        async getPort() {
            try {
                const response = await fetch(`${this.baseUrl}/get-port`, {
                    method: "GET",
                    credentials: "include", // This ensures cookies are sent
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // If the response contains a sessionId, save it
                if (data.sessionId) {
                    this.sessionManager.saveSessionId(data.sessionId);
                }

                return data.port;
            } catch (error) {
                console.error("Error getting port:", error);
                throw error;
            }
        }

        // Change context (e.g., switch to admin pages)
        async changeContext(userData) {
            try {
                console.log("Attempting context change with data:", userData);
                console.log(this.baseUrl);
                const response = await fetch(`${this.baseUrl}/change-context`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sessionId: this.sessionManager.sessionId,
                        baseURL: userData.baseURL,
                        userEmail: userData.userEmail,
                        role: userData.role,
                    }),
                    credentials: "include", // This ensures cookies are sent
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(
                        `Server returned ${response.status}: ${errorText}`
                    );
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // If the response contains a sessionId, save it
                if (data.sessionId) {
                    this.sessionManager.saveSessionId(data.sessionId);
                    console.log("Session ID updated:", data.sessionId);
                }

                return data;
            } catch (error) {
                console.error("Error changing context:", error);
                throw error;
            }
        }
    }

    // Create instances
    const sessionManager = new SessionManager();
    const apiClient = new ApiClient();

    // Check for cookies and update localStorage if needed
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "sessionId") {
            console.log("Cookie found!");
            sessionManager.saveSessionId(value);
            break;
        }
    }
    console.log(cookies);

    function printLine(text, delay = 500) {
        setTimeout(() => {
            outputDisplay.innerHTML += text + "\n";
            scrollToBottom();
        }, delay);
    }

    // Add click handler to terminal to ensure focus remains on input
    document.querySelector(".terminal").addEventListener("click", function () {
        terminalInput.focus();
    });

    // Ensure focus is maintained when the page loads
    window.addEventListener("load", function () {
        terminalInput.focus();
    });

    // Refocus when window regains focus
    window.addEventListener("focus", function () {
        terminalInput.focus();
    });

    terminalInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            const command = terminalInput.value.trim();
            terminalInput.value = "";
            commandDisplay.textContent = "";
            processCommand(command);
        } else {
            // Check if we're in password mode
            if (terminalInput.dataset.passwordMode === "true") {
                // Display asterisks instead of actual characters
                commandDisplay.textContent = "*".repeat(
                    terminalInput.value.length
                );
            } else {
                commandDisplay.textContent = terminalInput.value;
            }
        }
    });

    function scrollToBottom() {
        const terminalBody = document.querySelector(".terminal-body");
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }   

    async function processCommand(command) {
        if (command === "forgot --help") {
            printLine("> Redirecting to Forgot Password page...");
            setTimeout(() => {
                window.location.href = "ForgotPass.html";
            }, 1000);
            return;
        }

        if (step === 0) {
            username = command;
            printLine(`\n> Searching for user: ${username}...`);
            const email = await fetchUserData(username);
            if (email) {
                printLine("> Username accepted");
                setTimeout(() => {
                    printLine("> Enter password:");
                    step = 1;
                    // Set a flag to indicate we're in password mode
                    terminalInput.dataset.passwordMode = "true";
                    terminalInput.focus();
                }, 500);
            } else {
                printLine("> ERROR: Username not found.");
            }
        } else if (step === 1) {
            const password = command;
            // Reset password mode flag
            terminalInput.dataset.passwordMode = "false";
            console.log("Logging in with:", username, password);
            const userData = await fetchUserData(username);
            if (userData.email) {
                verifyPassword(
                    userData.email,
                    password,
                    userData.role,
                    username
                );
            } else {
                printLine("> ERROR: Could not retrieve user data.");
            }
        }
    }

    async function fetchUserData(username) {
        try {
            const querySnapshot = await db
                .collection("users")
                .where("username", "==", username)
                .get();
            if (!querySnapshot.empty) {
                let userData = null;
                querySnapshot.forEach((doc) => {
                    userData = doc.data();
                });
                console.log("Fetched user:", userData);
                return userData; // Return email
            } else {
                return null;
            }
        } catch (error) {
            printLine("> ERROR: Failed to fetch user data.");
            console.error(error);
            return null;
        }
    }

    async function verifyPassword(userEmail, inputPassword, role, username) {
        try {
            // Step 1: Authenticate with Firebase
            await auth.signInWithEmailAndPassword(userEmail, inputPassword);
            printLine("> Access granted. Welcome, " + userEmail + "!");
            setTimeout(async () => {
                try {
                    printLine("> Initializing secure session...");

                    // Step 3: Get backend port
                    const port = await apiClient.getPort();
                    if (!port) {
                        throw new Error("Failed to get backend port");
                    }

                    const backendURL = `http://${URL}:${port}`;
                    console.log("Using backend port:", backendURL);

                    // Step 2: Store role
                    await fetch(backendURL + "/store-role", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: userEmail,
                            role: role,
                            port: port,
                        }),
                        credentials: "include",
                    });

                    // Step 3: Save data in localStorage
                    localStorage.setItem("userEmail", userEmail);
                    localStorage.setItem("userRole", role);
                    localStorage.setItem("userPort", port);
                    localStorage.setItem("userName",username);

                    // Step 4: Change context using the session-aware client
                    await apiClient
                        .changeContext({
                            baseURL: backendURL,
                            userEmail: userEmail,
                            role: role,
                        })
                        .then((res) => {
                            // Navigate to the new app manually (React side)
                            console.log("Context changed successfully");
                            window.location.href = `http://${URL}:9000/`;
                        })
                        .catch((err) => {
                            console.error("Context change failed", err);
                            printLine("> ERROR: Failed to change context.");
                        });

                    printLine("> Session data saved locally.");
                } catch (error) {
                    console.error(
                        "Error during session initialization:",
                        error
                    );
                    printLine("> ERROR: Failed to initialize session.");
                }

                setTimeout(() => {
                    printLine("> Connection Established.");
                }, 1000);
            }, 1500);
        } catch (authError) {
            wrongPass++;
            terminalInput.dataset.passwordMode = "true";
            console.log(wrongPass);
            printLine("> ERROR: Incorrect password. Try again.");
            if (wrongPass > 2) {
                terminalInput.dataset.passwordMode = "false";
                printLine(
                    "> Forgot password? Type 'forgot --help' for assistance."
                );
            }
        }
    }

    // Typing animation for initial text
    const initialText = "> Welcome to Vcode.\n> Please enter your username:";
    let index = 0;
    function typeInitialText() {
        if (index < initialText.length) {
            outputDisplay.innerHTML += initialText.charAt(index);
            index++;
            setTimeout(typeInitialText, 50);
        }
    }

    typeInitialText();
});

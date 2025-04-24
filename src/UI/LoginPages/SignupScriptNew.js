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

document
    .getElementById("signup-form")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("username");
        let password = document.getElementById("password");
        let email = document.getElementById("email");
        let confirmPassword = document.getElementById("confirm-password");
        let passwordError = document.getElementById("password-error");
        let signupMessage = document.getElementById("signup-message");

        // Reset error messages but keep validating
        passwordError.style.display = "none";
        signupMessage.style.display = "none";

        let isValid = true; // Assume form is valid

        // Validate username (RegNo or Teacher ID)
        let role = detectRole(username.value.toUpperCase());
        if (role === "invalid") {
            showError(
                passwordError,
                "Invalid Registration Number Format!",
                username
            );
            isValid = false;
        }

        // Validate password match
        if (password.value !== confirmPassword.value) {
            showError(
                passwordError,
                "Passwords do not match!",
                confirmPassword
            );
            isValid = false;
        }

        // Validate password strength
        if (!isValidPassword(password.value)) {
            showError(
                passwordError,
                "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
                password
            );
            isValid = false;
        }

        // If there's any error, stop submission
        if (!isValid) return;

        auth.createUserWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
                let user = userCredential.user;

                // Store user data in Firestore
                return db.collection("users").doc(user.uid).set({
                    username: username.value.toUpperCase(),
                    regNo: username.value.toUpperCase(),
                    role: role,
                    email: email.value,
                    userId: user.uid,
                });
            })
            .then(() => {
                signupMessage.innerText = `Welcome, ${username.value.toUpperCase()}! You have successfully signed up.`;
                signupMessage.style.display = "block";

                // Redirect to Login Page after 2 seconds
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            })
            .catch((error) => {
                showError(passwordError, "Error: " + error.message, email);
            });
    });

// Function to show error and focus the field
function showError(errorElement, message, field) {
    errorElement.innerText = message;
    errorElement.style.display = "block";
    field.focus();

    // Keep listening to changes and clear error when fixed
    field.addEventListener("input", function () {
        if (field.value.trim() !== "") {
            errorElement.style.display = "none";
        }
    });
}

// Function to detect role based on regNo
function detectRole(regNo) {
    if (/^\d{2}[A-Z]{3}\d{4}$/.test(regNo)) {
        return "student"; // Matches student format (e.g., 23BCE1087)
    } else if (/^\d{8}$/.test(regNo)) {
        return "teacher"; // Matches teacher format (e.g., 92391045)
    } else {
        return "invalid";
    }
}

// Function to validate a strong password
function isValidPassword(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

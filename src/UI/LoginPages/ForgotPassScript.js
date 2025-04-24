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

document.querySelector(".reset-btn").addEventListener("click", function () {
    let email = document.getElementById("email-input").value.trim();
    let outputBox = document.getElementById("output"); // Get the output box

    if (!email.includes("@") || !email.includes(".")) {
        outputBox.textContent = "Enter a valid email address.";
        outputBox.style.color = "red";
        outputBox.style.display = "block";
        return;
    }

    // Check if the email exists in Firestore
    db.collection("users")
        .where("email", "==", email)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                outputBox.textContent = "Email not found.";
                outputBox.style.color = "red";
                outputBox.style.display = "block";
                return;
            }

            // Email exists, send password reset email
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    outputBox.textContent = "Password reset email sent!";
                    outputBox.style.color = "green";
                    outputBox.style.display = "block";
                })
                .catch((error) => {
                    console.error("Error sending reset email:", error);
                    outputBox.textContent = "Error: " + error.message;
                    outputBox.style.color = "red";
                    outputBox.style.display = "block";
                });
        })
        .catch((error) => {
            console.error("Firestore Error:", error);
            outputBox.textContent = "Error checking email.";
            outputBox.style.color = "red";
            outputBox.style.display = "block";
        });
});

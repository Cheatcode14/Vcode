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

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get("oobCode"); // Get reset token
    let outputBox = document.getElementById("output");

    if (!outputBox) {
        console.error("Element with id 'output' not found!");
        return;
    }

    if (!oobCode) {
        outputBox.innerText = "Invalid reset link.";
        outputBox.style.color = "red";
        outputBox.style.display = "block";
        return;
    }

    let saveBtn = document.querySelector(".save-password-btn");
    if (!saveBtn) {
        console.error("Button .save-password-btn not found!");
        return;
    }

    saveBtn.addEventListener("click", function () {
        let newPassword = document.getElementById("new-password").value;
        let confirmPassword = document.getElementById("confirm-password").value;

        if (newPassword.length < 6) {
            outputBox.innerText = "Password must be at least 6 characters.";
            outputBox.style.color = "red";
            outputBox.style.display = "block";
            return;
        }
        if (newPassword !== confirmPassword) {
            outputBox.innerText = "Passwords do not match!";
            outputBox.style.color = "red";
            outputBox.style.display = "block";
            return;
        }

        // Use Firebase to confirm the reset
        firebase
            .auth()
            .confirmPasswordReset(oobCode, newPassword)
            .then(() => {
                outputBox.innerText = "Password successfully updated! Closing window...";
                outputBox.style.color = "green";
                outputBox.style.display = "block";
                
                setTimeout(() => {
                    window.close();
                }, 2000); // Closes tab after 2 seconds
                
            })
            .catch((error) => {
                console.error(error);
                outputBox.innerText = "Error: " + error.message;
                outputBox.style.color = "red";
                outputBox.style.display = "block";
            });
    });
});

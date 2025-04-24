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

    if (!oobCode) {
        alert("Invalid reset link.");
        return;
    }

    document
        .querySelector(".save-password-btn")
        .addEventListener("click", function () {
            let newPassword = document.getElementById("new-password").value;
            let confirmPassword =
                document.getElementById("confirm-password").value;

            if (newPassword.length < 6) {
                alert("Password must be at least 6 characters.");
                return;
            }
            if (newPassword !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            // Use Firebase to confirm the reset
            firebase
                .auth()
                .confirmPasswordReset(oobCode, newPassword)
                .then(() => {
                    alert(
                        "Password successfully updated! Redirecting to login..."
                    );
                    window.location.href = "/"; // Redirect after reset
                })
                .catch((error) => {
                    console.error(error);
                    alert("Error resetting password: " + error.message);
                });
        });
});

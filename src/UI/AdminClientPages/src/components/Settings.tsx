import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase"; // 🔥 import from your firebase config file
import "../styles/Settings.css";

const Settings: React.FC = () => {
    const { email: userEmail } = useUser();
    const [user, setUser] = useState<{
        email: string;
        regNo: string;
        role: string;
    } | null>(null);
    const [resetStatus, setResetStatus] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (!userEmail) return;

        const fetchUserDetails = async () => {
            try {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", userEmail));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    const data = doc.data();
                    setUser({
                        email: data.email || "",
                        regNo: data.regNo || "",
                        role: data.role || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [userEmail]);

    const handleResetPassword = async () => {
        try {
            await auth.sendPasswordResetEmail(user?.email || "");
            setResetStatus("Password reset email sent!");
        } catch {
            setResetStatus("Failed to send reset email.");
        }
    };

    return (
        <div className={`settings-panel ${theme}`}>
            <div className="settings-profile-row">
                <img
                    src={`https://randomuser.me/api/portraits/men/1.jpg`}
                    alt="Profile"
                    className="settings-avatar"
                />
                <h2 className="settings-heading">Profile</h2>
            </div>
            <div className="settings-details">
                <div>
                    <span className="settings-label">Email:</span>
                    <span className="settings-label-details">
                        {user?.email || "Loading..."}
                    </span>
                </div>
                <div>
                    <span className="settings-label">Username:</span>
                    <span className="settings-label-details">
                        {user?.regNo || "Loading..."}
                    </span>
                </div>
                <div>
                    <span className="settings-label">Role:</span>
                    <span className="settings-label-details">
                        {user?.role || "Loading..."}
                    </span>
                </div>
            </div>
            <div className="settings-actions">
                <button
                    className="settings-reset-btn"
                    onClick={handleResetPassword}
                >
                    Reset Password
                </button>
                {resetStatus && (
                    <div className="settings-reset-status">{resetStatus}</div>
                )}
                <div className="settings-theme-toggle">
                    <span className="settings-label">Dark</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={theme === "light"}
                            onChange={toggleTheme}
                            aria-label="Toggle dark mode"
                        />
                        <span className="slider">
                            <div className="star star_1"></div>
                            <div className="star star_2"></div>
                            <div className="star star_3"></div>
                            <svg viewBox="0 0 16 16" className="cloud_1 cloud">
                                <path
                                    transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                                    fill="#fff"
                                    d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                                ></path>
                            </svg>
                        </span>
                    </label>
                    <span className="settings-label">Light</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;

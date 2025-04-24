import Sidebar from "./Sidebar";
import "../styles/AdminLayout.css";
import "../styles/theme.css";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

function AdminLayout() {
  // Get stored theme preference or default to dark mode

  const { hostIP } = useUser();

  const logout = () => {
    // Clear localStorage items
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userPort");

    // Call server logout endpoint with credentials
    fetch(`http://${hostIP}:9000/logout`, {
      method: "POST",
      credentials: "include", // Important for cookies
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log("Logged out successfully");
          // Redirect to login page
          window.location.href = `http://${hostIP}:9000/`;
        } else {
          console.error("Logout failed:", response.statusText);
          alert("Logout failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("Error during logout. Please try again.");

        // Fallback: redirect anyway if server is unreachable
        window.location.href = `http://${hostIP}:9000/`;
      });
  };

  return (
    <div className="admin-layout">
      <div className="main-content">
        <Sidebar>
          <>
            <div className="btn-wrapper">
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </div>
          </>
        </Sidebar>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

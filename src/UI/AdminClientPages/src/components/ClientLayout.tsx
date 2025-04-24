import ClientSidebar from "./ClientSidebar";
import "../styles/ClientLayout.css";
import "../styles/theme.css";
import { Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

function ClientLayout() {
    const {hostIP} = useUser();
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
    <div className="client-layout">
      <div className="main-content">
        {/* Hide sidebar only on /problempage */}
        {location.pathname !== "/problempage" && (
          <ClientSidebar>
            <>
              <div className="btn-wrapper">
                <button className="logout-button" onClick={logout}>
                  Logout
                </button>
              </div>
            </>
          </ClientSidebar>
        )}
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ClientLayout;

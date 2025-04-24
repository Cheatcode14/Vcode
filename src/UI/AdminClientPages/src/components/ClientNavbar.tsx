import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { ReactElement } from "react";
interface NavbarProp {
    children: ReactElement;
}
function ClientNavbar({ children }: NavbarProp) {
    return (
        <nav className="navbar">
            <h2 className="navbar_head">Vcode</h2>
            <div className="nav-links">
                <Link to="/">Dashboard</Link>
                <Link to="/manage-problem">Problems</Link>
                <Link to="/client-submissions">Submissions</Link>
            </div>
            <div>{children}</div>
        </nav> 
    );
}

export default ClientNavbar;

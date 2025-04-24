import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import { ReactElement } from "react";
interface ClientSidebarProp {
    children: ReactElement;
}
const ClientSidebar = ({ children }: ClientSidebarProp) => {
    return (
        <div className="sidebar-wrapper">
            <aside className="sidebar" aria-label="Sidebar navigation">
                <h2 className="sidebar_head">Vcode</h2>
                <div className="listgroup">
                    <div className="listgroupitem">
                        <Link to="/">Dashboard</Link>
                    </div>
                    <div className="listgroupitem">
                        <Link to="/cproblems">View Problems</Link>
                    </div>
                    <div className="listgroupitem">
                        <Link to="/client-submissions">Submissions</Link>
                    </div>

                    <div className="listgroupitem">
                        <Link to="/settings">Settings</Link>
                    </div>
                </div>
                {children}
            </aside>
        </div>
    );
};

export default ClientSidebar;

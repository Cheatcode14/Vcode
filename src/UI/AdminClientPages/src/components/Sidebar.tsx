import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import { ReactElement } from "react";
interface SidebarProp {
  children: ReactElement;
}
const Sidebar = ({ children }: SidebarProp) => {
  return (
    <div className="sidebar-wrapper">
      <aside className="sidebar">
        <div className="listgroup">
        <h2 className="sidebar_head">Vcode</h2>
          <div className="listgroupitem">
            <Link to="/">Dashboard</Link>
          </div>
          <div className="listgroupitem">
            <Link to="/manage-problem">Manage Problems</Link>
          </div>
          <div className="listgroupitem">
            <Link to="/submissions">Submissions</Link>
          </div>
          <div className="listgroupitem">
            <Link to="/analytics">User Analytics</Link>
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

export default Sidebar;

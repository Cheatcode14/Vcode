import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../styles/UserList.css";

const UserList = () => {
    // Sample user data
    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            img: "https://i.pravatar.cc/40?img=1",
        },
        {
            id: 2,
            name: "Alice Smith",
            email: "alice@example.com",
            img: "https://i.pravatar.cc/40?img=2",
        },
        {
            id: 3,
            name: "Michael Brown",
            email: "michael@example.com",
            img: "https://i.pravatar.cc/40?img=3",
        },
        {
            id: 4,
            name: "Sarah Wilson",
            email: "sarah@example.com",
            img: "https://i.pravatar.cc/40?img=4",
        },
        {
            id: 5,
            name: "David Johnson",
            email: "david@example.com",
            img: "https://i.pravatar.cc/40?img=5",
        },
    ];

    return (
        <div className="overflow-auto">
            <h2 className="userList-title">User List</h2>

            {/* Search Input */}
            <div className="input-group mb-3">
                <span className="input-group-text bg-dark text-white">@</span>
                <input
                    type="text"
                    className="form-control bg-dark text-white"
                    placeholder="Search user..."
                />
            </div>

            {/* User List */}
            <ul className="list-group">
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="lgi"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                        }}
                    >
                        <img
                            src={user.img}
                            alt="Profile"
                            width="40"
                            height="40"
                            style={{ borderRadius: "50%", marginRight: "10px" }}
                        />
                        <div>
                            <strong>{user.name}</strong>
                            <div>{user.email}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;

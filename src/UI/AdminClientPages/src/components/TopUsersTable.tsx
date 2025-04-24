import React from 'react';
import '../styles/AdminAnalytics.css';

interface User {
  username: string;
  submissions: number;
}




const TopUsersTable: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <section className="admin-section">
      <h2>👑 Top 5 Active Users</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Submissions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i}>
              <td>{user.username}</td>
              <td>{user.submissions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default TopUsersTable;

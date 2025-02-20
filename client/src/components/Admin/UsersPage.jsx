import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let fetchedUsers = [];

        if (user.role === 'admin') {
          const { data } = await axios.get('/all-users');
          fetchedUsers = data;
        } else if (user.role === 'villa owner') {
          const { data } = await axios.get('/owner-customers');
          fetchedUsers = data.customers; // Extracting the correct array
        }

        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.role]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {user.role === 'admin' ? 'All Users' : 'My Customers'}
      </h2>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">User ID</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Phone</th>
            {user.role === 'admin' && <th className="px-4 py-2 text-left">Role</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="px-4 py-2">{u._id}</td>
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.phone || 'N/A'}</td>
              {user.role === 'admin' && <td className="px-4 py-2">{u.role || 'N/A'}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;

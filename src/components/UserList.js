import React, { useEffect, useState } from 'react';
import authService from '../services/authService';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await authService.getAllUsers();
                setUsers(userData);
            } catch (error) {
                console.error('Failed to fetch users', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h2>All Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;

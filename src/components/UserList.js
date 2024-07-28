import React, { useEffect, useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../components/ErrorModal';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await authService.getAllUsers();
                setUsers(data);
            } catch (error) {
                setError(error.message);
                setIsModalOpen(true);
            }
        };

        fetchUsers();
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div>
            <h2>User List</h2>
            {isModalOpen && (
                <ErrorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title="Error"
                    message={error}
                />
            )}
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;

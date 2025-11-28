// src/pages/Profile.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import '../styles/pages.css';

const Profile = () => {
    const { user, logout, loading } = useAuth();

    if (loading || !user) {
        return <Loader />;
    }

    return (
        <div className="auth-page">
            <div className="card auth-card profile-card" style={{ textAlign: "left" }}>
                <h2 className="profile-title">👤 Your Profile</h2>

                <div className="profile-info">
                    <div className="profile-row">
                        <strong>Username:</strong>
                        <p>{user.username}</p>
                    </div>

                    <div className="profile-row">
                        <strong>Email:</strong>
                        <p>{user.email}</p>
                    </div>
                </div>

                <button
                    onClick={() => logout(true)}
                    className="btn btn-danger"
                    style={{
                        width: "100%",
                        backgroundColor: "var(--color-danger)",
                        color: "#fff"
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;

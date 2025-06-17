import React from 'react';

const Unauthorized = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <div style={{ textAlign: 'center', padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <h1>Unauthorized</h1>
                <p>You do not have permission to access this page.</p>
            </div>
        </div>
    );
};

export default Unauthorized;
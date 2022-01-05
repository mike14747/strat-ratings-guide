import React, { useState, useContext } from 'react';
import axios from 'axios';
import UserContext from '../context/userContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const { setUser } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.length > 0 && password.length > 0) {
            axios.post('/api/auth/login', { username, password })
                .then(response => {
                    response.status === 299 ? setMessage(response.data.message) : setUser(response.data.user);
                })
                .catch(error => {
                    setMessage(null);
                    console.log(error);
                });
        }
    };

    return (
        <article>
            <h2>Login to Add, Edit or Delete Articles</h2>
            <form onSubmit={handleSubmit}>
                <div className="my-4">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                </div>
                <div className="my-4">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                </div>
                <div className="my-4">
                    <button type="submit">Submit</button>
                </div>
            </form>
            {message &&
                <p className="text-danger">{message}</p>
            }
        </article>
    );
};

export default Login;

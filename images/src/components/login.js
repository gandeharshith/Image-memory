import React, { useState, useEffect } from 'react';
import { auth, sendEmailVerification } from './firebase.js';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const navigate = useNavigate(); // Import useNavigate hook

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const container = document.getElementById('container');
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');

        const handleRegisterClick = () => {
            container.classList.add("active");
        };

        const handleLoginClick = () => {
            container.classList.remove("active");
        };

        registerBtn.addEventListener('click', handleRegisterClick);
        loginBtn.addEventListener('click', handleLoginClick);

        // Clean up event listeners when component unmounts
        return () => {
            registerBtn.removeEventListener('click', handleRegisterClick);
            loginBtn.removeEventListener('click', handleLoginClick);
        };
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            await sendEmailVerification(); // Wait for email verification to complete
            setMessage('Signed up successfully! Please verify your email.');
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setMessage('The email address is already in use by another account.');
            } else {
                console.error('Error signing up:', error);
                setMessage('Error signing up. Please try again.');
            }
        }
    };
    
    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            if (user && user.emailVerified) {
                const userUID = user.uid; // Get user's UID
                
                localStorage.setItem('userUID', userUID); // Store user UID in localStorage
                navigate("/welcome", { state: { userUID } }); // Navigate to Welcome component with user's UID
            } else {
                setMessage('Email not verified. Please verify your email.');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            if (error.code === 'auth/wrong-password') {
                setMessage('The password is incorrect. Please check your password and try again.');
            } else {
                setMessage('Error signing in. Please try again.');
            }
        }
    };
    
    
    const clearMessage = () => {
        setMessage('');
    };

    return (
        <div className="container" id="container">
            <div className="form-container sign-up">
                <form onSubmit={handleSignUp}>
                    <h1>Create Account</h1>
                    <span>or use your email for registration</span>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" onClick={clearMessage}>Sign Up</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
            <div className="form-container sign-in">
                <form onSubmit={handleSignIn}>
                    <h1>Sign In</h1>
                    <span>or use your email password</span>
                    <input type="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value); clearMessage(); }} />
                    <input type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value); clearMessage(); }} />
                    <a href="#">Forget Your Password?</a>
                    <button type="submit" onClick={clearMessage}>Sign In</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button className="hidden" id="login" onClick={clearMessage}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Welcome, Friend!</h1>
                        <p>Enter your personal details to use all of site features</p>
                        <button className="hidden" id="register" onClick={clearMessage}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

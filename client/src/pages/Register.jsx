import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Login.css'; // Reuse valid styles

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await register(name, email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-card">
                    <h1 className="text-title text-center mb-lg">Create Account</h1>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                                minLength="6"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <p className="auth-footer text-center">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

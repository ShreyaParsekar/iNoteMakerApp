

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  let navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmpassword } = credentials;

    if (password !== confirmpassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const json = await response.json();
      localStorage.setItem('token', json.authToken);
      navigate('/');
      props.showalert("Account created successfullyy", "success")

      if (!response.ok) {
        setError(json.errors ? json.errors[0].msg : 'An error occurred');
        props.showalert("Invalid credentials", "danger")
        return;
      }

      setCredentials({
        name: '',
        email: '',
        password: '',
        confirmpassword: ''
      });
      setError(null);

      
    } catch (err) {
      console.error(err);
      setError('Failed to fetch');
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h2 className="my-5">Signup to create notes</h2>
      <form onSubmit={handleSubmit} className='my-5'>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Enter your Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
            aria-describedby="emailHelp"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onChange}
            aria-describedby="emailHelp"
            required
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            onChange={onChange}
            minLength={6}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmpassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            id="confirmpassword"
            name="confirmpassword"
            onChange={onChange}
            minLength={6}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default Signup;


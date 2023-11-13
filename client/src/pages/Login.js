import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getToken } from "../api/authentication";
import { PageLayout } from '../components/PageLayout';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated (has a token)
    const token = getToken();
    if (token) {
      // Redirect to home if authenticated
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await login(email, password);
      if (response.code === 200) {
        if (response.status == true) {
          navigate("/");
        } else {
          setHasError(true);
          setTimeout(() => {
            setHasError(false);
          }, 3000);
        }
        
      }
    } catch (error) {
      // Handle error, e.g., show an error message to the user
      console.error('Login failed', error);
    }
  };

  return (
    <PageLayout>
      <div className="App">
        <form onSubmit={handleLogin} style={styles.form}>
          <TextField
            label="Email"
            type="text"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          
          {hasError && <p style={styles.errorLabel}>Wrong email or password!</p>}

          <Button type="submit" variant="contained" color="primary" style={styles.submitButton}>
            Login
          </Button>
        </form>
      
      </div>
    </PageLayout>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px',
    margin: '0 auto',
  },
  input: {
    margin: '10px 0',
  },
  submitButton: {
    marginTop: '20px',
  },
  errorLabel: {
    color: 'red',
    marginTop: '10px',
  },
};
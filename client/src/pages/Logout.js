import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { getToken } from "../api/authentication";

export const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    console.log(token)
    if (token === "") {
      // Redirect to login if authenticated
      navigate('/login');
    }
  }, [navigate]);

  return (
    <PageLayout>
      <div className="App" style={styles.container}>
        <h1>Thank you</h1>
      </div>
    </PageLayout>
  );
};

// Define your styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  submitButton: {
    marginTop: '10px',
  },
  errorLabel: {
    color: 'red',
    marginTop: '10px',
  },
};
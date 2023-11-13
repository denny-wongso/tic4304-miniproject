import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { userDetails } from "../api/form";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { setToken, getToken } from "../api/authentication";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

export const Home = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('male');
  const [qualification, setQualification] = useState('');
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [insertFailure, setInsertFailure] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await userDetails(name, email, phone, country, gender, qualification);

      // If the response is successful (status code 200), set the success message and reset the form
      if (response.code === 200) {
        if (response.status === true) {
          setInsertSuccess(true);
          setName('');
          setEmail('');
          setPhone('');
          setCountry('');
          setGender('');
          setQualification('');
  
          // Clear the success message after a certain period of time (e.g., 3 seconds)
          setTimeout(() => {
            setInsertSuccess(false);
          }, 3000);
        } else {
          setInsertFailure(true);
          setMessage(response.message)
          setTimeout(() => {
            setInsertFailure(false);
            setMessage("");
          }, 3000);
        }
      } else {
        setToken("");
        window.location.href = "/login";
      }
    } catch (error) {
      // Handle errors
      console.error('Error submitting user details', error);
    }
  };

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
        <form onSubmit={handleSubmit} style={styles.form}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            type='number'
            label="Phone"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Country"
            variant="outlined"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <InputLabel id="gender-label">Gender *</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
          <TextField
            label="Qualification"
            variant="outlined"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          {insertFailure && <p style={styles.errorLabel}>{message}</p>}

          <Button type="submit" variant="contained" color="primary" style={styles.submitButton}>
            Submit
          </Button>
        </form>

        <Snackbar
          open={insertSuccess}
          autoHideDuration={3000}
          onClose={() => setInsertSuccess(false)}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
          >
            Insertion successful!
          </MuiAlert>
        </Snackbar>
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
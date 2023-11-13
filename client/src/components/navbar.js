import { useState, useEffect } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { getToken, setToken } from "../api/authentication";

export const NavBarButtons = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuth = async () => {   
    const token = await getToken();
    setIsAuthenticated(token !== "" && token !== undefined);
  }

  useEffect(() => {
    const fetchData = async () => {
      await checkAuth();
    };

    fetchData();
  }, []); 

  const loginClick = () =>{ 
    window.location.href = "/login";
  }

  const homeClick = () =>{ 
    window.location.href = "/";
  }

  const thankyouClick = () =>{ 
    window.location.href = "/logout";
  }

  const logoutClick = () =>{ 
    setToken("");
    setIsAuthenticated(false);
    window.location.href = "/login";
  }

  return (
    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"flex-end", mr: 6, mt: 2}}>
      {isAuthenticated === null ? (
        <CircularProgress color="primary" size={40} /> // or any loading indicator
      ) : isAuthenticated ? (
        <>
          <Button variant="contained" color="primary" sx={{ height: 40, mr: 1 }} onClick={logoutClick}>
            Logout
          </Button>
          <Button variant="contained" color="primary" sx={{ height: 40, mr: 1 }} onClick={thankyouClick}>
            Thank you
          </Button>
          <Button variant="contained" color="primary" sx={{ height: 40, mr: 1 }} onClick={homeClick}>
            Home
          </Button>
        </>
      ) : (
        <Button variant="contained" color="primary" sx={{ height: 40, mr: 1 }} onClick={loginClick}>
          Login
        </Button>
      )}
    </Box>
  );
};





import React, { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import GoogleButton from "react-google-button";
import axios from "axios";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import "./logInSection.css";
import GameSection from "../game/components/gameSection";

function LogInSection() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          setIsLogin(true);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
    setIsLogin(false);
  };

  return (
    <div className="logInFromSection">
      <div classname="conatainer">
        {isLogin ? (
          <div className="navbar">
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Tic Tac Toc Game
                </Typography>
                <Button color="inherit" onClick={logOut}>
                  Log out
                </Button>
              </Toolbar>
            </AppBar>
            <GameSection profile={profile} />
          </div>
        ) : (
          <div className="home">
            <h2>Welcome to Tic Tac Toc Game</h2>
            <h5>Sign in to play</h5>
            <center>
              <GoogleButton className="button" onClick={() => login()} />
            </center>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogInSection;

import React, { useState } from "react"
import { Global, css } from '@emotion/react'
import styled from "@emotion/styled"
import Menu from "./components/Menu";
import FriendsList from "./components/FriendsList";
import MediaPlayer from "./components/MediaPlayer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import SongList from "./components/SongList";
import { Albums } from "./resources/Albums";
import SignUp from "./components/SignUp";
import { FirebaseContext } from './components/Firebase';
import SignIn from "./components/SignIn";


function App() {

  const [songId, changeSong] = useState(0);
  const [signUp, handleSignUp] = useState(false)
  const [signIn, handleSignIn] = useState(false)

  function playSong(id) {
    changeSong(id)
  }

  function openSignUpModal() {
    handleSignIn(false)
    handleSignUp(!signUp)
  }

  function openSignInModal() {
    handleSignUp(false)
    handleSignIn(!signIn)
  }

  function closeModal() {
    handleSignUp(false)
    handleSignIn(false)
  }


  const findAlbum = (id) => Albums.find(element => element.id === id);
  const checkModal = signUp || signIn ? "blur(5px)" : "";

  return (
    <>
      <Global
        styles={css`
                *,*::after,*::before {
                    box-sizing: border-box;
                    margin: 0;
                    padding:0;
                }
                
                html {
                    font-family: 'Inter', sans-serif;
                    height: 100%;
                }
                body {
                    background: #f1f1f1;
                    color: #1c1c1c;
                    
                }`
        }
      />
      <FirebaseContext.Consumer>
        {
          firebase => {
            return (
              signIn ?
                <SignIn
                  show={signIn}
                  firebase={firebase}
                  openSignUpModal={openSignUpModal}
                  closeModal={closeModal}
                />
                :
                <SignUp
                  show={signUp}
                  firebase={firebase}
                  openSignInModal={openSignInModal}
                  closeModal={closeModal}
                />)
          }
        }
      </FirebaseContext.Consumer>

      <MainContent checkModal={checkModal}>
        <BrowserRouter>
          <Menu />
          <Switch>
            <ContentWrapper>
              <Route exact path="/" component={Home}>
                <Home
                  openSignInModal={openSignInModal} />
              </Route>
              <Route exact path="/lista/:albumId" render={(routeProps) => (
                <SongList
                  album={{ ...findAlbum(parseInt(routeProps.match.params.albumId)) }}
                  playSong={playSong}
                />
              )}>
              </Route>
            </ContentWrapper>
          </Switch>

          <FriendsList playSong={playSong} />
          <MediaPlayer songId={songId} />

        </BrowserRouter>
      </MainContent>

    </>
  );
}

export default App;

const MainContent = styled.div`
  display: flex;
  flexDirection: row;
  width: 100%;
  height: 100vh;
  filter: ${props => props.checkModal ? `blur(2px)` : ``};
  pointer-events: ${props => props.checkModal ? `none` : `all`};
`

const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 64%;
    height: 85%;
    background-color: #333333;
    overflow-y: scroll;
`
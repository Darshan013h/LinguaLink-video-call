import React from 'react'
import { Navigate, Route ,Routes} from 'react-router'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import OnBoardingPage from './pages/OnBoardingPage.jsx'

import {Toaster} from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios.js'
import PageLoader from './components/PageLoader.jsx'


import useAuthUser from './hooks/useAuthUser.js'

import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useThemeStore.js'

const App = () => {

  // const { data:authData, isLoading, error } = useQuery({
  //   queryKey: ['authUser'],

  //   queryFn: getAuthUser,
  //   retry: false,                
  // });

//as u can check in auth.route of backend we are send get request and send user as data so we writen (.user)


// const authUser = authData?.user
//insted of above we can 
const {isLoading,authUser} = useAuthUser();
const {theme} = useThemeStore();

const isAuthenticated = Boolean(authUser);
const isOnBoarded = authUser?.isOnboarded;

if(isLoading) return <PageLoader/>

  return (
    <div className='h-screen' data-theme = {theme}>
      
      <Routes>
        <Route path="/" element={isAuthenticated && isOnBoarded ? (
          <Layout showSideBar = {true}>
            <HomePage/>
          </Layout>
        ) : (
          <Navigate to = {!isAuthenticated ? "/login" : "/onboarding"} />
        ) } />

        <Route path="/signup" element={ !isAuthenticated ? <SignUpPage/>  : <Navigate to ={
          isOnBoarded? "/" : "/onboarding"
        }/>} />

        <Route path="/login" element={!isAuthenticated? <LoginPage/> : <Navigate to ={
          isOnBoarded? "/" : "/onboarding"
        }/>} />

        <Route path="/notifications" element={isAuthenticated && isOnBoarded  ? (
          <Layout showSideBar = {true}>
             <NotificationPage/> 
          </Layout>
          ): (
          <Navigate to ={ isAuthenticated? "/login" : "/onboarding"}/>
          )} />

        <Route path="/call/:id" element={isAuthenticated && isOnBoarded?( <CallPage/>) : (<Navigate to ={ isAuthenticated? "/login" : "/onboarding"}/>)} />

        <Route 
        path="/chat/:id" 
        element={isAuthenticated && isOnBoarded ? (
          <Layout showSideBar = {false}>
          <ChatPage/>
          </Layout>
          ): <Navigate to ={ isAuthenticated? "/login" : "/onboarding"}/>} />

        <Route path="/onboarding" element={isAuthenticated? (
          !isOnBoarded? (
            <OnBoardingPage/>
          ) :(
            <Navigate to ="/"/>
          )
        ):(
          <Navigate to ="/login"/>
        )} />
      </Routes>
    <Toaster/>
    </div>
  )
}

export default App

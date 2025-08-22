import React ,{useEffect , useState} from 'react';
import {useNavigate , useRoutes} from 'react-router-dom';

import Dashboard from './components/dashboard/Dashboard';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Profile from './components/user/Profile';
import CreateRepo from './components/repo/CreateRepo';

import { useAuth } from './authContext';

const ProjectRoutes =()=>{
     const {currentUser , setCurrentUser} = useAuth();
     const Navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/login" , "/signup"].includes(window.location.pathname)){
            Navigate("/login");
        }

        if((userIdFromStorage && window.location.pathname=='/login')){
            Navigate('/');
        }

    },[currentUser , setCurrentUser , Navigate]);

    let element = useRoutes([
         {
            path:"/",
            element:<Dashboard/>
         },
         {
            path:"/login",
            element:<Login/>
         },
         {
            path:"/signup",
            element:<Signup/>
         },
         {
            path:"/profile",
            element:<Profile/>
         },
         {
            path:"/create",
            element:<CreateRepo/>
         }
    ]);

    return element;
}

export default ProjectRoutes;
import React from 'react';
import ReactDOM from 'react-dom/client';
import Home  from './home'
import App  from './App'
import Bisection from './method/bisection';
import Lagrange from './method/lagrange'


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/Bisection",
    element: <Bisection/>,
  },
  {
    path: "/Lagrange",
    element: <Lagrange/>,
  },



]);

function Frame() {
  return (
      <RouterProvider router={router} />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Frame />);

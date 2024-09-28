import React from 'react';
import ReactDOM from 'react-dom/client';
import App  from './App'
import Bisection from './method/bisection';
import FalsePosition  from './method/falsePosition'
import Lagrange from './method/lagrange';
import './style.css';


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/Bisection",
    element: <Bisection/>,
  },
  {
    path: "/FalsePosition",
    element: <FalsePosition/>,
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

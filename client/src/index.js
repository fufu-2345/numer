import React from 'react';
import ReactDOM from 'react-dom/client';
import App  from './App'
import './style.css';

/////rootequation
import Bisection from './method/rootEquation/bisection';
import FalsePosition  from './method/rootEquation/falsePosition';
import OnepointIteration  from './method/rootEquation/onepointIteration';
import NewtonRapson from './method/rootEquation/newtonRapson';
import Secant from './method/rootEquation/secant';


/////linearAlgebra
import CramerRule from './method/linearAlgebra/cramerRule';


/////Iterpolation
import Lagrange from './method/interPolation/lagrange';
import Spline from './method/interPolation/spline';  ////// not done
import Regression from './method/interPolation/regression';  ////// not done




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
    path: "/OnepointIteration",
    element: <OnepointIteration/>,
  },
  {
    path: "/NewtonRapson",
    element: <NewtonRapson/>,
  },
  {
    path: "/Secant",
    element: <Secant/>,
  },
  {
    path: "/CramerRule",
    element: <CramerRule/>,
  },
  {
    path: "/Lagrange",
    element: <Lagrange/>,
  },
  {
    path: "/Spline",
    element: <Spline/>,
  },
  {
    path: "/Regression",
    element: <Regression/>,
  },
  



]);


////// https://reactrouter.com/en/main/routers/router-provider <-- router

function Frame() {
  return (
      <RouterProvider router={router} />
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Frame />);

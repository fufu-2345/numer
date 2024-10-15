import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const App = () => {
    return (
        <div>
            <p>HOMEEEE</p>
            <br/><br/>
            <div><Link to="/Bisection">Bisection</Link></div>
            <br/>
            <div><Link to="/falsePosition">False position</Link></div>
            <br/>
            <div><Link to="/OnepointIteration">OnepointIteration</Link></div>
            <br/>
            <div><Link to="/NewtonRapson">NewtonRapson</Link></div>
            <br/>
            <div><Link to="/Secant">Secant</Link></div>
            <br/><br/><br/><br/><br/> 
            <div><Link to="/CramerRule">CramerRule</Link></div>
            <br/><br/><br/><br/><br/>
            <div><Link to="/Lagrange">Lagrange</Link></div>
            <br/>
            <div><Link to="/Spline">Spline</Link></div>
            <br/>
            <div><Link to="/Regression">Regression</Link></div>
            <br/><br/><br/><br/><br/>
            <div><Link to="/Trapezoidal">Trapezoidal</Link></div>
            <br/>
            <div><Link to="/Simpson">Simpson</Link></div>
            <br/>
            <div><Link to="/Diff">Diff</Link></div>
            <br/>
            <br/><br/><br/>
        </div>
    );
};

export default App;
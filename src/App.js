import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const App = () => {
    return (
        <div>
            <p>HOMEEEE</p>
            <div><Link to="/Bisection">Bisection</Link></div>
            <br/>
            <div><Link to="/falsePosition">False position</Link></div>
            <br/>
            <div><Link to="/OnepointIteration">OnepointIteration</Link></div>
            <br/>
            <div><Link to="/Lagrange">Lagrange</Link></div>
            <br/>
            <div><Link to="/Spline">Spline</Link></div>
        </div>
    );
};

export default App;
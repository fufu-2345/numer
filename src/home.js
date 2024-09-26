import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <p>HOMEEEE</p>
            <div><Link to="/Bisection">bisection</Link></div>
            <br/>
            <div><Link to="/Lagrange">Lagrange</Link></div>
        </div>
    );
};

export default Home;

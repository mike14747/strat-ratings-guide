import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './subcomponents/navbar';

function Header() {
    return (
        <div id="header" className="row border-bottom px-2">
            <div className="col-md-6">
                <h2 className="text-dark"><Link to="/">Strat Ratings Guide Analysis</Link></h2>
            </div>
            <div className="col-md-6 d-flex justify-content-start align-items-center">
                <Navbar />
            </div>
        </div>
    );
}

export default Header;

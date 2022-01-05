import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './subcomponents/navbar';

function Header() {
    return (
        <header id="header" className="row no-gutters">
            <div className="col-md-auto d-flex justify-content-start align-items-stretch border-bottom border-secondary">
                <div className="d-flex align-items-center">
                    <img src="/images/analyze.png" alt="Strat Ratings Guide Analysis" width="30px" height="33px" className="mx-3" />
                </div>
                <div className="d-flex align-items-center">
                    <h1 className="heading text-dark text-uppercase m-0 d-inline-block py-2 pr-4"><sup>Strat</sup> <Link to="/">Ratings Guide</Link> <sup>Analysis</sup></h1>
                </div>
            </div>
            <nav className="col-md d-flex justify-content-center align-items-stretch border-bottom border-secondary">
                <Navbar />
            </nav>
        </header>
    );
}

export default Header;

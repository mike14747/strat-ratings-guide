import React from 'react';
import Navbar from './subcomponents/navbar';

function Header() {
    return (
        <div id="header" className="row border-bottom px-2">
            <div className="col-md-6 d-flex justify-content-start align-items-center">
                <img src="/images/analyze.png" alt="Strat Ratings Guide Analysis" width="24px" height="24px" className="mr-3" />
                <h4 className="text-dark text-uppercase my-2 ls-1 d-inline-block">Strat Ratings Guide Analysis</h4>
            </div>
            <div className="col-md-6 d-flex justify-content-start align-items-center">
                <Navbar />
            </div>
        </div>
    );
}

export default Header;

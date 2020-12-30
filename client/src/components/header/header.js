import React from 'react';
import Navbar from './subcomponents/navbar';

function Header() {
    return (
        <div id="header" className="border-bottom border-secondary">
            <div className="d-flex justify-content-start align-items-stretch">
                <div className="d-flex align-items-center">
                    <img src="/images/analyze.png" alt="Strat Ratings Guide Analysis" width="30px" height="33px" className="mx-3" />
                </div>
                <div className="d-flex align-items-center border-right border-secondary">
                    <h4 className="text-dark text-uppercase m-0 d-inline-block py-2 pr-4"><sup>Strat</sup> Ratings Guide <sup>Analysis</sup></h4>
                </div>
                <Navbar />
            </div>
        </div>
    );
}

export default Header;

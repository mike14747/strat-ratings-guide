import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="text-center border-bottom border-dark p-2 bg-light">
            <Link to="/">
                Home
            </Link>
            <span className="mx-4">|</span>
            <Link to="/hitterAnalysis">
                View Hitter Analysis
            </Link>
            <span className="mx-4">|</span>
            <Link to="/uploadHitterData">
                Upload Hitter Data
            </Link>
            <span className="mx-4">|</span>
            <Link to="/multiTeamHitterAnalysis">
                View Multi-Team Hitter Analysis
            </Link>
            <span className="mx-4">|</span>
            <Link to="/uploadMultiTeamHitterData">
                Upload Multi-Team Hitter Data
            </Link>
            <span className="mx-4">|</span>
            <Link to="/pitcherAnalysis">
                View Pitcher Analysis
            </Link>
            <span className="mx-4">|</span>
            <Link to="/uploadPitcherData">
                Upload Pitcher Data
            </Link>
            <span className="mx-4">|</span>
            <Link to="/multiTeamPitcherAnalysis">
                View Multi-Team Pitcher Analysis
            </Link>
            <span className="mx-4">|</span>
            <Link to="/uploadMultiTeamPitcherData">
                Upload Multi-Team Pitcher Data
            </Link>
        </div>
    );
}

export default Navbar;

import React from 'react';
import Dropdown from './dropdown/dropdown';

function Navbar() {
    const viewItems = [
        {
            text: 'Hitter Analysis',
            url: '/hitterAnalysis',
        },
        {
            text: 'Multi-Team Hitter Analysis',
            url: '/multiTeamHitterAnalysis',
        },
        {
            text: 'Pitcher Analysis',
            url: '/uploadPitcherAnalysis',
        },
        {
            text: 'Multi-Team Pitcher Analysis',
            url: '/multiTeamPitcherAnalysis',
        },
    ];
    const uploadItems = [
        {
            text: 'Hitter Data',
            url: '/uploadHitterData',
        },
        {
            text: 'Multi-Team Hitter Data',
            url: '/uploadMultiTeamHitterData',
        },
        {
            text: 'Pitcher Data',
            url: '/uploadPitcherData',
        },
        {
            text: 'Multi-Team Pitcher Data',
            url: '/uploadMultiTeamPitcherrData',
        },
    ];
    return (
        <div>
            <Dropdown buttonText="View" listItems={viewItems} />
            <Dropdown buttonText="Upload" listItems={uploadItems} />
        </div>
    );
}

export default Navbar;

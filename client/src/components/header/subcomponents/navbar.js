import React from 'react';
import Dropdown from './dropdown/dropdown';

function Navbar() {
    const viewItems = [
        {
            text: 'Hitter Analysis',
            url: '/hitterAnalysis',
        },
        {
            text: 'Pitcher Analysis',
            url: '/pitcherAnalysis',
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
            url: '/uploadMultiTeamPitcherData',
        },
    ];
    return (
        <>
            <Dropdown buttonText="View Analysis" listItems={viewItems} />
            <Dropdown buttonText="Upload Data" listItems={uploadItems} />
        </>
    );
}

export default Navbar;

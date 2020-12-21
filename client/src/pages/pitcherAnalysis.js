import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeasonDropdown from '../components/seasonDropdown/seasonDropdown';

function PitcherAnalysis() {
    const [season, setSeason] = useState(null);
    const [latestSeason, setLatestSeason] = useState(null);
    const querySeason = season || latestSeason;

    const [seasonList, setSeasonList] = useState([]);
    const [pitcherData, setPitcherData] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSelectedSeason = season => setSeason(season);

    const thLabels = ['Year', 'Team', 'Pitcher', 'Throws', 'IP', 'SO v L', 'BB v L', 'Hit v L', 'OB v L', 'TB v L', 'HR v L', 'BP v L', 'DP v L', 'wOPS v L', 'SO v R', 'BB v R', 'Hit v R', 'OB v R', 'TB v R', 'HR v R', 'BP v R', 'DP v R', 'wOPS v R', 'Hold', 'Endurance', 'Fielding', 'Balk', 'WP', 'Batting', 'Stl', 'Spd', 'RML Team'];

    useEffect(() => {
        axios.get('/api/pitchers/season-list')
            .then(response => {
                setErrorMessage(null);
                if (response.data.length > 0) {
                    setLatestSeason(Math.max(...response.data.map(y => y.h_year)));
                    setSeasonList(response.data.map(s => s.h_year));
                } else {
                    setSeasonList([]);
                }
            })
            .catch(error => {
                setErrorMessage('An error occurred fetching pitcher data!');
                console.error(error.message);
            });
    }, []);

    useEffect(() => {
        if (querySeason) {
            axios.get(`/api/pitchers/${querySeason}`)
                .then(response => setPitcherData(response.data))
                .catch(error => console.error(error.message));
        }
    }, [querySeason]);

    return (
        <>
            <div className="row no-gutters mb-4 bg-gray5 border-bottom border-secondary">
                <div className="col-sm-6 text-left">
                    <h4 className="p-2">Pitcher Analysis</h4>
                </div>
                <div className="col-sm-6 text-right">
                    <SeasonDropdown currentSeason={querySeason} buttonText="View Analysis From" listItems={seasonList} handleSelectedSeason={handleSelectedSeason} />
                </div>
            </div>
            {errorMessage &&
                <h4 className="my-4 text-center text-danger">
                    {errorMessage}
                </h4>
            }
        </>
    );
};

export default PitcherAnalysis;

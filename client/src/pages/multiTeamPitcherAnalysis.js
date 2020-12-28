import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeasonDropdown from '../components/seasonDropdown/seasonDropdown';

function MultiTeamPitcherAnalysis() {
    const [season, setSeason] = useState(null);
    const [latestSeason, setLatestSeason] = useState(null);
    const querySeason = season || latestSeason;

    const [seasonList, setSeasonList] = useState([]);
    const [pitcherData, setPitcherData] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSelectedSeason = season => setSeason(season);

    const thLabels = ['Year', 'Team', 'Pitcher', 'Throws', 'IP', 'SO v L', 'BB v L', 'Hit v L', 'OB v L', 'TB v L', 'HR v L', 'BP v L', 'DP v L', 'wOPS v L', 'SO v R', 'BB v R', 'Hit v R', 'OB v R', 'TB v R', 'HR v R', 'BP v R', 'DP v R', 'wOPS v R', 'Hold', 'Endurance', 'Fielding', 'Balk', 'WP', 'Batting', 'Stl', 'Spd', 'RML Team'];

    useEffect(() => {
        axios.get('/api/pitchers/multi-team-season-list')
            .then(response => {
                setErrorMessage(null);
                if (response.data.length > 0) {
                    setLatestSeason(Math.max(...response.data.map(y => y.year)));
                    setSeasonList(response.data.map(s => s.year));
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
            axios.get(`/api/pitchers/multi-team/${querySeason}`)
                .then(response => {
                    console.log(response.data);
                    setPitcherData(response.data);
                })
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
            {pitcherData && pitcherData.length > 0 &&
                <table className="tables small m-4">
                    <thead>
                        <tr>
                            {thLabels.map((th, index) => (
                                <th key={index} className="text-center p-1 bg-th">{th}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pitcherData.map((p, i) => (
                            <tr key={i}>
                                <td className="text-center p-1">{p.p_year}</td>
                                <td className="text-left p-1">{p.real_team}</td>
                                <td className="text-left p-1">{p.pitcher_name}</td>
                                <td className="text-center p-1">{p.throws}</td>
                                <td className="text-center p-1">{p.ip}</td>
                                <td className="text-center p-1">{p.so_v_l}</td>
                                <td className="text-center p-1">{p.bb_v_l}</td>
                                <td className="text-center p-1">{p.hit_v_l}</td>
                                <td className="text-center p-1">{p.ob_v_l}</td>
                                <td className="text-center p-1">{p.tb_v_l}</td>
                                <td className="text-center p-1">{p.hr_v_l}</td>
                                <td className="text-center p-1">{p.bp_v_l}</td>
                                <td className="text-center p-1">{p.dp_v_l}</td>
                                <td className="text-center p-1 font-weight-bolder">{p.wops_v_l}</td>
                                <td className="text-center p-1">{p.so_v_r}</td>
                                <td className="text-center p-1">{p.bb_v_r}</td>
                                <td className="text-center p-1">{p.hit_v_r}</td>
                                <td className="text-center p-1">{p.ob_v_r}</td>
                                <td className="text-center p-1">{p.tb_v_r}</td>
                                <td className="text-center p-1">{p.hr_v_r}</td>
                                <td className="text-center p-1">{p.bp_v_r}</td>
                                <td className="text-center p-1">{p.dp_v_r}</td>
                                <td className="text-center p-1 font-weight-bolder">{p.wops_v_r}</td>
                                <td className="text-center p-1">{p.hold}</td>
                                <td className="text-left p-1">{p.endurance}</td>
                                <td className="text-left p-1">{p.fielding}</td>
                                <td className="text-center p-1">{p.balk}</td>
                                <td className="text-center p-1">{p.wp}</td>
                                <td className="text-center p-1">{p.batting_b}</td>
                                <td className="text-center p-1">{p.stl}</td>
                                <td className="text-center p-1">{p.spd}</td>
                                <td className="text-left p-1">{p.rml_team_name}</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            }
        </>
    );
}

export default MultiTeamPitcherAnalysis;

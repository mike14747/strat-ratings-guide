import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeasonDropdown from '../components/seasonDropdown/seasonDropdown';

function HitterAnalysis() {
    const [season, setSeason] = useState(null);
    const [latestSeason, setLatestSeason] = useState(null);
    const querySeason = season || latestSeason;

    const [seasonList, setSeasonList] = useState([]);
    const [hitterData, setHitterData] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSelectedSeason = season => setSeason(season);

    const thLabels = ['Year', 'Team', 'Hitter', 'Bats', 'INJ', 'AB', 'SO v L', 'BB v L', 'Hit v L', 'OB v L', 'TB v L', 'HR v L', 'BP v L', 'DP v L', 'wOPS v L', 'SO v R', 'BB v R', 'Hit v R', 'OB v R', 'TB v R', 'HR v R', 'BP v R', 'DP v R', 'wOPS v R', 'Stealing', 'Speed', 'Bunt', 'H&R', 'CA', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Fielding', 'RML Team'];

    useEffect(() => {
        axios.get('/api/hitters/season-list')
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
                setErrorMessage('An error occurred fetching hitter data');
                console.error(error.message);
            });
    }, []);

    useEffect(() => {
        if (querySeason) {
            axios.get(`/api/hitters/${querySeason}`)
                .then(response => setHitterData(response.data))
                .catch(error => console.error(error.message));
        }
    }, [querySeason]);

    return (
        <>
            <div className="row no-gutters mb-4 bg-gray5 border-bottom border-secondary">
                <div className="col-sm-6 text-left">
                    <h4 className="p-2">Hitter Analysis</h4>
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
            {hitterData && hitterData.length > 0 &&
                <table className="tables small-2 m-4">
                    <thead>
                        <tr>
                            {thLabels.map((th, index) => (
                                <th key={index} className="text-center p-0 bg-th sticky-th">
                                    <div className="th-inner p-1">
                                        {th}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hitterData.map((h, i) => (
                            <tr key={i}>
                                <td className="text-center p-1">{h.h_year}</td>
                                <td className="text-left p-1">{h.real_team}</td>
                                <td className="text-left p-1">{h.hitter_name}</td>
                                <td className="text-center p-1">{h.bats}</td>
                                <td className="text-center p-1">{h.injury}</td>
                                <td className="text-center p-1">{h.ab}</td>
                                <td className="text-center p-1">{h.so_v_l}</td>
                                <td className="text-center p-1">{h.bb_v_l}</td>
                                <td className="text-center p-1">{h.hit_v_l}</td>
                                <td className="text-center p-1">{h.ob_v_l}</td>
                                <td className="text-center p-1">{h.tb_v_l}</td>
                                <td className="text-center p-1">{h.hr_v_l}</td>
                                <td className="text-center p-1">{h.w_v_l}</td>
                                <td className="text-center p-1">{h.dp_v_l}</td>
                                <td className="text-center p-1 font-weight-bolder">{h.wops_v_l}</td>
                                <td className="text-center p-1">{h.so_v_r}</td>
                                <td className="text-center p-1">{h.bb_v_r}</td>
                                <td className="text-center p-1">{h.hit_v_r}</td>
                                <td className="text-center p-1">{h.ob_v_r}</td>
                                <td className="text-center p-1">{h.tb_v_r}</td>
                                <td className="text-center p-1">{h.hr_v_r}</td>
                                <td className="text-center p-1">{h.w_v_r}</td>
                                <td className="text-center p-1">{h.dp_v_r}</td>
                                <td className="text-center p-1 font-weight-bolder">{h.wops_v_r}</td>
                                <td className="text-left p-1">{h.stealing}</td>
                                <td className="text-center p-1">{h.spd}</td>
                                <td className="text-center p-1">{h.bunt}</td>
                                <td className="text-center p-1">{h.h_r}</td>
                                <td className="text-center p-1">{h.d_ca}</td>
                                <td className="text-center p-1">{h.d_1b}</td>
                                <td className="text-center p-1">{h.d_2b}</td>
                                <td className="text-center p-1">{h.d_3b}</td>
                                <td className="text-center p-1">{h.d_ss}</td>
                                <td className="text-center p-1">{h.d_lf}</td>
                                <td className="text-center p-1">{h.d_cf}</td>
                                <td className="text-center p-1">{h.d_rf}</td>
                                <td className="text-left p-1">{h.fielding}</td>
                                <td className="text-left p-1">{h.rml_team_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </>

    );
}

export default HitterAnalysis;

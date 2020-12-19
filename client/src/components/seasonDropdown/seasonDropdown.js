import React, { Fragment } from 'react';
import './css/seasonDropdown.css';
import PropTypes from 'prop-types';

function SeasonDropdown({ currentSeason, buttonText, listItems, handleSelectedSeason }) {
    return (
        <div className="p-2">
            {currentSeason &&
                <Fragment>
                    <span className="small">Current View:</span> <span className="font-weight-bolder">{currentSeason}</span>
                </Fragment>
            }
            <div className="dropdown ml-2 text-center">
                <button className="dropbtn">{buttonText}<i className="down"></i></button>
                <ul className="dropdown-content">
                    {listItems.map((item, i) => (
                        <Fragment key={i}>
                            {currentSeason && (item === currentSeason)
                                ? <li className="viewing">{item}</li>
                                : <li onClick={() => handleSelectedSeason(item)}>{item}</li>
                            }
                        </Fragment>
                    ))}
                </ul>
            </div>
        </div>
    );
}

SeasonDropdown.propTypes = {
    currentSeason: PropTypes.number,
    buttonText: PropTypes.string,
    listItems: PropTypes.array,
    handleSelectedSeason: PropTypes.func,
};

export default SeasonDropdown;

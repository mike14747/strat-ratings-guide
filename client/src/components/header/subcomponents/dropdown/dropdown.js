import React from 'react';
import { Link } from 'react-router-dom';
import './css/dropdown.css';
import PropTypes from 'prop-types';

const Dropdown = ({ buttonText, listItems }) => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="navdropdown">
                <div className="navdropbtn">{buttonText}<i className="arrow down"></i></div>
                <div className="navdropdown-content">
                    {listItems.map((item, index) => (
                        <div className="item" key={index}>
                            <Link to={item.url}>{item.text}</ Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

Dropdown.propTypes = {
    buttonText: PropTypes.string,
    listItems: PropTypes.array,
};

export default Dropdown;

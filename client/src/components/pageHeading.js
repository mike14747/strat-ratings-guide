import React from 'react';
import PropTypes from 'prop-types';

const PageHeading = (props) => {
    return <h4 className="p-2 m-0">{props.text}</h4>;
};

PageHeading.propTypes = {
    text: PropTypes.string,
};

export default PageHeading;

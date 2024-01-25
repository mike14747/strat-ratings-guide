import React from 'react';
import PropTypes from 'prop-types';

const PageHeading = (props) => {
    return <h2 className="page-heading text-left p-2 m-0">{props.text}</h2>;
};

PageHeading.propTypes = {
    text: PropTypes.string,
};

export default PageHeading;

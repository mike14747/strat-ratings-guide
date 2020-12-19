import React from 'react';

const NoMatch = () => {
    return (
        <div className="m-5 bigger">
            <p className="text-danger"><b>Error 404!</b></p>
            <p>An error has occurred.</p>
            <p>The page you are looking for does not exist!</p>
        </div>
    );
};

export default NoMatch;

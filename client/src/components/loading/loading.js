import React from 'react';
import LoadingSwirly from './images/loading.gif';
import './css/loading.css';

const Loading = () => {
    return (
        <div className="loading">
            <img src={LoadingSwirly} alt={'Loading'} />
        </div>
    );
};

export default Loading;

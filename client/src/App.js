import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/header/header';
import Home from './pages/home';
import NoMatch from './pages/noMatch';
import HitterAnalysis from './pages/hitterAnalysis';
import MultiTeamHitterAnalysis from './pages/multiTeamHitterAnalysis';
import UploadHitterData from './pages/uploadHitterData';
import UploadMultiTeamHitterData from './pages/uploadMultiTeamHitterData';
import PitcherAnalysis from './pages/pitcherAnalysis';
import MultiTeamPitcherAnalysis from './pages/multiTeamPitcherAnalysis';
import UploadPitcherData from './pages/uploadPitcherData';
import UploadMultiTeamPitcherData from './pages/uploadMultiTeamPitcherData';

import './css/my_style.css';
import './css/app_style.css';

function App() {
    return (
        // the router can have only one child element
        <Router>
            <div className="container-fluid bg-white">
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/hitterAnalysis" component={HitterAnalysis} />
                    <Route exact path="/uploadHitterData" component={UploadHitterData} />
                    <Route exact path="/multiTeamHitterAnalysis" component={MultiTeamHitterAnalysis} />
                    <Route exact path="/uploadMultiTeamHitterData" component={UploadMultiTeamHitterData} />
                    <Route exact path="/pitcherAnalysis" component={PitcherAnalysis} />
                    <Route exact path="/uploadPitcherData" component={UploadPitcherData} />
                    <Route exact path="/multiTeamPitcherAnalysis" component={MultiTeamPitcherAnalysis} />
                    <Route exact path="/uploadMultiTeamPitcherData" component={UploadMultiTeamPitcherData} />
                    <Route component={NoMatch} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;

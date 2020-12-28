import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/header';
import Navbar from './components/navbar';
import Home from './pages/home';
import NoMatch from './pages/noMatch';
import HitterAnalysis from './pages/hitterAnalysis';
import MultiTeamHitterAnalysis from './pages/multiTeamHitterAnalysis';
import UploadHitterData from './pages/uploadHitterData';
import UploadMultiTeamHitterData from './pages/uploadMultiTeamHitterData';
import PitcherAnalysis from './pages/pitcherAnalysis';
import UploadPitcherData from './pages/uploadPitcherData';

import './css/my_style.css';
import './css/app_style.css';

function App() {
    return (
        // the router can have only one child element
        <Router>
            <div className="bg-white">
                <Header />
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/hitterAnalysis" component={HitterAnalysis} />
                    <Route exact path="/multiTeamHitterAnalysis" component={MultiTeamHitterAnalysis} />
                    <Route exact path="/uploadHitterData" component={UploadHitterData} />
                    <Route exact path="/uploadMultiTeamHitterData" component={UploadMultiTeamHitterData} />
                    <Route exact path="/pitcherAnalysis" component={PitcherAnalysis} />
                    <Route exact path="/uploadPitcherData" component={UploadPitcherData} />
                    <Route component={NoMatch} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;

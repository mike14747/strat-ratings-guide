import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Header from './components/header/header';
import Footer from './components/footer';
import Home from './pages/home';
import NoMatch from './pages/noMatch';
import HitterAnalysis from './pages/hitterAnalysis';
import UploadHitterData from './pages/uploadHitterData';
import UploadMultiTeamHitterData from './pages/uploadMultiTeamHitterData';
import PitcherAnalysis from './pages/pitcherAnalysis';
import UploadPitcherData from './pages/uploadPitcherData';
import UploadMultiTeamPitcherData from './pages/uploadMultiTeamPitcherData';
import Login from './pages/login';
import UserContext from './context/userContext';

import './css/my_style.css';
import './css/app_style.css';

function App() {
    const [user, setUser] = useState(null);

    return (
        // the router can have only one child element
        <Router>
            <div id="app-wrapper">
                <UserContext.Provider value={{ user, setUser }}>
                    <Header />
                    <div className="container-fluid flex-fill bg-white">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/hitterAnalysis" component={HitterAnalysis} />
                            <Route exact path="/uploadHitterData" component={UploadHitterData} />
                            <Route exact path="/uploadMultiTeamHitterData" component={UploadMultiTeamHitterData} />
                            <Route exact path="/pitcherAnalysis" component={PitcherAnalysis} />
                            <Route exact path="/uploadPitcherData" component={UploadPitcherData} />
                            <Route exact path="/uploadMultiTeamPitcherData" component={UploadMultiTeamPitcherData} />
                            <Route exact path="/login">
                                {user ? <Redirect to="/" /> : <Login />}
                            </Route>
                            <Route component={NoMatch} />
                        </Switch>
                    </div>
                    <Footer />
                </UserContext.Provider>
            </div>
        </Router>
    );
}

export default App;

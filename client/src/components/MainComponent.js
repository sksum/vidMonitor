import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { BrowserRouter as Router , Switch, Route } from 'react-router-dom';

const MainComponent = () => {
    return(
        <>
            <Router>
                <Switch>
                    <Route exact path="/"/>
                    <Route exact path="/new"/>
                    <Route exact path="/newnew"/>
                </Switch>
            </Router>
        </>
    );
}
export default MainComponent;
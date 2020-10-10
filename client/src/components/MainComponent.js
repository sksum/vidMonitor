import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import MainPage from './MainPage'

const MainComponent = () => {
    return(
        <>
            <Router>
                <Switch>
                    <Route exact path="/">
                    <MainPage />
                    </Route>
                    <Route exact path="/new">
                    hell
                    </Route>
                    <Route exact path="/newnew">
                    he
                    </Route>
                </Switch>
            </Router>
        </>
    );
}
export default MainComponent;
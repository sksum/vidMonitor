import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Header from './Header.jsx';
import NewForm from './NewForm.jsx';

import { BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import MainPage from './MainPage'

const MainComponent = () => {
    return(
        <>
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component={MainPage}/>
                    <Route exact path="/new" component={NewForm}/>
                    <Route exact path="/newnew">
                    he
                    </Route>
                </Switch>
            </Router>
        </>
    );
}
export default MainComponent;
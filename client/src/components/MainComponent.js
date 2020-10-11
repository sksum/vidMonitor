import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import Header from './Header.jsx';
import NewForm from './NewForm.jsx';

import { BrowserRouter as Router , Switch, Route } from 'react-router-dom';
import MainPage from './MainPage'

import Test_student from './Video/Test_student.jsx';
import Test_invil from './Video/Test_invil.jsx';

const MainComponent = () => {
    return(
        <>
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/" component = {MainPage} />
                    <Route exact path="/new" component = {NewForm} />
                    <Route path="/test/:roomID" component = {Test_student} />
                    <Route path="/invil/:roomID" component = {Test_invil} />
                </Switch>
            </Router>
        </>
    );
}
export default MainComponent;
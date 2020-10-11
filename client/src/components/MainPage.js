import React from "react";
import { v1 as uuid } from "uuid";
import LOGO from './LOGO.js';

const MainPage = (props) => {
    function create(what) {
        const id = uuid();  
        props.history.push(`/${what}/${id}`);
    }

    return (
        <>
        <LOGO />
            {/* <button onClick={()=>create("room")}>Create Room</button>
            <button onClick={()=>create("invil")}>Create Test</button> */}
        </>
    );
}

export default MainPage;
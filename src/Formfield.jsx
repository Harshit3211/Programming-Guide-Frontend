import React from "react";
import "./App.css";

function Formfield(props) {
    return (
        <div>
            {props.children}
            <input
                className="form-control"
                type="text"
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                placeholder=" Enter number "
            />
        </div>
    );
}

export default Formfield;

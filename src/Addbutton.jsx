import React from "react";
import "./App.css";

function Addbutton(props) {
    if (props.users.length < 3)
        return (
            <button
                className="btn btn-warning btn-sm"
                style={{
                    borderRadius: `100%`,
                    color: `white`,
                    marginLeft: `5px`,
                }}
                type="submit"
            >
                <bold>+</bold>
            </button>
        );
    else return <></>;
}

export default Addbutton;

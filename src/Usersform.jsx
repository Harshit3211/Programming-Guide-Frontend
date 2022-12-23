import React from "react";
import AddButton from "./Addbutton";
import "./App.css";

function Usersform(props) {
    return (
        <div>
            <form onSubmit={props.onAddButton}>
                {props.children}

                {props.users.map((user, index) => (
                    <input
                        className="handleInput"
                        name={props.name}
                        key={index}
                        type="text"
                        value={user}
                        onChange={(event) => props.onChange(event, index)}
                        style={{ marginRight: `5px` }}
                    />
                ))}
                <AddButton users={props.users} name={props.name} />
            </form>
        </div>
    );
}

export default Usersform;

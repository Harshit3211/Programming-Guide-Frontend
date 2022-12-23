import React from 'react';
import axios from 'axios';
import makeAnimated from 'react-select/animated';
import './App.css';
import Usersform from './Usersform';

import Formfield from './Formfield';
import Select from 'react-select';

const baseUrl = `https://programming-guide-backend-harshit3211.onrender.com`;

const numRegex = /^[0-9]+$/;

function App() {
  const [Query, updateQuery] = React.useState({
    result: null,
    usersQuery: '',
    roundQuery: '',
    nopQuery: '',
    lbQuery: '',
    ubQuery: '',
    users: [''],
    friends: [''],
    tags: [],
    selectedTags: [],
  });

  axios.get(`${baseUrl}/tags`).then((response) => {
    updateQuery((prevState) => {
      const opt = response.data.map((tag, id) => ({
        id,
        value: tag,
        label: tag,
      }));

      return {
        ...prevState,
        [`tags`]: opt,
      };
    });
  });

  function onNumberChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    updateQuery((prevState) => {
      if (value === '' || numRegex.test(value)) {
        return {
          ...prevState,
          [name]: value,
        };
      } else {
        return {
          ...prevState,
          [name]: '',
        };
      }
    });
  }

  function onTagListChange(selectedOptions) {
    updateQuery((prevState) => {
      return {
        ...prevState,
        [`selectedTags`]: selectedOptions,
      };
    });
  }

  function fetchResults() {
    let tagsQuery = '';
    let usersQuery = '';
    let friendsQuery = '';
    Query.selectedTags.forEach((tag) => (tagsQuery += `${tag.label},`));
    Query.users.forEach((user) => {
      user = user.trim();
      if (user.length) usersQuery += `${user},`;
    });
    Query.friends.forEach((friend) => {
      friend = friend.trim();
      if (friend.length) friendsQuery += `${friend},`;
    });
    usersQuery = usersQuery.substr(0, usersQuery.length - 1);
    friendsQuery = friendsQuery.substr(0, friendsQuery.length - 1);

    const url = `${baseUrl}/get/?handles=${usersQuery}&friends=${friendsQuery}&tags=${tagsQuery}&ROUND=${Query.roundQuery}&nop=${Query.nopQuery}&lowerBound=${Query.lbQuery}&upperBound=${Query.ubQuery}`;
    const request = axios.get(url);
    // console.log(url);
    request.then((response) =>
      updateQuery((prevState) => {
        return {
          ...prevState,
          [`result`]: response.data,
        };
      })
    );
  }

  function onSearchSubmit(event) {
    fetchResults();
    event.preventDefault();
  }

  function onUserAddButton(event, name) {
    updateQuery((prevState) => {
      const updatedUsers = [...prevState[name], ''];
      return {
        ...prevState,
        [name]: updatedUsers,
      };
    });
    event.preventDefault();
  }

  function onUserChange(event, index) {
    const name = event.target.name;
    const value = event.target.value;
    updateQuery((prevState) => {
      const newUsers = [...prevState[name]];
      newUsers[index] = value;
      return {
        ...prevState,
        [name]: newUsers,
      };
    });
  }

  function ResultTable() {
    if (Query.result)
      return (
        <div>
          <table className="table table-striped">
            <thead>
              <tr id="header">
                <th>Index</th>
                <th>Problem</th>
                <th>Rating</th>
                <th>Solved by</th>
              </tr>
            </thead>
            <tbody>
              {Query.result.problems.map((problem, index) => (
                <tr className="result-row" key={index}>
                  <td>{`${problem.contestId} ${problem.index}`}</td>
                  <th>
                    <a
                      key={index}
                      href={`https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`}
                      target={`_blank`}
                      style={{ color: 'black' }}
                    >
                      {problem.name}
                    </a>
                  </th>
                  <td>{problem.rating}</td>
                  <td>{problem.solved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    else return <div></div>;
  }

  function InvalidHandles() {
    if (Query.result && Query.result.invalidHandles.length) {
      let invalidstr = '';
      Query.result.invalidHandles.forEach((invalidhandle) => {
        if (invalidhandle.length) invalidstr += `${invalidhandle},`;
      });
      invalidstr = invalidstr.substr(0, invalidstr.length - 1);
      return <strong>IGNORING INVALID HANDLE(S):{invalidstr}</strong>;
    } else return <div></div>;
  }

  function Msg() {
    if (
      Query.result &&
      Query.result.isless === 1 &&
      Query.result.problems.length > 0
    )
      return <strong>THATS ALL YOU HAVE TO DO!!</strong>;
    else if (
      Query.result &&
      Query.result.isless === 1 &&
      Query.result.problems.length === 0 &&
      Query.friends.length !== 0
    )
      return (
        <strong>FOR THIS QUERY, YOU ARE AT PAR WITH YOUR FRIENDS!!</strong>
      );
    else return <div></div>;
  }

  const animatedComponents = makeAnimated();

  return (
    <div>
      <div className="form-group row">
        <label className="col-sm-5 col-form-label">Handle :</label>
        <div className="col-sm-7 mblscr" id="sep">
          <Usersform
            name="users"
            users={Query.users}
            onChange={onUserChange}
            onAddButton={(event) => onUserAddButton(event, 'users')}
          />
        </div>
        <label className="col-sm-5 col-form-label">Friend's Handle :</label>
        <div className="col-sm-7 mblscr" id="sep">
          <Usersform
            name="friends"
            users={Query.friends}
            onChange={onUserChange}
            onAddButton={(event) => onUserAddButton(event, 'friends')}
          />
        </div>
      </div>
      <div className="form">
        <form onSubmit={onSearchSubmit}>
          <div className="form-group row">
            <label className="col-sm-5 col-form-label">Tags :</label>
            <div className="col-sm-4" id="sep">
              <Select
                isMulti={true}
                autosize={true}
                isSearchable={true}
                components={animatedComponents}
                onChange={onTagListChange}
                options={Query.tags}
              />
            </div>
            <label className="col-sm-5 col-form-label">BaseRound :</label>
            <div className="col-sm-4" id="sep">
              <Formfield
                name="roundQuery"
                value={Query.roundQuery}
                onChange={onNumberChange}
              />
            </div>
            <label className="col-sm-5 col-form-label">
              Number of problems :
            </label>
            <div className="col-sm-4" id="sep">
              <Formfield
                name="nopQuery"
                value={Query.nopQuery}
                onChange={onNumberChange}
              />
            </div>
            <label className="col-sm-5 col-form-label">Minimum Rating :</label>
            <div className="col-sm-4" id="sep">
              <Formfield
                name="lbQuery"
                value={Query.lbQuery}
                onChange={onNumberChange}
              />
            </div>
            <label className="col-sm-5 col-form-label">Maximum Rating :</label>
            <div className="col-sm-4" id="sep">
              <Formfield
                name="ubQuery"
                value={Query.ubQuery}
                onChange={onNumberChange}
              />
            </div>
          </div>
          <div style={{ marginTop: `3px`, textAlign: `center` }}>
            <button
              className="query btn btn-warning"
              style={{ color: `white` }}
              type="submit"
            >
              Generate List
            </button>
          </div>
        </form>
      </div>

      <div style={{ textAlign: `center` }}>
        <InvalidHandles></InvalidHandles>
        <ResultTable></ResultTable>
        <Msg></Msg>
      </div>
    </div>
  );
}

export default App;

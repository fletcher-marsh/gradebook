import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    addStudent,
    delete: _delete
};

function login(username, password) {
    // const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, password })
    // };
    const payload = {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/api/obtain_token",
        data: JSON.stringify({ username, password }),
        dataType: "json"
    }
    // console.log(payload);
    return $.ajax(payload, handleLogin);
        // .then(response => {
        //     if (!response.ok) { 
        //         return Promise.reject(response.statusText);
        //     }
        //     console.log(response.json());
        //     return response.json();
        // })
        // .then(user => {
        //     // login successful if there's a jwt token in the response
        //     if (user && user.token) {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         localStorage.setItem('user', JSON.stringify(user));
        //     }
        //     return user;
        // });
}

function handleLogin(response) {
    // console.log(response);
    if (response.ok) {
        var user = response.json();
    }
    else {
        var user = Promise.reject(response.statusText);
    }
    console.log(user);
    if (user && user.token) {
        localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll(user) {
    // const requestOptions = {
    //     method: 'GET',
    //     headers: authHeader()
    // };
    var payload = {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/api/get_gradebook",
        headers: {
            "Authorization" : 'JWT ' + user['token']
        },
        dataType: "json"
    }
    return $.ajax(payload, handleResponse);
    // return fetch('/users', requestOptions).then(handleResponse);
}

function addStudent(user, newName, newAssign, newGrade) {
    var payload = {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/api/add_entry",
        headers: {
            "Authorization" : 'JWT ' + user['token']
        },
        data: JSON.stringify({ student: newName, assignment: newAssign, grade: parseInt(newGrade) }),
        dataType: "json"
    }
    return $.ajax(payload, handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch('/users/' + _id, requestOptions).then(handleResponse);
}

function register(user) {
    // const requestOptions = {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    //     body: user
    // };

    const payload = {
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/api/register",
        data: JSON.stringify(user),
        dataType: "json"
    }
    return $.ajax(payload, handleResponse);
    // return fetch('http://127.0.0.1:8000/api/register', requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };
    return fetch('/users/' + user.id, requestOptions).then(handleResponse);
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch('/users/' + id, requestOptions).then(handleResponse);;
}

function handleResponse(response) {
    if (!response.ok) { 
        return Promise.reject(response.statusText);
    }
    console.log(this);
    return response.json();
}
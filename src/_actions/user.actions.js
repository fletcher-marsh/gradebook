import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete,
    addStudent,
};


function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => { 
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(success(user));
                    history.push('/grades');
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll(user) {
    return dispatch => {
        userService.getAll(JSON.parse(user))
            .then(
                assignments => dispatch(success(assignments)),
                error => dispatch(failure(error))
            );
    };

    function success(assignments) { return { type: userConstants.GETALL_SUCCESS, assignments } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function addStudent(user, newName, newAssign, newGrade) {
    function success(student) { return { type: userConstants.NEW_SUCCESS, student } }
    function failure(error) { return { type: userConstants.NEW_FAILURE, error } }

    function get_success(assignments) { return { type: userConstants.GETALL_SUCCESS, assignments } }
    function get_failure(error) { return { type: userConstants.GETALL_FAILURE, error } }

    function onSuccess(dispatch, student) {
        dispatch(success(student))

        userService.getAll(user)
                    .then( function (assignments) {
                        dispatch(get_success(assignments))
                    },
                        error => dispatch(get_failure(error))
                    );
    }

    function onFailure(dispatch, error) {
        dispatch(failure(error))


    }

    return function (dispatch) {
        userService.addStudent(user, newName, newAssign, newGrade)
        .then((student) => onSuccess(dispatch, student), 
              (error) => onFailure(dispatch, failure));
    }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => { 
                    dispatch(success(id));
                },
                error => {
                    dispatch(failure(id, error));
                }
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}
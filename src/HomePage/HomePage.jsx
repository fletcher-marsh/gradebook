import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

class HomePage extends React.Component {
    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }

    render() {
        const { user, users } = this.props;
        return (
            <div>
                <Link to="/login" className="btn blue btn-link" style={{marginLeft: '-20px', marginTop: '20px'}}>Logout</Link>
                <div style={{marginTop: '-40px'}} className="center-align">
                    <img className="center-align" src="https://i.imgur.com/qnj3JkX.png"/>
                    <h4>Search</h4>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div>
                            <input type="text" className="form-control" name="search" defaultValue={'Student Name'} onChange={this.handleChange} />
                        </div>
                    </form>
                    <h4>Gradebook</h4>
                    <table className="striped bordered">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Assignment</th>
                                <th>Grade</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>Alvin</td>
                                <td>hw1</td>
                                <td>87</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
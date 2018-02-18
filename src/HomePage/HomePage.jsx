import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Button, Icon} from 'react-materialize'
import { userActions } from '../_actions';
import { Modal } from 'react-modal';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addClass = this.addClass.bind(this);
        this.showAddClass = this.showAddClass.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            searchTerm: '',
            curDisplay: [],
            got: true,
            modal: false,
            newName: '',
            newAssign: '',
            newGrade: ''
        }

    }
    componentDidMount() {
        this.props.dispatch(userActions.getAll(localStorage.getItem('user')));
    }

    handleInputChange(event) {
        let assgns = this.props.assignments.items.entries;
        console.log("Input change: ", assgns);
        let newDisplay = assgns.filter(function(assignment) {
                                console.log(assignment);
                                return(assignment.student.includes(event.target.value) ||
                                assignment.assignment.includes(event.target.value))
         });
        console.log(newDisplay, this.state.curDisplay);
        this.setState({
            searchTerm: event.target.value,
            curDisplay: newDisplay
        });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    addClass(event) {
        const { user } = this.props;
        const { newName, newAssign, newGrade } = this.state;
        const { dispatch } = this.props;
        if (newName && newAssign && newGrade) {
            dispatch(userActions.addStudent(user, newName, newAssign, newGrade));
        }

        this.setState({
            modal: false,
            got: true,
            newName: '',
            newAssign: '',
            newGrade: ''
        });
    }

    showAddClass(event) {
        this.setState({
            modal: true
        });

    }
    handleLogout(event) {
        this.setState({
            searchTerm: '',
            curDisplay: [],
            got: true,
            modal: false,
            newName: '',
            newAssign: '',
            newGrade: ''
        });
    }


    render() {
        const { user, assignments } = this.props;
        const { newName, newAssign, newGrade } = this.state;
        console.log(assignments.items, this.state.curDisplay);
        if (this.props.assignments.items && 
            this.state.curDisplay &&
            (this.searchTerm == '') &&
            this.props.assignments.items.entries.length != this.state.curDisplay.length) {
            this.state.curDisplay = this.props.assignments.items.entries;
        }
        if (this.props.assignments.items && this.state.got) {
            this.state.curDisplay = this.props.assignments.items.entries;
            this.state.got = false;
        }
        return (
            <div>
                <nav style={{backgroundColor: 'lightGrey'}}>
                    <div className="nav-wrapper">
                      <img style={{maxWidth: '85%', maxHeight: '85%', marginTop: '5px', marginLeft: '5px'}} className="left-align" src="https://i.imgur.com/qnj3JkX.png"/>
                      <form style={{marginLeft: '55%', marginRight: '20px', height: '75%', marginTop: '-80px', maxWidth: '60%'}}>
                        <div className="container input-field" style={{maxWidth: '400pt', textColor: 'black'}}>
                            <input id="search"
                                   style={{backgroundColor: 'white'}}
                                   onChange={this.handleInputChange}
                                   type="search" required></input>
                            <label className="label-icon" htmlFor="search"><i style={{marginTop: '-20px', color: 'black'}} className="material-icons">search</i></label>
                            <i className="material-icons" style={{marginTop: '-8px', color: 'black'}}>close</i>
                            <div id="searchResults" ></div>
                        </div>
                    </form>
                      <ul className="right">
                        <li><Link to="/login" style={{paddingLeft: '20px', marginTop: '-115px'}} className="btn grey btn-link" onClick={this.handleLogout}>Logout</Link></li>
                      </ul>
                    </div>

                </nav>
                <div className="container center-align"> 
                    {this.state.curDisplay &&
                        <table className="bordered striped">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Assignment</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            
                            <tbody style={{display: 'block', overflow: 'auto', backgroundColor: 'lightGrey'}}>
                                {this.state.curDisplay.map((assignment, index) =>
                                <tr style={{display: 'table', width: '100%', tableLayout: 'fixed'}} key={assignment.student.concat(assignment.assignment)}>
                                    <td>{assignment.student}</td>
                                    <td>{assignment.assignment}</td>
                                    <td>{assignment.grade}</td>
                                </tr>
                                )}
                                {this.state.modal &&
                                    <tr id="addNewClass" 
                                        style={{display: 'table', width: '100%', tableLayout: 'fixed', backgroundColor: 'white'}}>
                                        <td><input style={{backgroundColor: 'white'}} name="newName" onChange={this.handleChange} required></input></td>
                                        <td><input style={{backgroundColor: 'white'}} name="newAssign" onChange={this.handleChange} required></input></td>
                                        <td><input style={{backgroundColor: 'white'}} name="newGrade" onChange={this.handleChange} required></input></td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    }
                    {(assignments.items) && (assignments.items.entries == []) && (this.state.curDisplay == []) &&
                        <p>You have no assignments! Click below to add more.</p>
                    }
                    <div className="fixed-action-btn">
                        <a onClick={this.showAddClass} className="btn-floating btn-large red">
                          <i className="large material-icons">add</i>
                        </a>
                    </div>
                    {this.state.modal &&
                        <div className="fixed-action-btn">
                            <a onClick={this.addClass} className="btn-floating btn-large red">
                              <i className="large material-icons">check</i>
                            </a>
                        </div>
                    }
                </div>  
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { searchTerm,
            curDisplay,
            got,
            modal,
            newName,
            newGrade,
            newAssign } = state;
    const { assignments, authentication } = state;
    const { user } = authentication;
    return {
        searchTerm,
        curDisplay,
        got,
        modal,
        newName,
        newGrade,
        newAssign,
        user,
        assignments
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
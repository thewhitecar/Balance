import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import * as moment from 'moment';

import './Habits.css'
import AddHabitForm from './AddHabitForm';
import { getCurrentUser } from '../../redux/reducers/user';

const add = require('../../assets/plus.png')

class Habits extends Component {
    constructor() {
        super();
        this.state = {
            habitsList: [],
            addHabitVisible: false,
            habitDetailVisible: false,
            habitDetailShown: 1,
            habitEvents: [],
            habitEventsReturned: false
        }
    }

    toggleForm = () => {
        this.setState({
            addHabitVisible: !this.state.addHabitVisible,
            habitDetailVisible: false
        })
    }
    addHabitToList = (arr) => {
        this.setState({
            habitsList: arr
        })
    }
    showHabitDetail = (id) => {
        axios.get(`api/habitEvents?id=${id}`).then(result => {
            // console.log('habit events for this habit', result)
            this.setState({
                habitDetailVisible: true,
                habitDetailShown: id,
                addHabitVisible: false,
                habitEvents: result.data
            }, () => {
                this.setState({
                    habitEventsReturned: true
                })
            })
        })
    }
    addHabitEvent = (habitId) => {
        axios.post('api/habit', { habitId }).then(result => {
            let habitStartDate = new moment(+result.data[0].date)
            let midnightToday = new Date().setHours(0, 0, 0, 0)
            let daysFromStart = Math.floor(moment.duration(moment(habitStartDate).diff(midnightToday)).as('days'));
            let habitEventObj = {
                habitId,
                daysFromStart
            }
            axios.post('api/habitEvents', habitEventObj).then(() => {
                console.log(`habit event added as complete w/ daysFromStart=${habitEventObj.daysFromStart}, and habitId=${habitEventObj.habitId}`);
                // call axios.get(`/api/habitEvents?id=${id}`) to get all habitEvents for this habit and update user view
            }).catch(error => console.log('Error from Habits.js => addHabitEvent => axios.post("api/habitEvents")', error));
        })
    }

    componentDidMount() {
        this.props.getCurrentUser();
        let { id } = this.props.user;
        axios.get('api/habits', { id }).then(result => {
            this.setState({
                habitsList: result.data
            })
        });
    }

    render() {
        console.log(this.state.habitEvents);
        if (this.state.habitsList.length) {
            let daysOfTheWeek = [' ', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let monthsOfTheYear = [' ', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var allHabitsOverview = this.state.habitsList.map((e, i) => {
                e.date = e.dateformatted.split('/');
                let day = daysOfTheWeek[(+e.date[3]) + 1];
                let month = monthsOfTheYear[(+e.date[1]) + 1];
                return (
                    <div key={i} className="habits-sidebar-habit">
                        <button onClick={() => this.showHabitDetail(e.id)} className="habits-sidebar-habit">
                            <p>{e.title}</p>
                            <p>Started: {`${day}, ${month} ${e.date[2]}, ${e.date[0]}`}</p>
                        </button>
                    </div>
                )
            })
            var allHabitsDetail = this.state.habitsList.filter((e) => e.id === this.state.habitDetailShown).map((e, i) => {
                e.date = e.dateformatted.split('/');
                let day = daysOfTheWeek[(+e.date[3]) + 1];
                let month = monthsOfTheYear[(+e.date[1]) + 1];
                return (
                    <div key={i} className="habits-detail-habit">
                        <h3>{e.title}</h3>
                        <p>{e.description}</p>
                        {e.type === "Personal" ? <i class="fas fa-book-reader"></i> : e.type === "Professional" ? <i class="fas fa-user-tie"></i> : <i class="fas fa-heartbeat"></i>}
                        <p>You started tracking this habit on {`${day}, ${month} ${e.date[2]}, ${e.date[0]}, ${moment([+e.date[0], (+e.date[1]), +e.date[2]]).fromNow()}`}</p>
                        <p>Here's your progress for the past week: </p>
                        <div style={{ display: 'flex' }}>

                            {/* check that user started this habit 7 days or more ago */}
                            {console.log(e)}
                            {   
                                // let startDate = new moment(+e.date);
                                // let midnightToday = new moment(new Date().setHours(0, 0, 0, 0))

                                // Math.floor(moment.duration(moment(habitStartDate).diff(midnightToday)).as('days'))
                                console.log('above')
                            }

                            <div className="habits-detail-habit-progress">7 days ago
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "7")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>
                            <div className="habits-detail-habit-progress">6 days ago
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "6")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>
                            <div className="habits-detail-habit-progress">5 days ago
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "5")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>
                            <div className="habits-detail-habit-progress">4 days ago
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "4")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>
                            <div className="habits-detail-habit-progress">3 days ago
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "3")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>
                            <div className="habits-detail-habit-progress">2 days ago
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "2")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>
                            <div className="habits-detail-habit-progress">yesterday
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "1")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>
                            <div className="habits-detail-habit-progress">today
                            {
                                    this.state.habitEventsReturned ? // checks that habitEvents array has been returned
                                        this.state.habitEvents.filter((e) => e.daysfromstart === "0")[0] ? // checks that first item in habitEvents {x} days ago is true
                                            <i class="far fa-check-circle"></i> // rendered if true
                                            :
                                            <i class="far fa-times-circle"></i> // rendered if false
                                        :
                                        null // checks that habitEvents array has been returned
                                }
                            </div>

                        </div>
                        <p>Completed today? </p>
                        <i onMouseDown={(habitId) => this.addHabitEvent(e.id)} class="far fa-check-circle"></i>
                    </div>
                )
            })
        }

        return (
            <div className="content-container">
                {/* HABITS SIDEBAR */}
                <div className="habits-sidebar">
                    {allHabitsOverview}
                </div>
                {
                    !this.state.habitsList.length ?

                        // USER DOES NOT HAVE ANY HABITS
                        <div className="habits-content">
                            {
                                this.state.addHabitVisible ?
                                    <div>
                                        <div onClick={this.toggleForm} className="add-habit-background">
                                        </div>
                                        <AddHabitForm habitsList={this.state.habitsList} currentUser={this.props.user}/**/ toggleForm={this.toggleForm} addHabitToList={this.addHabitToList} />
                                    </div>
                                    :
                                    <div className="add-first-habit-button">
                                        <img src={add} onMouseDown={this.toggleForm} className="add-first-habit-plus" />
                                        <p>Add your first habit!</p>
                                    </div>
                            }
                        </div>
                        :
                        <div className="habits-content">
                            {
                                this.state.habitDetailVisible ?

                                    // USER HAS HABITS, SHOWS DETAIL VIEW
                                    <div>
                                        <img src={add} onMouseDown={this.toggleForm} className="add-habit-button" />
                                        <div>
                                            {allHabitsDetail}
                                        </div>
                                        {
                                            this.state.addHabitVisible ?
                                                <div>
                                                    <div onClick={this.toggleForm} className="add-habit-background">
                                                    </div>
                                                    <AddHabitForm habitsList={this.state.habitsList} currentUser={this.props.user} toggleForm={this.toggleForm} addHabitToList={this.addHabitToList} />
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                    :

                                    // USER HAS HABITS, NO DETAIL VIEW
                                    <div>
                                        <img src={add} onMouseDown={this.toggleForm} className="add-habit-button" />
                                        <div>
                                            <p>user has habits, hasn't selected one</p>
                                        </div>
                                        {
                                            this.state.addHabitVisible ?
                                                <div>
                                                    <div onClick={this.toggleForm} className="add-habit-background">
                                                    </div>
                                                    <AddHabitForm habitsList={this.state.habitsList} currentUser={this.props.user} toggleForm={this.toggleForm} addHabitToList={this.addHabitToList} />
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                            }
                        </div>

                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.data
    }
}

export default connect(mapStateToProps, { getCurrentUser })(Habits);
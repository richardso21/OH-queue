import React, { Component } from 'react';
import Header from './components/Header';
import OnDuty from './components/OnDuty';
import TAMeeting from './components/TAMeeting';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isMeeting: false,
        };
    }

    render() {
        const { isMeeting } = this.state;
        return (
            <div className='App'>
                {!isMeeting ? (
                    <>
                        <Header /><div id='content'>
                            <OnDuty />
                        </div>
                    </>
                ) : 
                    <>
                        <TAMeeting />
                    </>
                }
            </div>
        );
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            if (this.isCurrentTimeBetween('10:57', '12:25', 2)) { // 24 hour time [start, end)
                this.setState({ isMeeting: true });
            } else if (this.state.isMeeting) {
                this.setState({ isMeeting: false });
            }
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    isCurrentTimeBetween(startTime, endTime, dayOfWeek) {
        const now = new Date();
        const start = new Date();
        const end = new Date();

        if (now.getDay() !== dayOfWeek) { return false; }
      
        // Set the hours and minutes for start and end times
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
      
        start.setHours(startHours, startMinutes, 0, 0);
        end.setHours(endHours, endMinutes, 0, 0);
      
        // Check if the current time is between start and end times
        return now >= start && now <= end;
      }
}

export default App;
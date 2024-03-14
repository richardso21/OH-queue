import React, { Component } from 'react';
import { getOnDuty } from '../gcal';
import '../style/OnDuty.css';
import PersonCard from './PersonCard';
import StudentQueue from './StudentQueue';
import AlertBox from './AlertBox';

class OnDuty extends Component {
    state = {
        tas: [],
        statusMessage: '',
    };

    UNSAFE_componentWillMount() {
        getOnDuty((tas, statusMessage) => {
            this.setState({ tas, statusMessage });
        });
    }

    componentDidMount() {
        window.setInterval(
            function () {
                getOnDuty((tas, statusMessage) => {
                    this.setState({ tas, statusMessage });
                });
            }.bind(this),
            30000
        );
    }

    fileType = (name) => {
        name = name.split(' ').join('');
        const exts = ['.png', '.PNG', '.jpg', '.jpeg', '.JPEG', '.JPG', '.gif', '.GIF'];
        let type;
        for (let i = 0; i < exts.length; i++) {
            try {
                require('../references/ta_pics/' + name + exts[i]);
                type = exts[i];
            } catch (e) {} // I know this is jank, I'm sorry
        }
        return type;
    };

    clickTA = (ta) => {
        ta.busy = !ta.busy;
        this.setState({}); // I have no idea how this works but it does
    };

    render() {
        return (
            <>
                <div className='OnDuty'>
                    <div id='onduty_title'>TAs On Duty</div>
                    <div id='onduty_status'>{this.state.statusMessage}</div>
                    <div id='onduty_tas'>
                        {this.state.tas &&
                            this.state.tas.map((ta, index) => {
                                let image;
                                try {
                                    image = require('../references/ta_pics/' +
                                        ta.name.toLowerCase().split(' ').join('') +
                                        this.fileType(ta.name.toLowerCase()));
                                } catch (e) {
                                    image = require('../references/ta_pics/default.jpg');
                                }

                                return (
                                    <PersonCard
                                        key={index}
                                        ta={ta}
                                        imageUrl={image}
                                        isRemote={ta.remote}
                                        onClick={this.clickTA} // Pass the clickTA function as a prop
                                    />
                                );
                            })
                        }
                    </div>
                    <AlertBox />
                </div>
                <StudentQueue tas={this.state.tas} />
            </>
        );
    }
}

export default OnDuty;
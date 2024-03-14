import React, { Component } from 'react';
import '../style/Header.css';

class Header extends Component {
    state = {
        hours: '00',
        mins: '00',
        ampm: 'AM',
        fonts: ['Russo One', 'Merienda', 'Kenia', 'Oxygen', 'Carter One', 'Ultra', 'Bungee Inline', 'Yatra One', 'Bebas Neue', 'Lobster', 'Source Code Pro', 'Raleway', 'Shrikhand', 'Fredoka One', 'Rakkas', 'Kavoon', 'Corben'],
        currentFont: 'Russo One',
        
    };

    setTime() {
        const now = new Date();
        let hours = now.getHours();
        let ampm = 'AM';
        if (hours === 0) {
            hours = 12;
        } else if (hours === 12) {
            ampm = 'PM';
        } else if (hours > 12) {
            hours %= 12;
            ampm = 'PM';
        }
        const mins = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();

        this.setState({
            hours: hours,
            mins: mins,
            ampm: ampm,
        });
    }

    UNSAFE_componentWillMount() {
        this.setTime();
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * this.state.fonts.length);
            this.setState({ currentFont: this.state.fonts[randomIndex] });
          }, 900000); // 15 minutes
        
        window.setInterval(
            function () {
                this.setTime();
            }.bind(this),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className='Header'>
                <div id='title' style={{ fontFamily: this.state.currentFont }}>CS 2110 Office Hours</div>
                <div id='time'>{this.state.hours}:{this.state.mins} {this.state.ampm}</div>
            </div>
        );
    }
}

export default Header;
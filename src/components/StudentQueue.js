import React, { Component } from "react";
import { anonArray } from "../references/anon_names/animals";
// import { anonArray } from '../references/anon_names/love';
// import { anonArray } from "../references/anon_names/march_madness";
// import { anonArray } from '../references/anon_names/fruits';
// import { anonArray } from '../references/anon_names/spooky';
// import { anonArray } from "../references/anon_names/christmas";
import { taTapIn, postStats } from "../services";
import "../style/StudentQueue.css";

const config = require("../secret.config.json");
const goat = config.liam;
const ta_list = require("../references/ta_list.csv");
const anonOn = true;

class StudentQueue extends Component {
  state = {
    queue: [],
    entry: [],
    nextID: 0,
    lastDQ: undefined,
    time: [],
  };

  keyDown = (event) => {
    if (event.keyCode === 13) {
      // enter
      // this.submitGTID();
      let name = `Anon ${anonArray[this.state.nextID]}`;
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.nextID = (this.state.nextID + 1) % anonArray.length;
      let gtid = 69;
      this.state.queue.push({
        name: name,
        gtid: gtid,
        time: new Date().getTime(),
      });
      this.updateState();
    } else if (event.keyCode === 8) {
      // backspace
      this.dequeue();

      // Full-screen page
      const elem = document.documentElement;
      try {
        if (!document.fullscreenElement && elem.requestFullscreen) {
          elem.requestFullscreen();
        }
      } catch (e) {
        console.warn(e);
      }
    } else if (event.keyCode === 16) {
      // shift
      this.undeqeue();
    }
  };

  dequeue() {
    let tempDQ = this.state.queue.shift();
    if (tempDQ === undefined) return;
    this.setState({
      lastDQ: tempDQ,
    });
    this.updateState();
  }

  undeqeue() {
    if (this.state.lastDQ) {
      this.state.queue.unshift(this.state.lastDQ);
      this.setState({
        lastDQ: undefined,
      });
      this.updateState();
    }
  }

  //This kinda creates problems during the middle of the day
  verifyOnDuty() {
    return true; //this.props.tas.length > 0;
  }

  updateState() {
    this.setState({
      queue: this.state.queue,
      entry: this.state.entry,
      nextID: this.state.nextID,
      lastDQ: this.state.lastDQ,
    });
    window.localStorage.setItem("OH-state", JSON.stringify(this.state));
  }

  submitGTID = async () => {
    let gtid = this.state.entry.join("");
    if (gtid.length === 9) {
      //find name of TA, if TA
      let n = await this.getNameFromGTID(gtid);
      console.log(n);
      if (n) {
        await taTapIn(n);
        this.setState({
          queue: this.state.queue,
          entry: [],
        });
        return;
      }
      // keep only last 5 digits of GTIDs
      gtid = gtid.slice(4, 10);
    }
    this.setState({
      queue: this.state.queue,
      entry: [],
    });
    // check for behavior (enqueue or dequeue)
    let i, student;
    let inQ = false;
    for (i = 0; i < this.state.queue.length && !inQ; i++) {
      student = this.state.queue[i];
      if (student.gtid === gtid) {
        inQ = true;
      }
    }
    if (inQ) {
      this.state.queue.splice(i - 1, 1);
      //record time student spent in queue (minutes from ms)
      this.state.time.push((new Date().getTime() - student.time) / 60000);
    } else {
      let name;
      if (anonOn) {
        name = "Anon " + anonArray[this.state.nextID];
        if (gtid === goat) {
          name = "da goat";
        }
        let newID = this.state.nextID + 1;
        this.setState({
          queue: this.state.queue,
          entry: this.state.entry,
          nextID: newID === anonArray.length ? 0 : newID,
        });
      } else {
        await this.getNameFromGTID(gtid).then((response) => (name = response));
        if (!name) {
          name = prompt(
            "Not enrolled in the course? Please enter your name to be added to the queue:",
            "Guest",
          );
        }
      }
      this.state.queue.push({
        name: name,
        gtid: gtid,
        time: new Date().getTime(),
      });
    }
    this.updateState();
  };

  getNameFromGTID = async (gtid) => {
    let content = "";
    await fetch(ta_list)
      .then((response) => response.text())
      .then((text) => (content = text));
    let lines = content.split(/[\r\n]+/g);
    let found = false;
    let curr, currLine;
    // LINEAR search leggoooo
    for (curr = 0; curr < lines.length && !found; curr++) {
      currLine = lines[curr].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (currLine[1] === gtid) {
        found = true;
      }
    }
    return found
      ? currLine[0].split(",")[1].split(" ")[1].split('"')[0] +
          " " +
          currLine[0].split(",")[0].split('"')[1].charAt(0)
      : null;
  };

  async updateStats() {
    //students that came and left within the last n min or that are still in the queue
    let students = this.state.time.length + this.state.queue.length;
    let avgTime = 0;
    for (let i = 0; i < this.state.time.length; i++) {
      avgTime += this.state.time[i];
    }
    //avg time spent in queue for students dequeued in last n minutes
    avgTime /= this.state.time.length === 0 ? 1 : this.state.time.length;

    this.setState({
      time: [],
    });
    avgTime = avgTime.toFixed(2);

    await postStats(students, avgTime);
  }

  componentDidMount() {
    const savedState =
      JSON.parse(window.localStorage.getItem("OH-state")) || this.state;
    this.setState({
      queue: savedState.queue,
      entry: savedState.entry,
      nextID: savedState.nextID,
      lastDQ: savedState.lastDQ,
    });
    document.addEventListener("keydown", this.keyDown);
    setInterval(
      function () {
        this.updateStats();
      }.bind(this),
      1000 * 60 * 15,
    ); //every 15 minutes
  }

  render() {
    return (
      <div className="StudentQueue">
        <div id="studentq_title">Queue</div>
        <div id="studentq_info">Press ENTER and remember your name!</div>
        <div id="studentq_names">
          {this.state.queue &&
            this.state.queue.length <= 14 &&
            this.state.queue.map((value, index) => (
              <div id="studentq_name" key={index}>
                {value.name}
              </div>
            ))}
          {this.state.queue &&
            this.state.queue.length > 14 &&
            this.state.queue.map((value, index) => {
              // const timeInQueue = (new Date().getTime() - value.time) / 1000 / 60; // calculate time in minutes
              // console.log(timeInQueue);
              // let nameColor = '#0f893b' // default green
              // if (timeInQueue >= 5 && timeInQueue < 10) {
              //     nameColor = '#FF6600'; // after 5 minutes orange
              //   } else if (timeInQueue >= 10) {
              //     nameColor = '#f22613'; // after 10 minutes red
              // }
              // console.log(nameColor);

              if (index <= 4 || index >= this.state.queue.length - 5) {
                // show first & last 5
                return (
                  <div id="studentq_name" key={index}>
                    {value.name}
                  </div>
                );
              } else if (index === 5) {
                // show # hidden
                return (
                  <div id="studentq_name" key={index}>
                    ... ({this.state.queue.length - 10} hidden) ...
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </div>
    );
  }
}

export default StudentQueue;

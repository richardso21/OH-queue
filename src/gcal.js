import request from 'superagent';

const config = require('./secret.config.json');
const CALENDAR_ID = config.cal_id;
const API_KEY = config.api_key;
let url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}`;
let nextOpeningTime = "[Calculating...]";
export let nextClosingTime = null;

function parseStart(time) {
    let t = time.substring(0, 11);
    t += '00:00:00.00Z';
    return t;
}

function parseEnd(time) {
    let t = time.substring(0, 11);
    t += '23:59:00.00Z';
    return t;
}

function getOpeningTime(days) {
    const now = new Date();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    let params = {
        singleEvents: true,
        timeMin: parseStart(now.toISOString()),
        timeMax: parseEnd(endDate.toISOString())
    };
    request.get(url, params).end((err, resp) => {
        if (!err) {
            const startTimes = JSON.parse(resp.text).items.map(event => event.start.dateTime);
            nextOpeningTime = parseTime(new Date(startTimes.sort()[0]));
        }
    })
}   

function getClosingTime() {
    const date = new Date();
    let params = {
        singleEvents: true,
        timeMin: parseStart(date.toISOString()),
        timeMax: parseEnd(date.toISOString())
    };
    request.get(url, params).end((err, resp) => {
        if (!err) {
            const endTimes = JSON.parse(resp.text).items.map(event => event.end.dateTime);
            const lastDatetime = new Date(endTimes.sort()[endTimes.length - 1]);
            // Display if 1 hour or less remaining in today's OH
            if (lastDatetime > date && (lastDatetime - date) / (1000 * 60) <= 60) {
                nextClosingTime = parseTime(lastDatetime, true);
            } else {
                nextClosingTime = null;
            }
        }
    })
}

function parseTime(time, timeOnly) {
    const ampm = time.getHours() <= 12 ? 'AM' : 'PM'
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][time.getDay()]; 
    const hours = time.getHours() % 12 || 12; // 12-hour format
    const minutes = String(time.getMinutes()).padStart(2, '0'); // Pad with a leading zero if needed
    return timeOnly ? `${hours}:${minutes}` : `${hours}:${minutes} ${ampm} on ${day}`;
}

export function getOnDuty(callback) {
    const now = new Date().toISOString();
    let params = {
        singleEvents: true,
        timeMin: parseStart(now),
        timeMax: parseEnd(now),
    };
    request.get(url, params).end((err, resp) => {
        if (!err) {
            let tasOnDuty = [];
            // eslint-disable-next-line array-callback-return
            JSON.parse(resp.text).items.map((event) => {
                const startTime = new Date(event.start.dateTime).toISOString();
                const endTime = new Date(event.end.dateTime).toISOString();
                if (now >= startTime && now < endTime) {
                    tasOnDuty.push({
                        name: event.summary.split("'")[0],
                        busy: false,
                        /**
                         * Right now, the way we identify remote hours is by adding an identifier to
                         * the calendar invite name. For example, 'Ivan (remote)'.
                         *
                         * This is a bit jank and there are probably better ways to go about doing this,
                         * but time is of the essence and so I'll come back to this later :P
                         */
                    });
                }
            });
            let statusMessage = '';
            getOpeningTime(4);
            getClosingTime();
            if (tasOnDuty.length === 0) {
                // eslint-disable-next-line no-unused-expressions
                statusMessage = `Office Hours is closed. Check the calendar linked on Canvas to see when we're open!`;
            } else if (!tasOnDuty.some((ta) => !ta.remote)) {
                statusMessage =
                    '';
            }
            callback(tasOnDuty, statusMessage);
        }
    });
}

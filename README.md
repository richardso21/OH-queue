# Office Hours Hashboard
*Point of Contact: Lucian :D*

## Features

-   Pulls office hours from a Google Calendar
-   Pulls TA pictures from a local folder
-   Pulls students from a local spreadsheet
-   Allows students in and out of the course to add themselves to the queue
-   Allows dequeuing by rescanning Buzzzcard (remove specific student) or hitting backspace (remove next student)

---

# Setting Up The Hashboard

## Set Up TA Photos

1. In the `/src/references/ta_pics` folder, save square photos of all the TAs (accepted formats: png, jpg, jpeg, gif)
2. Each photo should be named with the first name of the TA (all lowercase) __and match the string used on the Google Calendar__ (not case sensitive)
    * For TAs with duplicate first names or a space in their name, keep the file name all lowercase and match whatever is shown on the calender (ex. emilye, yoonji, etc.)

## Set Up the Google Calendar

1. Create a Google Calendar for all the office hours (make sure the privacy settings are set to public, otherwise you'll get a 404 error)
2. Add all of the office hours of the TAs by titling the events with the first names of the TAs (this is important for getting the TA pictures)
    * Again for the edge case names just keep in mind [this is how the pictures are being queried](src/components/OnDuty.js#L54)

## Set Up the Google Calendar API Calls

1. Create a json file called `secret.config.json` in the `src` directory:

```json
{
    "cal_id": "yourcalendarid@group.calendar.google.com",
    "api_key": "yourgooglecloudplatformapikey"
}
```

2. To get the calendar ID, go to the office hours calendar's settings and look under the "Integrate calendar" heading
3. To get a Google API key, follow these steps: https://developers.google.com/calendar/quickstart/js
    * You will need to make a Google Cloud project as described, and enable the Calendar API

---

## Set Up Github Pages

1. Go to the up-to-date Hashboard repository on Github and open Settings > Pages
2. Under "Build and Deployment" the source should be "deploy from a branch" and the branch should be "gh-pages" (should be automatically set after step 4)
3. Once you've enabled pages, you should see the link that the site is hosted at, i.e. "https://github.gatech.edu/pages/cs-1332-spring-2024/hashboard/"
    * Take the link paste it into the `package.json` as `homepage`. This allows gh-pages to deploy to the right location
4. From your local machine, run `npm run deploy` to deploy any changes made to the master branch onto the gh-pages branch. 
    * This creates a static version of the site and deploys it at the above URL
    * __Anytime you change something locally and push it, you also need to run this command in order for the gh-pages branch to be updated__
    * We could actually automate this with github actions, TODO I guess

---

## Run the Code

1. Clone the repository
2. Add your own `secret.config.json` file to the `src` directory (see **Set Up the Google Calendar API Calls** section)
3. Navigate to the `hashboard` directory
4. Run `npm i` to install all the necessary node modules
5. Run `npm start` to run the app

---

*(Version L\[ucian\]2.0, an addendum to Version S\[ammy\], prettifies Version L\[iam\], adds minor changes to Version A\[drianna\])*
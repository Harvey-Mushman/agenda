# agenda

Description: Meeting Manager, this program was developed to assist in the management of the Neighborhood Councils (NC). The system is a browser based application that is written in JavaScript with an HTML5 frontend. All application source files are stored on Google's Web.app domain while the files the user generates in the process of using the system are stored on the local computer.

All of the data files are stored in JSON (JavaScript Object Notation) with the exception of the final output documents that are printed to PDF (Postscript Document Format).

The entire system was developed by James Murez who at the time was President of the Venice Neighborhood Council. The first public release of the system occurred in July 2023 with the added feature that allows the user to configure any Neighborhood Council. This feature enabled the user to defining the NC logo, Board and Committee Members and set member profile parameters.

Future Features:

1. Section Heading with sub number of items where all items numbers under a heading will include a decimal number (1.x).
2. Reporting Attendance, ability to read multiple Recorded Minute's files and list which members attended.
3. Report Member profile properties such as training expiration dates.
4. Add user login
5. User online voting where each logged in member of the active committee can vote on an agenda item when system manager calls for recordation of votes. The tally will be displayed once the voting  period is closed.
6. Table of Contents format, where during presentations a dropdown menu gives the meeting host more control over how the agenda is presented. This feature will include formatting the presentation between continuous scrolling through the agenda or item by item, one at a time format.
7. Revision highlighting and tracking in the text editor.
8. Auto save when changes are made.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

after running npm run serve, I should see http://localhost:8080/


After locally testing with npm run serve on the local browser,
the next step is to npm run build the project.  This makes it
ready to be deployed.  Then issue the command to move the project
firebase server by issuing the firebase deploy --only hosting


Project Console: https://console.firebase.google.com/project/meeting-manager-2a57a/overview

Hosting URL: https://meeting-manager-2a57a.web.app

other commands

firebase deploy --only hosting

nvm current
nvm use 16
npm install -g npm stable
npm install -g firebase-tools


firebase deploy --only functions
firebase tools --version
firebase emulators:start
firebase login
firebase init
npm install --save firebase-functions@latest


The complete history of commands issued in VS Code Terminal are located in the following text file.
C:\Users\john\AppData\Roaming\Microsoft\Windows\PowerShell\PSReadline\ConsoleHost_history.txt

# paperclips-reporter
Record games of Universal Paperclips in firebase and render realtime metrics. This repository contains a script that is injected into a game of Universal Paperclips via a bookmark. The script periodically captures game metrics and posts them to the configured firebase database. There is also a web page that can render a graph of the recorded game metrics.

[![Screenshot](/img/screenshot.png)](https://raw.githubusercontent.com/marclitchfield/paperclips-reporter/master/img/screenshot.png)

Most major metrics in the game are captured. Metrics are plotted on a logarithmic scale, except for the paperclip count which is a linear scale on the right axis. A tooltip will show values under the cursor. Projects purchased in the game are also displayed.

Automatically complete the game with [paperclips-auto](https://github.com/marclitchfield/paperclips-auto)

## Setup
Create a firebase database at https://console.firebase.google.com/ and select 'Add firebase to your web app' to obtain the following credentials:

* apiKey
* authDomain
* databaseURL
* projectId
* storageBucket
* messagingSenderId

Now create a bookmark to launch the recorder script within a game of Universal Paperclips. Replace the values in the config object with your firebase credentials:

```javascript
javascript: (() => {
  window.__paperclips_reporter_firebase_config = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID"
  };
  var a = document.createElement("script"); 
  a.src = "https://marclitchfield.github.io/paperclips-reporter/paperclips-reporter.js"; 
  document.getElementsByTagName("head")[0].appendChild(a) 
})();
```

Start a game of universal paperclips at http://www.decisionproblem.com/paperclips, and launch the bookmark to start recording metrics.

To view the metrics, go to https://marclitchfield.github.io/paperclips-reporter/paperclips-reporter.html?databaseURL=YOUR_DATABASE_URL

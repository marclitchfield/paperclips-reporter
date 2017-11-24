# paperclips-reporter
Record games of Universal Paperclips in firebase and render realtime metrics. This repository contains a script that is injected into a game of Universal Paperclips via a bookmark. The script periodically captures game metrics and posts them to the configured firebase database. There is also a web page that can render a graph of the recorded game metrics.

# Setup
Create a firebase database and obtain the following credentials:

* apiKey
* authDomain
* databaseURL
* projectId
* storageBucket
* messagingSenderId

Create a query string with the values of these fields. You will use this in the following steps. Replace ___ with the appropriate credential value:

```
?apiKey=___&authDomain=___&databaseURL=___&projectId=___&storageBucket=___&messagingSenderId=___
```

Now create a bookmark to launch the recorder script within a game of Universal Paperclips. Create a bookmark with the following url, replacing `<YOUR_QUERY_STRING>` with the query string above:

```
javascript: (function() { var a = document.createElement("script"); a.src = "https://marclitchfield.github.io/paperclips-reporter/paperclips-reporter.js<YOUR_QUERY_STRING>"; document.getElementsByTagName("head")[0].appendChild(a) })();
```

Start a game of universal paperclips at http://www.decisionproblem.com/paperclips, and launch the bookmark to start recording metrics.

To view the metrics, go to https://marclitchfield.github.io/paperclips-reporter/paperclips-reporter.html`<YOUR_QUERY_STRING>`
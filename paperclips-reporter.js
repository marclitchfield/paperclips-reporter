(() => {
  if (window.__paperclips_reporter === true)
    return;
  window.__paperclips_reporter = true;

  const GAME_KEY = 'reporter-game-key';
  const TIME_OFFSET = 'reporter-time-offset';

  const firebaseScript = document.createElement('script');
  firebaseScript.src = 'https://www.gstatic.com/firebasejs/4.6.2/firebase.js';
  firebaseScript.onload = onScriptLoaded;
  document.getElementsByTagName("head")[0].appendChild(firebaseScript);

  function onScriptLoaded() {
    if (window.__paperclips_reporter_firebase_config === undefined) {
      throw 'firebase_config not set'
    }
    firebase.initializeApp(window.__paperclips_reporter_firebase_config);

    const game = getGame(firebase);
    const metrics = game.child('metrics');

    const sessionTimeOffset = parseInt(window.localStorage.getItem(TIME_OFFSET)) || 0;
    const sessionStartTimestamp = Date.now();

    console.log(`Starting reporter. Saving metrics to ${window.__paperclips_reporter_firebase_config.databaseURL}`);
    window.__paperclips_reporter_interval_id = setInterval(collectMetrics(
      metrics, sessionTimeOffset, sessionStartTimestamp), 10000);
  }

  function getGame(firebase) {
    const gameKey = window.localStorage.getItem(GAME_KEY);
    if (!gameKey) {
      const games = firebase.database().ref('games');
      const game = games.push();
      window.localStorage.setItem(GAME_KEY, game.key);
      return game;
    }
    else {
      return firebase.database().ref('games/' + gameKey);
    }
  }

  function exists(id) {
    return el(id) !== null && el(id).style.display !== 'none';
  }

  function el(id) {
    return document.getElementById(id);
  }

  function collectMetrics(metrics, sessionTimeOffset, sessionStartTimestamp) {
    return () => {
      const metric = metrics.push();
      const timeOffset = sessionTimeOffset + (Date.now() - sessionStartTimestamp);

      let metricData = {
        timestamp: Date.now(),
        timeOffset: timeOffset,
        clips: window.clips,
        processors: window.processors,
        memory: window.memory,
        yomi: window.yomi,
        operations: window.operations,
        creativity: window.creativity
      };

      if (exists('businessDiv')) {
        metricData = {...metricData,
          funds: window.funds,
          investments: window.portTotal,
          autoclippers: window.clipmakerLevel,
          megaclippers: window.megaClipperLevel,
          trust: window.trust,
        };
      }

      if (exists('powerDiv')) {
        metricData = {...metricData,
          factories: window.factoryLevel,
          harvesters: window.harvesterLevel,
          wireDrones: window.wireDroneLevel,
        };
      }

      if (exists('probeDesignDiv')) {
        metricData = {...metricData,
          probeTrust: window.probeTrust,
          probeCount: window.probeCount,
          drifterCount: window.drifterCount,
          factories: window.factoryLevel,
          harvesters: window.harvesterLevel,
          wireDrones: window.wireDroneLevel,
          honor: window.honor
        };
      }
      
      metric.set(metricData);

      window.localStorage.setItem(TIME_OFFSET, timeOffset);

      // kill switch
      if (document.getElementsByClassName('consoleOld')[0].innerText.includes('by Frank Lantz')) {
        console.log('Game completed. Stopping reporter.')
        clearInterval(window.__paperclips_reporter_interval_id);
      }
    }
  }
})();
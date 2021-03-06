(() => {
  if (window.__paperclips_reporter === true)
    return;
  window.__paperclips_reporter = true;

  const GAME_KEY = 'reporter-game-key';
  const TIME_OFFSET = 'reporter-time-offset';
  let reporterIntervalId;

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
    const projects = game.child('projects');

    const sessionTimeOffset = parseInt(window.localStorage.getItem(TIME_OFFSET)) || 0;
    const sessionStartTimestamp = Date.now();

    interceptProjects(projects, sessionTimeOffset, sessionStartTimestamp);

    console.log(`Starting reporter. Saving metrics to ${window.__paperclips_reporter_firebase_config.databaseURL}`);
    reporterIntervalId = setInterval(collectMetrics(
      metrics, sessionTimeOffset, sessionStartTimestamp), 10000);
  }

  function interceptProjects(projects, sessionTimeOffset, sessionStartTimestamp) {
    const displayProjects_target = window.displayProjects;
    window.displayProjects = function(project) {
      displayProjects_target.call(this, project);
      const onclick_target = project.element.onclick;
      project.element.onclick = function() {
        onclick_target.call(this);
        const newProject = projects.push();
        newProject.set({
          timeOffset: sessionTimeOffset + (Date.now() - sessionStartTimestamp),
          description: project.element.innerText,
          message: el('readout1').innerText
        });
      };
    }
  }

  function getGame(firebase) {
    const gameKey = window.localStorage.getItem(GAME_KEY);
    if (!gameKey) {
      const games = firebase.database().ref('games');
      const game = games.push();
      game.set({ startTimestamp: Date.now() });
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

  function val(id) {
    return parseFloat(el(id).innerHTML.replace(/,/g, ''));
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
          avgRevenue: window.avgRev,
          clipsSold: window.avgSales,
          clipPrice: window.margin,
          demand: window.demand * 10,
          inventory: window.unsoldClips,
          marketing: window.marketingLvl,
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
          inventory: window.unusedClips,
          performance: val('performance'),
          consumption: val('powerConsumptionRate'),
          production: val('powerProductionRate'),
          storedPower: val('storedPower'),
          maxStorage: val('maxStorage')
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
        clearInterval(reporterIntervalId);
      }
    }
  }

})();
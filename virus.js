var sim = (function () {
  function init() {
    parameters = {};
    parameters.r0 = parseInt(document.getElementById("r0").value);
    parameters.population = parseInt(
      document.getElementById("population").value
    );
    parameters.incubationPeriod = parseInt(
      document.getElementById("incubationPeriod").value
    );
    parameters.illnessPeriod = parseInt(
      document.getElementById("illnessPeriod").value
    );
    daysToCalculate = parseInt(
      document.getElementById("daysToCalculate").value
    );

    statesOverTime = {};
    statesOverTime.areHealthy = [];
    statesOverTime.inIncubation = [];
    statesOverTime.areIll = [];
    statesOverTime.areImmune = [];

    currentStates = {};
    currentStates.healthy = parameters.population - 1; // egyenlöre hardcodeoltam az egy megbetegedettet
    currentStates.incubation = 1;
    currentStates.ill = 0;
    currentStates.immune = 0;
    currentDay = 0;
    //    contractedPerDay = 0;

    start();
  }

  function start() {
    while (!(currentDay == daysToCalculate)) {
      console.log(
        "Current Day: " +
          currentDay +
          " | Days to Calculate: " +
          daysToCalculate
      );
      nextDay();
      currentDay++;
    }
    chart.drawChart(getResults());
  }

  function nextDay() {
    currentStates.ill = 0;
    currentStates.immune = 0;
    currentStates = infection(currentDay, parameters, currentStates);
    currentStates = progress(
      currentDay,
      parameters,
      currentStates,
      statesOverTime
    );
    //    console.log(incubationPeriod + illnessPeriod);

    statesOverTime.areHealthy[currentDay] = Math.round(currentStates.healthy);
    statesOverTime.inIncubation[currentDay] = Math.round(
      currentStates.incubation
    );
    statesOverTime.areIll[currentDay] = Math.round(currentStates.ill);
    statesOverTime.areImmune[currentDay] = Math.round(currentStates.immune);
  }

  function infection(currentDay, parameters, currentStates) {
    contractedPerDay =
      (currentStates.incubation + currentStates.ill) *
      (parameters.r0 /
        (parameters.incubationPeriod + parameters.illnessPeriod));
    console.log(contractedPerDay);

    if (currentStates.healthy - contractedPerDay <= 0) {
      currentStates.incubation += currentStates.healthy;
      currentStates.healthy = 0;
    } else {
      currentStates.incubation += contractedPerDay;
      currentStates.healthy -= contractedPerDay;
    }

    return currentStates;
  }

  function progress(currentDay, parameters, currentStates, statesOverTime) {
    if (currentDay >= parameters.incubationPeriod) {
      currentStates.ill +=
        statesOverTime.inIncubation[currentDay - parameters.incubationPeriod];
    }
    if (currentDay >= parameters.illnessPeriod) {
      currentStates.immune +=
        statesOverTime.areIll[currentDay - parameters.illnessPeriod];
    }

    return currentStates;
  }

  function getResults() {
    console.log("Healthy People: ", statesOverTime.areHealthy);
    console.log("People in incubations: ", statesOverTime.inIncubation);
    console.log("Ill people: ", statesOverTime.areIll);
    console.log("Immune people: ", statesOverTime.areImmune);

    return statesOverTime;
  }

  return {
    init: init,
    start: start,
    nextDay: nextDay,
    getResults: getResults,
    infection: infection,
    progress: progress,
  };
})();

var unittest = (function () {
  var tests = {
    infectionTestNoInfection: function () {
      // For R0 = 0 no one should get infected
      return runInfectionTest(
        1,
        25,
        { r0: 0, population: 10, incubationPeriod: 1, illnessPeriod: 1 },
        { healthy: 9, incubation: 1, ill: 0, immune: 0 },
        { healthy: 9, incubation: 1, ill: 0, immune: 0 }
      );
    },

    infectionTestAllInfected: function () {
      // For an extreme high R0 everyone should be infected after the first day
      return runInfectionTest(
        1,
        25,
        [100, 10, 1, 1],
        [9, 1, 0, 0],
        [0, 10, 0, 0]
      );
    },
  };

  function runInfectionTest(
    repeats,
    day,
    parameters,
    startingstates,
    expectedEndstates
  ) {
    parameters = convertParameters(parameters);
    startingstates = convertStates(startingstates);
    expectedEndstates = convertStates(expectedEndstates);
    while (repeats--) {
      try {
        startingStates = sim.infection(day, parameters, startingstates);
      } catch (err) {
        alert(err);
        return false;
      }
    }
    var result = isEquivalent(startingstates, expectedEndstates);
    if (result === false) {
      console.log("Expected vs actual: ", expectedEndstates, startingstates);
      sim.getResults();
    }
    return result;
  }

  function runProgressTest(
    repeats,
    day,
    parameters,
    startingstates,
    expectedEndstates
  ) {
    parameters = convertParameters(parameters);
    startingstates = convertStates(startingstates);
    expectedEndstates = convertStates(expectedEndstates);
    while (repeats--) {
      try {
        startingStates = sim.infection(day, parameters, startingstates);
      } catch (err) {
        alert(err);
        return false;
      }
    }
    var result = isEquivalent(startingstates, expectedEndstates);
    if (result === false) {
      console.log("Expected vs actual: ", expectedEndstates, startingstates);
      sim.getResults();
    }
    return result;
  }

  function convertParameters(parameters) {
    if (Array.isArray(parameters)) {
      parameters = {
        r0: parameters[0],
        population: parameters[1],
        incubationPeriod: parameters[2],
        illnessPeriod: parameters[3],
      };
    }
    return parameters;
  }

  function convertStates(states) {
    if (Array.isArray(states)) {
      states = {
        healthy: states[0],
        incubation: states[1],
        ill: states[2],
        immune: states[3],
      };
    }
    return states;
  }

  function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      if (a[aProps[i]] !== b[aProps[i]]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  function run() {
    var testResult = "Unit test results:\n";
    for (test in tests) {
      testResult += test + " : " + (tests[test]() ? "PASS" : "FAIL") + "\n";
    }
    alert(testResult);
  }

  return {
    run: run,
  };
})();

var chart = (function () {
  const canvasColors = {
    grid: "black",
    areHealthy: "green",
    inIncubation: "yellow",
    areIll: "red",
    areImmune: "gray",
  };
  const canvas = document.getElementById("chart");
  const ctx = canvas.getContext("2d");
  const margin = 50;

  function drawChart(data) {
    var chartWidth = document.getElementById("chart").offsetWidth;
    var chartHeight = document.getElementById("chart").offsetHeight;
    canvas.width = chartWidth;
    canvas.height = chartHeight;
    console.log("Canvas height", canvas.height);
    var maxY = Object.values(data)
      .reduce((all, arr) => all.concat(arr))
      .reduce((a, b) => Math.max(a, b));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    drawAxes(margin, canvasColors.grid);
    Object.keys(data).forEach((state) => {
      drawDataLine(data[state].length, data[state], canvasColors[state]);
    });

    function drawAxes(margin, color) {
      //      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(0, chartHeight - margin);
      ctx.lineTo(chartWidth, chartHeight - margin);
      ctx.moveTo(margin, 0);
      ctx.lineTo(margin, chartHeight);
      ctx.stroke();
    }

    function drawDataLine(size, data, color) {
      console.log("DrawDataLine", size, data, color);
      const scaleX = (chartWidth - 2 * margin) / size;
      const scaleY = (chartHeight - 2 * margin) / maxY;
      data.forEach((y, index) => {
        if (index === 0) {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.moveTo(margin, chartHeight - margin - y * scaleY);
        } else {
          ctx.lineTo(
            margin + index * scaleX,
            chartHeight - margin - y * scaleY
          );
          ctx.stroke();
        }
      });
    }
  }

  return {
    drawChart: drawChart,
  };
})();

unittest.run();

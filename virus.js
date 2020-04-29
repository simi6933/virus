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
    getResults();
  }

  function nextDay() {
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
    currentStates.healthy != 0
      ? (currentStates.incubation +=
          currentStates.healthy - (currentStates.healthy - contractedPerDay))
      : ((currentStates.ill += currentStates.incubation),
        (currentStates.incubation = 0));
    currentStates.healthy - contractedPerDay <= 0
      ? ((currentStates.incubation += currentStates.healthy),
        (currentStates.healthy = 0))
      : (currentStates.healthy -= contractedPerDay);

    return currentStates;
  }

  function progress(currentDay, parameters, currentStates, statesOverTime) {
    if (currentDay >= parameters.illnessPeriod)
      currentStates.immune +=
        statesOverTime.areIll[currentDay - parameters.illnessPeriod];
    if (currentDay >= parameters.incubationPeriod)
      currentStates.ill +=
        statesOverTime.inIncubation[currentDay - parameters.incubationPeriod];

    return currentStates;
  }

  function getResults() {
    console.log("Healthy People: ", statesOverTime.areHealthy);
    console.log("People in incubations: ", statesOverTime.inIncubation);
    console.log("Ill people: ", statesOverTime.areIll);
    console.log("Immune people: ", statesOverTime.areImmune);

    return {
      statesOverTime,
    };
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
    initTest: function () {},

    getResultsTest: function () {
      console.log(sim.areHealthy);
    },

    dummyFalseTest: function () {
      return false;
    },
  };

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

unittest.run();

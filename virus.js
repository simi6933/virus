var sim = (function () {

  function init() {
    r0 = parseInt(document.getElementById("r0").value);
    population = parseInt(document.getElementById("population").value);
    incubationPeriod = parseInt(document.getElementById("incubationPeriod").value);
    illnessPeriod = parseInt(document.getElementById("illnessPeriod").value);
    daysToCalculate = parseInt(document.getElementById("daysToCalculate").value);

    areHealthy = [];
    inIncubation = [];
    areIll = [];
    areImmune = [];

    healthy = (population - 1); // egyenlöre hardcodeoltam az egy megbetegedettet
    incubation = 1;
    ill = 0;
    immune = 0;
    currentDay = 0;
    contractedPerDay = 0;

    start();
  }
  
  function start() {

    while(!(currentDay == daysToCalculate))
    {
      console.log("Current Day: " + currentDay + " | Days to Calculate: " + daysToCalculate);
      nextDay();
      currentDay++;
    }
    getResults();
  }
  
  function nextDay() {

    contractedPerDay += (incubation + ill) * (r0 / (incubationPeriod + illnessPeriod));
    console.log(incubationPeriod + illnessPeriod);
    if(currentDay >= illnessPeriod) immune += areIll[currentDay - illnessPeriod];
    if(currentDay >= incubationPeriod) ill += inIncubation[currentDay - incubationPeriod];

    (healthy != 0) ? (incubation += (healthy - (healthy - contractedPerDay))) : (ill += incubation, incubation = 0);
    ((healthy - contractedPerDay) <= 0) ? (incubation += healthy, healthy = 0) : (healthy -= contractedPerDay);

    areHealthy[currentDay] = Math.round(healthy);
    inIncubation[currentDay] = Math.round(incubation);
    areIll[currentDay] = Math.round(ill);
    areImmune[currentDay] = Math.round(immune);
  }
  
  function getResults() {

    console.log("Healthy People: ", areHealthy);
    console.log("People in incubations: ", inIncubation);
    console.log("Ill people: ", areIll);
    console.log("Immune people: ", areImmune);

    return {
      areHealthy: areHealthy,
      inIncubation: inIncubation,
      areIll: areIll,
      areImmune: areImmune,
    };
  }
  
  return {
    init: init,
    start: start,
    nextDay: nextDay,
    getResults: getResults,
  };
})();

var unittest = (function () {
  var tests = {
    initTest: function () {
      
    },

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
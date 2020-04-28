var sim = (function () {

  function init() {
  }
  
  function start() {
  }
  
  function nextDay() {
  }
  
  function getResults() {
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
    dummyTrueTest: function () {
      return true;
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
sim.init();

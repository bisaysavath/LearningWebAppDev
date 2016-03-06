// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

/* globals _: false */

// Billy Saysavath

var main = function () {
  "use strict";

  /***************************
  ****** First Exercise ******
  ****** Get an average ******
  ***************************/
  var exercise1 = function (nums) {
    var sum;
    sum = nums.reduce(function(sumSoFar, currentValue) {
      return sumSoFar + currentValue;
    });

    return sum / nums.length;
  };

  /***************************
  ****** Second Exercise *****
  ****** Find a largest ******
  ***************************/
  var exercise2 = function (nums) {
    return nums.reduce(function(largestSoFar, currentValue) {
      if (largestSoFar < currentValue) {
        return currentValue;
      }

      return largestSoFar;
    });
  };

  /***************************
  ****** Second Exercise *****
  ****** Find a largest ******
  ***** Using underscore *****
  ***************************/
  var exercise2Underscore = function (nums) {
    return _.max(nums);
  };

  /***************************
  ****** Third Exercise ******
  ******* Find an even *******
  ***************************/
  var exercise3 = function (nums) {
    var i;
    var len = nums.length;

    for (i = 0; i < len; i++) {
      if (nums[i] % 2 === 0) {
        return true;
      }
    }

    return false;
  };

  /***************************
  ****** Third Exercise *****
  ****** Find an even *******
  ***** Using underscore *****
  ***************************/
  var exercise3Underscore = function (nums) {
    return _.some(nums, function (num) {
      return (num % 2) === 0;
    });
  };

  /***************************
  ****** Fourth Exercise *****
  ****** Find all even *******
  ***************************/
  var exercise4 = function (nums) {
    var i;
    var len = nums.length;
    for (i = 0; i < len; i++) {
      if (nums[i] % 2 !== 0) {
        return false;
      }
    }

    return true;
  };

  /***************************
  ****** Fourth Exercise *****
  ****** Find all even *******
  ***** Using underscore *****
  ***************************/
  var exercise4Underscore = function (nums) {
    return _.every(nums, function (num) {
      return (num % 2) === 0;
    });
  };

  /***************************
  ****** Fifth Exercise ******
  ****** Contains once *******
  ***************************/
  var arrayContains = function (sArray, s) {
    var i;
    var len = sArray.length;
    for (i = 0; i < len; i++) {
      if (sArray[i] === s) {
        return true;
      }
    }

    return false;
  };

  /***************************
  **** Sixth Exercise Pt.1 ****
  ****** Contains twice ******
  ***************************/
  var arrayContainsTwo = function (sArray, c) {
    var found = 0;

    sArray.forEach(function (element) {
      if (element === c) {
        found = found + 1;
      }
    });

    return (found >= 2) ? true : false;
  };

  /***************************
  **** Sixth Exercise Pt.2 ****
  ****** Contains thrice ******
  ***************************/
  var arrayContainsThree = function (sArray, c) {
    var found = 0;

    sArray.forEach(function (element) {
      if (element === c) {
        found = found + 1;
      }
    });

    return (found >= 3) ? true : false;
  };

  /***************************
  **** Sixth Exercise Pt.3 ****
  ****** Contains N times *****
  ***************************/
  var arrayContainsNTimes = function (sArray, c, n) {
    var found = 0;

    sArray.forEach(function (element) {
      if (element === c) {
        found = found + 1;
      }
    });

    return (found >= n) ? true : false;
  };

  // Performing exercise 1 - 4
  var array;
  var $result;
  var exercise;
  var problem;
  var selector;
  var target;

  var arrayOfFunctions = [
    exercise1,
    exercise2,
    exercise2Underscore,
    exercise3,
    exercise3Underscore,
    exercise4,
    exercise4Underscore];

  var arrayOfClasses = [
    ".exercise1",
    ".exercise2",
    ".exercise2-underscore",
    ".exercise3",
    ".exercise3-underscore",
    ".exercise4",
    ".exercise4-underscore"];

  for (exercise = 0; exercise < 7; exercise++) {
    for (problem = 1; problem <= 4; problem++) {
      selector = arrayOfClasses[exercise] + " .array" + problem;
      target = arrayOfClasses[exercise] + " .result" + problem;

      array = JSON.parse($(selector).text());
      $result = $("<span>").text(arrayOfFunctions[exercise](array));
      $(target).append($result);
    }
  }

  // Performing exercise 5, 6-twice, 6-thrice
  var arraySelector;
  var stringSelector;
  var string;

  arrayOfFunctions = [
    arrayContains,
    arrayContainsTwo,
    arrayContainsThree];

  arrayOfClasses = [
    ".exercise5",
    ".exercise6-2",
    ".exercise6-3"];

  for (exercise = 0; exercise < 3; exercise++) {
    for (problem = 1; problem <= 3; problem++) {
      arraySelector = arrayOfClasses[exercise] + " .array" + problem;
      stringSelector = arrayOfClasses[exercise] + " .string" + problem;
      target = arrayOfClasses[exercise] + " .result" + problem;

      array = JSON.parse($(arraySelector).text());
      string = $(stringSelector).text();
      $result = $("<span>").text(arrayOfFunctions[exercise](array, string));
      $(target).append($result);
    }
  }

  // Performing exercise 6-N
  var time;
  var timeSelector;

  for (problem = 1; problem <= 6; problem++) {
    arraySelector = ".exercise6-N .array" + problem;
    stringSelector = ".exercise6-N .string" + problem;
    timeSelector = ".exercise6-N .time" + problem;
    target = ".exercise6-N .result" + problem;

    array = JSON.parse($(arraySelector).text());
    string = $(stringSelector).text();
    time = $(timeSelector).text();
    $result = $("<span>").text(arrayContainsNTimes(array, string, time));
    $(target).append($result);
  }
};

$(document).ready(main);


var surNameJSON;
var questionJSON;
var resultJSON;
var avgResultJSON;
var groupArray;
var avgArray;
var temp;
var ctx;
var resultChart = null;

$(document).ready(function () {
  temp = document.getElementById("myCanvas");
  ctx = temp.getContext("2d");
  $.ajax({

    type: "POST",
    url: "../index.php",
    data: ({ getSurNames: "yes", aType: "POLL" }),
    success: function (json) {
      var surNameJSON = JSON.parse(json);
      var sMI = document.getElementById("surveyMenuItems");
      sMI.innerHTML = "";
      //Help for this part from https://stackoverflow.com/questions/38575721/grouping-json-by-values
      Object.keys(surNameJSON).forEach(function (category) {
        sMI.innerHTML += "<button class=\"dropdown-item surButton\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\" value=\"${category}\")>" + category + "</button>";
      });
    },

    error: function () {
      alert('Error occurred while retrieving data.');
      topRelMenuButton.disabled = true;
      topAnsMenuButton.disabled = true;
      return false;
    }
  });

});


$('#curRelLevelButton').click(function () {
  relationsButton()
});
function relationsButton() {

  var x = document.getElementById("surveyButtons");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  groupArray = [];
  avgArray = [];
  for (var i in avgResultJSON) {
    groupArray.push(avgResultJSON[i].groupName);
    avgArray.push(avgResultJSON[i].average_relationship);

  }
}

function createMixedChart() {
  if (resultChart != null) {
    resultChart.destroy();
  }
  resultChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{

        label: 'Bar_Set',
        data: avgArray
      }, {
        label: 'Line_Set',
        data: avgArray,

        type: 'line'
      }],
      labels: groupArray
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function createLineChart() {
  if (resultChart != null) {
    resultChart.destroy();
  }
  resultChart = new Chart(ctx, {
    type: 'line',
    data: avgArray,
    labels: groupArray,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function createBarChart() {
  if (resultChart != null) {
    resultChart.destroy();
  }
  resultChart = new Chart(ctx, {
    type: 'bar',
    data: js_relationArrayJSON,
    labels: groupArray,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}



$('#answersMenuButton').click(function () {

  surveyButtonFiller();
});

function surveyButtonFiller() {
  var sMI = document.getElementById("surveyMenuItems");
  sMI.innerHTML = "";
  //Help for this part from https://stackoverflow.com/questions/38575721/grouping-json-by-values
  var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  var groupedBySurveyName = groupBy(js_questionJSON, 'surName');
  Object.keys(groupedBySurveyName).forEach(function (category) {
    sMI.innerHTML += "<button class=\"dropdown-item surButton\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\" value=\"${category}\")>${category}</button>";

  });
  var x = document.getElementById("AnswerDropdown");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  var y = document.getElementById("indResultsButton")
  if (y.style.display == "none") {
    y.style.display = "block";
  } else {
    y.style.display = "none";
  }

}

$('.surButton').click(function () {
  surveyName = this.innerHTML;
  $.ajax({

    type: "POST",
    url: "../index.php",
    data: ({ getAvgResults: "yes", aType: "POLL", surName: surveyName }),
    success: function (json) {
      avgResultJSON = JSON.parse(json);
    }
  });
  $.ajax({

    type: "POST",
    url: "../index.php",
    data: ({ getChartResults: "yes", aType: "POLL", surName: surveyName }),
    success: function (json) {
      resultsJSON = JSON.parse(json);
    }
  });

  $.ajax({

    type: "POST",
    url: "../index.php",
    data: ({ getQuestions: "yes", aType: "POLL", surName: surveyName }),
    success: function (json) {
      questionJSON = JSON.parse(json);
    }
  });

  answersButtonFiller();
  var x = document.getElementById("MenuButtons");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

});
$('#indResultsButton').click(function () {

  exportResponsesToCSV(surveyName);
});
function answersButtonFiller() {

  var sMI = document.getElementById("questionMenuItems");

  sMI.innerHTML = "";
  var question = 1;
  questionJSON.forEach(function (item) {

    sMI.innerHTML += "<button class=\"dropdown-item question-button\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\" value=" + surname + " on>" + item.qNum + "</button>";
  });


}

$('.question-button').click(function () {

  pieChartMaker(this.innerHTML, $(this).val());
});
function pieChartMaker(qNum) {
  var qNumInt = parseInt(qNum);
  var filteredResults = js_resultJSON.filter(function (item) {

    return item.surName === SurName;
  });
  var filteredSurveyQuestionArray = js_questionJSON.filter(function (item) {

    return item.surName === SurName;
  });
  var filteredQuestion = filteredSurveyQuestionArray.filter(function (item) {

    return item.qNum === qNumInt;
  });


  var resultData = [];
  filteredResults.forEach(function (item) {
    var itemResponses = item.surResults;
    var seperatedResponses = itemResponses.split("`|");
    var qNumIntMinus = qNumInt - 1;
    var responses = seperatedResponses[qNumIntMinus];
    var brokenUp = seperatedResponses.split("`~")
    for (var i = 0; i < brokenUp.length; i++) {
      resultData.push(brokenUp[i]);
    }
  }
  );
  resultData.sort();
  var counts = {};
  var possibleResponses = filteredQuestion[0].qChoices.split("`|");
  for (var i = 0; i < possibleResponses.length; i++) {
    var resp = person.possibleResponses[i];
    counts[resp] = 0;
  };
  for (var i = 0; i < resultData.length; i++) {
    var resp = resultData[i];

    counts[resp] = counts[resp] ? counts[resp] + 1 : 1;
  };

  if (resultChart != null) {
    resultChart.destroy();
  }
  resultChart = new Chart(ctx, {
    type: 'pie',
    data: Object.values(counts),
    labels: possibleResponses
  });


}

function exportResponsesToCSV(SurName) {
  let csvContent = "data:text/csv;charset=utf-8,";
  var filtered = js_questionJSON.filter(function (item) {

    return item.surName === SurName;
  });
  var titleRowArray = ["Record Number", "Group Name", "Relation Level"]
  for (var i = 0; i < filtered.length; i++) {
    titleRowArray.push("Question" + filtered[i].qNum);
  }
  let titleRow = titleRowArray.join(",");
  csvContent += titleRow + "\r\n";
  var filteredResults = js_resultJSON.filter(function (item) {

    return item.surName === SurName;
  });
  for (var i = 0; i < js_resultJSON.length; i++) {
    var answers = js_resultJSON[i].surResults.split("`|");
    var rowArray = [js_resultJSON[i].recNum, js_resultJSON[i].groupName, js_resultJSON[i].rLevel];
    rowArray.push.apply(answers);
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  }
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);

}

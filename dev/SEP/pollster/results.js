// Contains all client functions specific to grabbing and displaying survey results
// Also contains export to CSV functionality

var questions, secReqs, results, comments, avgResultJSON, groupArr = Array();

var ctx;
var resultChart = null;
var curGroupName = "ALL_OF_THE_GROUPS";
var surName;

$(document).ready(function () {
  temp = document.getElementById("chart");
  ctx = temp.getContext("2d");
});
function showData(surveyName) {
    surName = surveyName;
    $.ajax({
        type: "POST",
        cache: false,
        url: "../index.php",
        data: { aType: "POLL", pReqType: "RESULT", getResults: "true", surName: surveyName },
        success: function (response) {
            if (response.includes("THERE ARE NO RESULTS TO BE HAD")) {
                $("#overallData").removeClass("questions-wrapper");
                $("#overallData").html("<div style='padding-top: 48%; text-align: center;'>\
                                            <h3 class='greyed-out'>No Results</h3>\
                                        </div>");
                $("#showChartsButton").remove();
                $("#exportDataButton").remove();
            }
            else {
                var data = JSON.parse(response);
                questions = JSON.parse(data[0]);
                secReqs = JSON.parse(data[1]);
                results = JSON.parse(data[2]);
                displayAllGroups();
                displayGroupButtons();
                if (!data[3].includes("THERE ARE NO COMMENTS")) {
                    comments = JSON.parse(data[3]);
                    displayComments();
                }
            }
        },
        error: function (jxqr, status, exception) {
            alert("Failing at showData() ajax call in results.js");
        }

    });

    $.ajax({

    type: "POST",
    url: "../index.php",
    data: ({aType: "POLL", pReqType: "RESULT", getAvgResults: "yes", surName: surveyName }),
    success: function (json) {
      if(!json.includes("THERE ARE NO RESULTS TO BE HAD"))
      {
      avgResultJSON = JSON.parse(json);
    }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
     alert("some error");
    }
  });
}

function displayAllGroups() {
    curGroupName = "ALL_OF_THE_GROUPS";
    var timeSD, timeSum = 0, num = 0, timeAvg, rSum = 0, rAvg, timeSumofSquares = 0;
    for (; num < results.length; num++) {
        if (!groupArr.includes(results[num].groupName)) {
            groupArr.push(results[num].groupName);
        }
        timeSum += results[num].time;
        rSum += results[num].rLevel+1;
        timeSumofSquares += results[num].time * results[num].time;
    }
    timeVar = (num * timeSumofSquares - timeSum * timeSum) / (num * num);
    timeSD = Math.sqrt(timeVar);
    rAvg = rSum / num;
    timeAvg = timeSum / num;
    $("#overallData").html(constructDashDataHTML(rAvg, timeAvg, num, timeSD));
    displayQuestionDataAll();
}

function displayGroupButtons() {
    for (var i = 0; i < groupArr.length; i++) {
        var button = "<input value='" + groupArr[i] + "' type='button'class='btn btn-primary btn-sm shadow gb' groupNum='" + (i + 1) + "'>";
        $("#groupButtonBar").append(button);
    }
    var allGroupButton = "<input value='All Groups' type='button' style='float: right;' class='btn btn-secondary btn-sm shadow gb' groupNum='0'>";
    $("#groupButtonBar").append(allGroupButton);
    $(".gb").each(function (i, ele) {
        $(ele).click(function () {
            displayGroup($(ele).attr("groupNum"));
            $(".gb").each(function (i, element) {
                $(element).removeClass("btn-secondary");
                $(element).addClass("btn-primary");
            })
            $(ele).removeClass("btn-primary");
            $(ele).addClass("btn-secondary");
        });
    });
}

function displayGroup(groupNum) {
    curGroupName = groupArr[groupNum - 1];
    if (groupNum == 0) {
        displayAllGroups();
        return;
    }
    var timeSD, timeSum = 0, num = 0, timeAvg, rSum = 0, rAvg, timeSumofSquares = 0;
    for (var i = 0; i < results.length; i++) {
        if (groupArr.indexOf(results[i].groupName) === groupNum - 1) {
            num++;
            timeSum += results[i].time;
            rSum += results[i].rLevel+1;
            timeSumofSquares += results[i].time * results[i].time;
        }
    }
    timeVar = (num * timeSumofSquares - timeSum * timeSum) / (num * num);
    timeSD = Math.sqrt(timeVar);
    rAvg = rSum / num;
    timeAvg = timeSum / num;
    $("#overallData").html(constructDashDataHTML(rAvg, timeAvg, num, timeSD));
    displayQuestionDataGroup(groupNum);
}

function constructDashDataHTML(rAvg, timeAvg, num, timeSD) {
    var toReturn = "<h4>TOTAL RESPONSES</h4><h3>" + num + "</h3></br>\
                    <h4>TIME</h4><h3>Average: " + Math.round(timeAvg) + " Seconds</h3>\
                    <h3>Standard Deviation: " + Math.round(timeSD) + " Seconds</h3></br>\
                    <h4>AVERAGE RLEVEL</h4><h3>" + (rAvg) + "</h3>";

    return toReturn;
}

function displayQuestionDataAll() {
    $("#questionData").html("");
    for (var i = 0; i < questions.length; i++) {
        var qText = questions[i].qText;
        var qNum = questions[i].qNum;
        var qAns = questions[i].qAns;
        var rLevel = questions[i].rLevel;
        var qWeight = questions[i].qWeight;
        var qType = questions[i].qType;

        var response;
        if (qType == "chk") {
            response = getResponsesCHKAll(i);
        }
        else {
            response = getResponsesAll(i, qType);
        };

        var appendHTML = constructQuestHTML(qText, qNum, qAns, qWeight, response, qType);

        $("#questionData").append(appendHTML);
    }
}

function getResponsesAll(qNum, qType) {
    var toReturn = { "total": 0 };
    switch (qType) {
        case "tf":
            toReturn = { "t": 0, "f": 0, "total": 0 };
            break;
        case "s":
            toReturn = { "sta": 0, "a": 0, "sla": 0, "sld": 0, "d": 0, "std": 0, "total": 0 };
            break;
        case "mc": {
            var ans = questions[qNum].qChoices;
            var choiceArr = ans.split("~$#");                   //Split by arbitrary delimiter we chose
            for (var i = 0; i < choiceArr.length; i++) {
                toReturn[choiceArr[i].substr(0, choiceArr[i].length - 3)] = 0;
            }
        }
    }

    for (var i = 0; i < results.length; i++) {
        var surResults = results[i].surResults;
        rArr = JSON.parse(surResults);
        rAns = JSON.parse(JSON.parse(rArr[qNum])[0]);
        try {
            for (var key in toReturn) {
                if (key == rAns.value.substr(0, rAns.value.length - 2) || key == rAns.value) { //Two different cases for scales and true/false for some reason. May need reworking on response side
                    toReturn[key]++;
                }
            }
            toReturn.total++;
        }
        catch (err) { continue; } // try/catch here because not all records will have all questions
    }
    return toReturn;
}

function getResponsesCHKAll(qNum) {
    var ans = questions[qNum].qChoices;
    var choiceArr = ans.split("~$#");       // Splitting by arbitrary delimiter we chose
    var toReturn = { "total": 0 };
    for (var i = 0; i < choiceArr.length; i++) {
        var choice = choiceArr[i].substr(0, choiceArr[i].length - 3);
        toReturn[choice] = 0;
    }

    for (var i = 0; i < results.length; i++) {
        var surResults = results[i].surResults;
        rArr = JSON.parse(surResults);
        rAnsChoiceArr = JSON.parse(rArr[qNum]);
        toReturn.total++;
        for (var j = 0; j < rAnsChoiceArr.length; j++) {
            var choice = rAnsChoiceArr[j];
            rAns = JSON.parse(choice);
            try {
                for (var key in toReturn) {
                    if (key == rAns.value.substr(0, rAns.value.length - 2)) {
                        toReturn[key]++;
                    }
                }
            }
            catch (err) { continue; } // try/catch here because not all records will have all questions
        }
    }
    return toReturn;
}

function displayQuestionDataGroup(groupNum) {
    if (groupNum == 0) {
        displayQuestionDataAll();
        return;
    }
    $("#questionData").html("");
    for (var i = 0; i < questions.length; i++) {
        var qText = questions[i].qText;
        var qType = questions[i].qType;
        var qNum = questions[i].qNum;
        var qAns = questions[i].qAns;
        var rLevel = questions[i].rLevel;
        var qWeight = questions[i].qWeight;

        var response;
        if (qType == "chk") {
            response = getResponsesCHKGroup(i, groupNum);
        }
        else {
            response = getResponsesGroup(i, qType, groupNum);
        }

        var appendHTML = constructQuestHTML(qText, qNum, qAns, qWeight, response, qType);

        $("#questionData").append(appendHTML);
    }
}

function getResponsesGroup(qNum, qType, groupNum) {
    var toReturn = { "total": 0 };
    switch (qType) {
        case "tf":
            toReturn = { "t": 0, "f": 0, "total": 0 };
            break;
        case "s":
            toReturn = { "sta": 0, "a": 0, "sla": 0, "sld": 0, "d": 0, "std": 0, "total": 0 };
            break;
        case "mc": {
            var ans = questions[qNum].qChoices;
            var choiceArr = ans.split("~$#");           //Split by arbitrary delimiter we chose
            for (var i = 0; i < choiceArr.length; i++) {
                toReturn[choiceArr[i].substr(0, choiceArr[i].length - 3)] = 0;
            }
        }
    }
    for (var i = 0; i < results.length; i++) {
        if (groupArr.indexOf(results[i].groupName) === groupNum - 1) {
            var surResults = results[i].surResults;
            rArr = JSON.parse(surResults);
            rAns = JSON.parse(JSON.parse(rArr[qNum])[0]);
            try {
                for (var key in toReturn) {
                    if (key == rAns.value.substr(0, rAns.value.length - 2) || key == rAns.value) {
                        toReturn[key]++;
                    }
                }
                toReturn.total++;
            }
            catch (err) { continue; } // try/catch here because not all records will have all questions
        }
    }
    return toReturn;
}

function getResponsesCHKGroup(qNum, groupNum) {
    var ans = questions[qNum].qChoices;
    var choiceArr = ans.split("~$#");           //Split by arbitrary delimiter we chose
    var toReturn = { "total": 0 };
    for (var i = 0; i < choiceArr.length; i++) {
        var choice = choiceArr[i].substr(0, choiceArr[i].length - 3);
        toReturn[choice] = 0;
    }

    for (var i = 0; i < results.length; i++) {
        if (groupArr.indexOf(results[i].groupName) === groupNum - 1) {
            var surResults = results[i].surResults;
            rArr = JSON.parse(surResults);
            rAnsChoiceArr = JSON.parse(rArr[qNum]);
            toReturn.total++;
            for (var j = 0; j < rAnsChoiceArr.length; j++) {
                var choice = rAnsChoiceArr[j];
                rAns = JSON.parse(choice);
                try {
                    for (var key in toReturn) {
                        if (key == rAns.value.substr(0, rAns.value.length - 2)) {
                            toReturn[key]++;
                        }
                    }
                }
                catch (err) { continue; } // try/catch here because not all records will have all questions
            }
        }
    }
    return toReturn;
}

function constructQuestHTML(qText, qNum, qAns, qWeight, response, qType) {
    var toReturn = "<div class='questions-wrapper shadow''><h3>" + qNum + ") " + qText + "</h3>";
    for (var key in response) {
        if (key != "total") {
            var dispKey;
            switch (key) {
                case "t":
                    dispKey = "True";
                    break;
                case "f":
                    dispKey = "False";
                    break;
                case "sta":
                    dispKey = "Strongly Agree";
                    break;
                case "std":
                    dispKey = "Strongly Disagree";
                    break;
                case "a":
                    dispKey = "Agree";
                    break;
                case "d":
                    dispKey = "Disagree";
                    break;
                case "sla":
                    dispKey = "Slightly Disagree";
                    break;
                case "sld":
                    dispKey = "Slightly Disagree";
                    break;
                default:
                    dispKey = key;
            }
            toReturn += "<h4>" + dispKey + "</h4>";
            var width = Math.round((response[key] / response.total) * 100);
            var percent = width;
            var cssClass = "solid-bar";
            if (qAns == key) {
                cssClass += " correctAnswer";
            }
            else if (qType == 'chk') {
                var ansArray = JSON.parse(qAns);
                for (var k = 0; k < ansArray.length; k++) {
                    var ans = ansArray[k];
                    if (key == ans) {
                        cssClass += " correctAnswer";
                    }
                }
            }
            if (width == 0) {
                cssClass = "empty-choice";
                width = 100;
            }
            var bar = "<span class='" + cssClass + "' style='width: " + width + "%;'>" + response[key] + " (" + percent + "%)" + "</span>";
            toReturn += bar;
        }
    }
    toReturn += "</div></br>"
    return toReturn;
}

function displayComments() {
    for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        toDisplay = "<div class='commentDisplay'><h4>\"" + comment + "\"</h4></div>";
        $("#commentsData").append(toDisplay);
    }


}

function relationsButton() {
  groupArray = [];
  tempArray = [];
  avgArray=[];
  groupArray.push("Overall");
  tempArray["Overall"]={"count":0, "total":0};
  for(var i=0; i<results.length; i++)
  {
    if (!groupArray.includes(results[i].groupName)) {
        var gN=results[i].groupName;
        groupArray.push(gN);
        tempArray[gN]= {"count":0, "total":0}
    }
    tempArray["Overall"].total=tempArray["Overall"].total+(results[i].rLevel+1);
    tempArray["Overall"].count=tempArray["Overall"].count + 1;
    tempArray[gN].total=tempArray[gN].total+(results[i].rLevel+1);
    tempArray[gN].count=tempArray[gN].count+1;
  }
  for(var i=0; i<Object.values(tempArray).length; i++)
  {
    var avg=+(((Object.values(tempArray)[i].total)/(Object.values(tempArray)[i].count)).toFixed(2));
    avgArray.push(avg)
  }

if (resultChart != null) {
    resultChart.destroy();
  }
  resultChart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
	label: 'Bar_Set',
	backgroundColor: "rgba(250,0,0,0.5)",
	borderColor: "rgba(250,0,0,0.75)",
        data: avgArray
      }, {
        label: 'Line_Set',
        data: avgArray,
	borderColor: "rgba(0,250,0,0.8)",
	backgroundColor: "rgba(250,0,0,0.0)",
        type: 'line'
      }],
      labels: groupArray
    },

    options: {
      animation: {
          onComplete: function () {
              var ctx = this.chart.ctx;
              ctx.font = "10pt Arial";
              ctx.fillStyle = "black";
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              this.data.datasets.forEach(function (dataset)
              {
                  for (var i = 0; i < dataset.data.length; i++) {
                      for(var key in dataset._meta)
                      {
                          var model = dataset._meta[key].data[i]._model;
                          ctx.fillText(dataset.data[i], model.x, model.y);
                      }
                  }
              });
          }
      },
      title: {

        display: true,
        fontStyle:'bold',
        fontSize: 20,
        padding:10,
        text: "Average Relation Level For Each Department"
      },
      scales: {
        yAxes: [{
          scaleLabel: {
          display:true,
          labelString: "Average Relation Level"
        },
          ticks: {
            min: 1
          }
        }]
      }
    }
  });
}

function exportResponsesToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    var titleRowArray = ["Record Number", "Group Name", "Relation Level"]
    for (var i = 0; i < questions.length; i++) {
        titleRowArray.push("Question "+(i+1)+": "+questions[i].qText);
    }
    let titleRow = titleRowArray.join(",");
    csvContent += titleRow + "\r\n";
    for (var i = 0; i < results.length; i++) {
        var row = [];
        row.push(i+1);
        row.push(results[i].groupName);
        row.push(results[i].rLevel+1);

        var resultJSON = JSON.parse(results[i].surResults);
        for (var j = 0; j < resultJSON.length; j++) {
            var resultForQuestion = JSON.parse(resultJSON[j]);
            var itemResponses = [];
            for (var k = 0; k < resultForQuestion.length; k++) {
                var response = JSON.parse(resultForQuestion[k]).value;
                var tempIndex = response.indexOf(",");
                var newString = response.substr(0, tempIndex);
                if(newString == ""){
                    newString = response.split(" ")[0];
                }
                itemResponses.push(newString);
            }
		itemResponses=itemResponses.join(";");
            row.push(itemResponses);
        }
        let resultRow = row.join(",")

        csvContent += resultRow + "\r\n";
    }
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
	var filename=surName.replace(" ", "_") + "_" + new Date().toLocaleDateString() + ".csv"
    link.setAttribute("download", filename);
    link.innerHTML = "Click Here to download";
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
}

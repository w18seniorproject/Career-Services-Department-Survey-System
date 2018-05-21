
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
  var topRelMenuButton = document.getElementById("curRelLevelButton");  // Nic did this. I guessed that this is what these variables are supposed to be.
  var topAnsMenuButton = document.getElementById("answersMenuButton");
  $.ajax({

    type: "POST",
    url: "../index.php",                                               // Fixed this. you only need ../index.php, not ../../index.php
    data: ({ getSurNames: "yes", aType: "POLL" }),
    success: function (json) {
	    alert(json);                                                    // Can see errors with this
      var surNameJSON = JSON.parse(json);
      
      //Help for this part from https://stackoverflow.com/questions/38575721/grouping-json-by-values
      for(var i=0; i<surNameJSON.length; i++)
	{
	
       	//var span = document.createElement('span');
	//span.innerHTML +='<button id="but' + i +'" onclick="surButtonClick("'+surNameJSON[i].surName	//+'")">'+surNameJSON[i].surName+'</button>';
	//sMI.appendChild(span);

	var element = document.createElement("button");
	element.type="button";

	element.name=surNameJSON[i].surName;
	var t = document.createTextNode(surNameJSON[i].surName);
	element.appendChild(t);
	element.value=surNameJSON[i].surName;
	var surname=surNameJSON[i].surName;
	alert(surname);
	element.onclick=function(){
	surButtonClick(surname);	
}
	var sMI = document.getElementById("surveyMenuItems");
	sMI.appendChild(element);
      };
    },

    error: function (jqxr, status, exception) {
      alert('Failure in ajax call to get Survey Names in MenuButtonFunctions.js: ' + exception);
      topRelMenuButton.disabled = true;
      topAnsMenuButton.disabled = true;
      return false;
    }
  });

});



function relationsButton() {
  groupArray = [];
  avgArray = [];
  for (var i in avgResultJSON) {
    groupArray.push(avgResultJSON[i].groupName);
    avgArray.push(avgResultJSON[i].rLevel);

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
animation: {
    onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        this.data.datasets.forEach(function (dataset)
        {
            for (var i = 0; i < dataset.data.length; i++) {
                for(var key in dataset._meta)
                {
                    var model = dataset._meta[key].data[i]._model;
                    ctx.fillText(dataset.data[i], model.x, model.y - 5);
                }
            }
        });
    }
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

function createBarChart() {
  if (resultChart != null) {
    resultChart.destroy();
  }
  resultChart = new Chart(ctx, {
    type: 'bar',
    data: avgArray,
    labels: groupArray
    
      
  });
}




function surButtonClick (x) {
alert("we are in the surButton method");
  surveyName = x;
alert(surveyName)
  $.ajax({

    type: "POST",
    url: "../index.php",
    data: ({ getAvgResults: "yes", aType: "POLL", surName: surveyName }),
    success: function (json) {
	alert(json);
      avgResultJSON = JSON.parse(json);
    }
  });
  $.ajax({

    type: "POST",
    url: "../index.php",
    data: ({ getChartResults: "yes", aType: "POLL", surName: surveyName }),
    success: function (json) {
	alert(json);
      resultsJSON = JSON.parse(json);
    }
  });

  
  var x = document.getElementById("MenuButtons");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

};
$('#indResultsButton').click(function () {

  exportResponsesToCSV(surveyName);
});



function answerMenuReveal(){

	

  answersButtonFiller();
	
}
function answersButtonFiller() {

$.ajax({

    type: "POST",
    url: "../index.php",
    data: ({ getQuestions: "yes", aType: "POLL", surName: surveyName }),
    success: function (json) {
	alert(json);
      questionJSON = JSON.parse(json);
    }
  });
alert(questionJSON);	
var questionNumArray = [];
  for(var i in questionJSON)
{
	alert(questionJSON[i].qNum);
	questionNumArray.push(questionJSON[i].qNum);
}
  var sMI = document.getElementById("questionMenuItems");
  for(var i = 0; i<questionNumArray.length; i++){

    var element = document.createElement("button");
	element.type="button";

	element.name=questionNumArray[i].qNum;
	var t = document.createTextNode(questionNumArray[i].qNum);
	element.appendChild(t);
	element.value=questionNumArray[i].qNum;
	var qNum=questionNumArray[i].qNum;
	alert(qNum);
	element.onclick=function(){
	pieChartMaker(qNum);	
	}
	sMI.appendChild(element);
  };
var x = document.getElementById("AnswerDropdown");
 if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

var y = document.getElementById("QuestionButton");
 if (y.style.display == "none") {
    y.style.display = "block";
  } else {
    y.style.display = "none";
  }

}

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

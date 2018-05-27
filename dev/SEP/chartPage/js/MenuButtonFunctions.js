
var surNameJSON;
var questionJSON;
var resultsJSON;
var avgResultJSON;
var groupArray;
var avgArray;
var surveyName;
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
      data: ({ getQuestions: "yes", aType: "POLL", surName: surveyName }),
      success: function (json) {
  	alert(json);
        questionJSON = JSON.parse(json);
      }
    });

    $.ajax({

      type: "POST",
      url: "../index.php",
      data: ({ getChartResults: "yes", aType: "POLL", surName: surveyName }),
      success: function (json) {

        resultsJSON = JSON.parse(json);
      },
      error: function(){
        alert("Something went wrong");
      }
    });
  var x = document.getElementById("MenuButtons");
  if (x.style.display == "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
  var y = document.getElementById("ExportButtonMenu");
  if (y.style.display == "none") {
    y.style.display = "block";
  } else {
    y.style.display = "none";
  }
};




function answerMenuReveal(){



  answersButtonFiller();

}
function answersButtonFiller() {


alert(questionJSON[0]);
var questionNumArray = [];
  for(var i in questionJSON)
{
	alert(questionJSON[i].qNum);
	questionNumArray.push(questionJSON[i].qNum);
}
alert(questionNumArray);
  var sMI = document.getElementById("questionMenuItems");
  for(var i = 0; i<questionNumArray.length; i++){

    var element = document.createElement("button");
	element.type="button";

	element.name=questionNumArray[i];
	var t = document.createTextNode(questionNumArray[i]);
	element.appendChild(t);
	element.value=questionNumArray[i];
	var qNum=questionNumArray[i];
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
  var qNumIntMinus = qNumInt - 1;
  var filteredQuestion = questionJSON[qNumIntMinus];
  alert(qNumInt);
  alert(resultsJSON);
  var resultData = [];
  for(var i=0; i<resultsJSON.length; i++)
  {
    var itemResponses = JSON.parse(resultsJSON[i].surResults);
    var itemJSON=JSON.parse(itemResponses[qNumIntMinus]);
    for (var j = 0; i < itemJSON.length; i++) {
      var response=JSON.parse(itemJSON[i]);
      var temp=response.value.indexOf(",");
      resultData.push(response.value.substr(0,temp));
    }
  };
  alert(resultData);
  resultData.sort();

  var counts = {};
  var possibleResponses=filteredQuestion.qChoices.split("~$#");
  for(var i = 0; i<possibleResponses.length;i++)
  {
    var temp=possibleResponses[i].indexOf("|`");
    possibleResponses[i]=possibleResponses[i].substr(0,temp);
    counts
  }
  alert(possibleResponses);
  for (var i = 0; i < possibleResponses.length; i++) {
    var resp = possibleResponses[i];

    counts[resp]=0;
    alert(counts[resp]);
  };

  for (var i = 0; i < resultData.length; i++) {
    alert(resultData[i]);
    var resp = resultData[i];

    counts[resp] = counts[resp]+1;
  };
  alert(Object.values(counts));
  if (resultChart != null) {
    resultChart.destroy();
  }

  var dataformArray=[];
  var dataResponseArray=[];
  for(var i=0; i<Object.values(counts); i++ )
  {
    if((Object.values(counts)[i])>0)
    {
      dataResponseArray.push(Object.keys(counts)[i]);
    dataformArray.push(Object.values(counts)[i]);
    }
  }

  var data={
    labels: dataResponseArray,
    datasets:[
      {
        fill:true,
        data:dataformArray,
        backgroundColor: ["#878BB6"]
      }
    ]
  };
  resultChart = new Chart(ctx, {
    type: 'pie',
    data: data
  });


}

function exportResponsesToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  var titleRowArray = ["Record Number", "Group Name", "Relation Level"]
  for (var i = 0; i < questionJSON.length; i++) {
    titleRowArray.push("Question " + questionJSON[i].qNum);
  }
  let titleRow = titleRowArray.join(",");
  csvContent += titleRow + "\r\n";
  for(var i=0; i<resultsJSON.length; i++)
  {
    var row=[];
    row.push(resultsJSON[i].recNum);
    row.push(resultsJSON[i].groupName);
    row.push(resultsJSON[i].rLevel);

    var results= JSON.parse(resultsJSON[i].surResults);
    for(var j=0; j<results.length; j++)
    {
      var resultForQuestion=JSON.parse(results[j]);
      var itemResponses=[];
      for(var k=0; k<resultForQuestion.length; k++)
      {
          var response=JSON.parse(resultForQuestion[k]).value;
          var tempIndex=response.indexOf(",");
          var newString=response.substr(0,tempIndex);
          itemResponses.push(newString);
      }
      row.push(itemResponses);
    }
    let resultRow=row.join(",")

    csvContent += resultRow + "\r\n";
  }
  var encodedUri = encodeURI(csvContent);
  alert(encodedUri);
  var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "my_data.csv");
link.innerHTML= "Click Here to download";
document.body.appendChild(link); // Required for FF

link.click(); // This will download the data file named "my_data.csv".
}

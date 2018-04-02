
var js_relationArrayJSON;
var js_groupArrayJSON;

$.ajax({

  type: "POST",
  url: 'include/relationChartCreator.php',
  dataType: 'json',
  success: function(json){
    js_relationArrayJSON=json.rLA;
    js_groupArrayJSON=json.gNA;
  }

});
var js_relationArray=jQuery.parseJSON(js_relationArrayJSON);

var js_groupArray=jQuery.parseJSON(js_groupArrayJSON);
var temp=document.getElementById("myChart");
var ctx=temp.getContext("2d");
var resultChart=null;
function createMixedChart(){
  if(resultChart!=null)
  {
       resultChart.destroy();
  }
  resultChart= new Chart(ctx, {
  type: 'bar',
  data: {
    datasets: [{

      label: 'Bar_Set',
      data: js_relationArray
    }, {
    label:'Line_Set',
    data: js_relationArray,

    type: 'line'
  }],
  labels:js_groupArray
},
options: {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero:true
            }
        }]
    }
}
});
}

function createLineChart(){
 if(resultChart!=null)
 {
      resultChart.destroy();
 }
 resultChart= new Chart(ctx, {
 type: 'line',
 data: js_relationArray,
 labels:js_groupArray,
options: {
   scales: {
       yAxes: [{
           ticks: {
               beginAtZero:true
           }
       }]
   }
 }
});
}

function createBarChart(){
 if(resultChart!=null)
 {
      resultChart.destroy();
 }
 resultChart= new Chart(ctx, {
 type: 'bar',
 data: js_relationArray,
 labels:js_groupArray,
options: {
   scales: {
       yAxes: [{
           ticks: {
               beginAtZero:true
           }
       }]
   }
 }
});
}

window.onload = function(){


  var js_questionJSON;
  var js_resultJSON;
  var topRelMenuButton=document.getElementById("curRelLevelButton");
  var topAnsMenuButton=document.getElementById('answersMenuButton');
    $.ajax({

      type: "POST",
      url: 'include/dev/backend/getQuestions.php',
      dataType: 'json',
      success: function(json){
        js_questionJSON=JSON.parse(json);
        if(js_questionJSON.hasOwnProperty('message'))
        {
          alert('No Questions Currently Exists In Database');
          topRelMenuButton.disabled=true;
          topAnsMenuButton.disabled=true;
          return false;
        }
      },
      error: function(){
        alert('Error occurred while retrieving data.');
        topRelMenuButton.disabled=true;
        topAnsMenuButton.disabled=true;
        return false;
      }
    });
    $.ajax({

      type: "POST",
      url: 'include/dev/backend/getResults.php',
      dataType: 'json',
      success: function(json){
        js_resultJSON=JSON.parse(json);
        if(js_resultJSON.hasOwnProperty('message'))
        {
          alert('No Results Currently Exists In Database');
          topRelMenuButton.disabled=true;
          topAnsMenuButton.disabled=true;
          return false;
        }
      },
      error: function(){
        alert('Error occurred while retrieving data.');
        topRelMenuButton.disabled=true;
        topAnsMenuButton.disabled=true;
        return false;
      }
    });
  topRelMenuButton.onclick=relationsButton();
  topAnsMenuButton.onclick=surveyButtonFiller(js_questionJSON);



}

function relationsButton(){

  var x=document.getElementById("surveyButtons");
  if(x.style.display=="none"){
    x.style.display="block";
  }else {
    x.style.display="none";
  }
}

function surveyButtonFiller(questionJSON){
  var sMI=document.getElementById("surveyMenuItems");
  sMI.innerHTML="";
  //Help for this part from https://stackoverflow.com/questions/38575721/grouping-json-by-values
  var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
var groupedBySurveyName=groupBy(questionJSON, 'surName');
  Object.keys(groupedBySurveyName).forEach(function(category)
  {
      sMI.innerHTML+="<button class=\"dropdown-item\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\" value=\"${category}\" onclick=answersButtonFiller(${category})>${category}</button>";

  });
  var x=document.getElementById("AnswerDropdown");
  if(x.style.display=="none"){
    x.style.display="block";
  }else {
    x.style.display="none";
  }


}

function answersButtonFiller(surname)
{
  var js_questionJSON;
  $.ajax({

    type: "POST",
    url: 'include/dev/backend/getQuestions.php',
    dataType: 'json',
    success: function(json){
      js_questionJSON=JSON.parse(json);
      if(js_questionJSON.hasOwnProperty('message'))
      {
        alert('No Questions Currently Exists In Database');
        return false;
      }
    },
    error: function(){
      alert('Error occurred while retrieving data.');
      return false;
    }
  });

    var sMI=document.getElementById("questionMenuItems");

    sMI.innerHTML="";
    var filtered = js_questionJSON.filter(function(item){

      return item.surName === surname;
    });
    filtered.forEach(function(item)
    {

        sMI.innerHTML+="<button class=\"dropdown-item\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\" value="+item.qNum+" on>"+item.qNum+"</button>";
    });


}

function pieChartMaker(qNum, SurName)
{
  var js_resultJSON;
  $.ajax({

    type: "POST",
    url: 'include/dev/backend/getResults.php',
    dataType: 'json',
    success: function(json){
      js_resultJSON=JSON.parse(json);
      if(js_resultJSON.hasOwnProperty('message'))
      {
        alert('No Results Currently Exists In Database');
        return false;
      }
    },
    error: function(){
      alert('Error occurred while retrieving data.');
      return false;
    }
  });
  var js_questionJSON;
  $.ajax({

    type: "POST",
    url: 'include/dev/backend/getQuestions.php',
    dataType: 'json',
    success: function(json){
      js_questionJSON=JSON.parse(json);
      if(js_questionJSON.hasOwnProperty('message'))
      {
        alert('No Questions Currently Exists In Database');
        return false;
      }
    },
    error: function(){
      alert('Error occurred while retrieving data.');
      return false;
    }
  });
  var qNumInt= parseInt(qNum);
  var filteredResults = js_resultJSON.filter(function(item){

    return item.surName === SurName;
  });
  var filteredSurveyQuestionArray = js_questionJSON.filter(function(item){

    return item.surName === SurName;
  });
  var filteredQuestion = filteredSurveyQuestionArray.filter(function(item){

    return item.qNum === qNumInt;
  });


  var resultData=[];
  filteredResults.forEach(function (item)
    {
      var itemResponses=item.surResults;
      var seperatedResponses=itemResponses.split(',');
      var qNumIntMinus=qNumInt-1;
      resultData.push(seperatedResponses[qNumIntMinus]);
    }
  );
  resultData.sort();
  var counts={};
  var possibleResponses=filteredQuestion[0].qChoices.split(',');
  for (var i = 0; i < possibleResponses.length; i++) {
   var resp=person.possibleResponses[i];
   counts[resp]=0;
  };
  for (var i = 0; i < resultData.length; i++) {
    var resp = resultData[i];
  counts[resp] = counts[resp] ? counts[resp] + 1 : 1;
  };

  if(resultChart!=null)
  {
       resultChart.destroy();
  }
  resultChart=new Chart(ctx,{
    type: 'pie',
    data: Object.values(counts),
    labels: possibleResponses
  });


}

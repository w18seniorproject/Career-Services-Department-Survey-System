
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
  var qNumInt= parseInt(qNum);



}

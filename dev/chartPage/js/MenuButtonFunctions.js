
window.onload = function(){


  var topRelMenuButton=document.getElementById("curRelLevelButton");
  var topAnsMenuButton=document.getElementById('answersMenuButton');
    $.ajax({

      type: "POST",
      url: 'include/dev/backend/getQuestions.php',
      dataType: 'json',
      success: function(json){
        js_questionJSON=json;
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
        js_resultJSON=json;
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
  topAnsMenuButton.onclick=surveyButtonFiller(js_questionJSON,js_resultJSON);



}

function relationsButton(){

  var x=document.getElementById("surveyButtons");
  if(x.style.display=="none"){
    x.style.display="block";
  }else {
    x.style.display="none";
  }
}

function surveyButtonFiller(){
var js_dataJSON;
  $.ajax({

    type: "POST",
    url: 'include/dev/chartPage/php/surveyMenuFiller.php',
    dataType: 'json',
    success: function(json){
      js_dataJSON=json;
    },
  });
  var sMI=document.getElementById("surveyMenuItems");
  sMI.innerHTML="";
  for(var i=0; i<js_dataJSON.length; i++)
  {
      sMI.innerHTML+="<button class=\"dropdown-item\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\">"+js_dataJSON[i].SurName+"(user="+js_dataJSON[i].AcctName")</button>";

  }
  var x=document.getElementById("AnswerDropdown");
  if(x.style.display=="none"){
    x.style.display="block";
  }else {
    x.style.display="none";
  }


}

function answersButtonFiller(surveyName)
{
  var qNumJSON;
  jQuery.ajax({
    type: "POST",
    url: 'include/questionNumCallup.php',
    data: {functionname:'questionMenuFiller',arguments: surveyName},
    success: function(json){
      qNumJSON=json;
    });

    var sMI=document.getElementById("questionMenuItems");
    sMI.innerHTML="";
    for(i in js_dataJSON)
    {

        sMI.innerHTML+="<button class=\"dropdown-item\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\">"+js_dataJSON[i].qNum+"</button>";

    }

  }
  )

}

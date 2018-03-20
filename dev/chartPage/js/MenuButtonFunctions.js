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
    url: 'include/surveyMenuItems.php',
    dataType: 'json',
    success: function(json){
      js_dataJSON=json;
    }

  });
  var sMI=document.getElementById("surveyMenuItems");
  sMI.innerHTML="";
  for(i in js_dataJSON)
  {

      sMI.innerHTML+="<button class=\"dropdown-item\" type=\"button\" data-toggle=\"button\" aria-pressed=\"false\">"+js_dataJSON[i].SurName+"(user="+js_dataJSON[i].acctName")</button>";

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
  jQuery.ajax({
    type: "POST",
    url: ''
  }
  )

}

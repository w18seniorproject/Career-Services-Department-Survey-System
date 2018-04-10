function showCreateSurvey(){
    $("#rContainer").html("");
    $("#rContainer").load("embed.pSurvey.html");
}

function showManageSurvey(pin){
    $("#rContainer").html("");
    $("#rContainer").load("embed.manageSurvey.html", function(){
        showPinsAndGroups(pin);
        showResources();
    });
}

function showSurveys(){
    $.ajax({
        url: "../index.php",
        type: "POST",
        data: ({pdd: "true", aType: "POLL"}),
        success: function(response){
            if(response == "NONE"){
                $("#lContainer").html("<h3 class='greyed-out'>No Surveys</h3>");
            }
            else{
                $("#lContainer").html(constructSurveyListHTML(response));
            }
        },
        error: function(xhr, status, error){
            alert("Error: " + error);
        }
    })
}

function constructSurveyListHTML(surveyJSON){
    var html = "<ul class='surveyList'>";
    var surArr = JSON.parse(surveyJSON);
    for(var i = 0; i < surArr.length; i++){
        var survey = surArr[i];
        html += "<li><h3>" + survey.surName + "</h3></li>";
    }
    html += "</ul>";
    return html;
}
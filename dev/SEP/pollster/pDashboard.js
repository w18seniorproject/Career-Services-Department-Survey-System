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
                $(".manage").each(function(i, ele){
                    $(ele).unbind("click");
                    $(ele).on("click", function(){displayManageSurvey(ele)});
                });
                $(".edit").each(function(i, ele){
                    $(ele).unbind("click");
                    $(ele).on("click", function(){displayEditSurvey(ele)});
                });
                $(".survey-left").each(function(i, ele){
                    $(ele).unbind("click");
                    $(ele).on("click", function(){displayResults(ele)});
                })
            }
        },
        error: function(xhr, status, error){
            alert("Error: " + error);
        }
    })
}

function displayResults(ele){
    //TODO grab database stuff and display results
    alert("results");
}

function displayEditSurvey(ele){
    //TODO show editsurvey page and prefill from db
    alert("edit Survey");
}

function displayManageSurvey(ele){
    alert("Manage Survey");
}

function constructSurveyListHTML(surveyJSON){
    var html = "<ul class='surveyList'>";
    var surArr = JSON.parse(surveyJSON);
    for(var i = 0; i < surArr.length; i++){
        var survey = surArr[i];
        var liveIndicatorClass = "live";
        var liveIndicator = "live";
        if(survey.live == "0"){
            liveIndicatorClass = "not-live";
            liveIndicator = "not live";
        }
        html +="<li surName='" + survey.surName + "' live='" + survey.live + "' surText='" + survey.surText + "' pin='" + survey.pin + "'>\
                    <div class='survey-left'>\
                        <h4>" + survey.surName + "</h4>\
                    </div>\
                    <div class='survey-middle'>\
                        <span class='" + liveIndicatorClass + "'>" + liveIndicator + "</span>\
                    </div>\
                    <div class='survey-right'>\
                        <a class='manage shadow'>Manage</a>\
                        <a class='edit shadow'>Edit</a>\
                    </div>\
                </li>";
    }
    html += "</ul>";
    return html;
}
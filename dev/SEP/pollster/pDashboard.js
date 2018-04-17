function showCreateSurvey(){
    $("#rContainer").html("");
    $("#rContainer").load("embed.pSurvey.html");
}

function showManageSurvey(surName, surText){
    $("#rContainer").html("");
    $("#rContainer").load("embed.manageSurvey.html", function(){
        showPinsAndGroupsFilled(surName, surText);
        showResourcesFilled(surName);
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
                    $(ele).on("click", function(){displayManageSurvey(ele)});
                });
                $(".edit").each(function(i, ele){
                    $(ele).on("click", function(){displayEditSurvey(ele)});
                });
                $(".survey-left").each(function(i, ele){
                    $(ele).on("click", function(){displayResults(ele)});
                });
                $(".survey-middle").each(function(i, ele){
                    $(ele).on("click", function(){displayResults(ele)});
                });
                $(".surveyListItem").each(function(i, ele){
                    $(ele).on("click", function(){showSelectedItem(ele)});
                })
            }
        },
        error: function(xhr, status, error){
            alert("Error: " + error);
        }
    })
}

function showSelectedItem(ele){
    $(".surveyListItem-selected").removeClass("surveyListItem-selected");
    $(ele).addClass("surveyListItem-selected");
}

function displayResults(ele){
    //TODO grab database stuff and display results
}

function displayEditSurvey(ele){
    //TODO show editsurvey page and prefill from db
}

function displayManageSurvey(ele){
    showManageSurvey($(ele).parent().parent().attr("surName"), $(ele).parent().parent().attr("surText"));
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
        var surveyName = survey.surName;
        if(surveyName.length > 20){
            surveyName = surveyName.substring(0, 17) + "...";
        }
        html +="<li class='surveyListItem' surName='" + survey.surName + "' live='" + survey.live + "' surText='" + survey.surText + "' pin='" + survey.pin + "'>\
                    <div class='survey-left' title='" + survey.surName + "'>\
                        " + surveyName+ "\
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

function makeItLookNice(){
    if($(window).width() < 760){
        $(".leftContent").css("visibility: hidden;");
        $(".rightContent").css("width: 100%");
    }
    else{
        $(".leftContent").css("visibility: visible;");
        if($(window).width()*0.3 < 400){
            $(".leftContent").width(400);
            $(".rightContent").width($(window).width() - 401);
        }
        else{
            $(".leftContent").width($(window).width()*0.3);
            $(".rightContent").width($(window).width()*0.7 - 1);
        }
    }
}
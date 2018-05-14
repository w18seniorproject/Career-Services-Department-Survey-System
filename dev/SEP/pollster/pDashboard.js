
var mobile = false;

function determineLayout(){
    if($(window).width() < 780){
        mobile = true;
    }
    else{
        mobile = false;
        $(window).on('resize', function(){
            handleResizeNotMobile();
        });
        $("body").css({"overflow":"hidden"});
    }
    layoutScreen();
    displaySurveys();
    if(!mobile){
        displayRightContent();
    }
}

function layoutScreen(){
    if(mobile){
        $("body").append(  "<div id='container' style='padding-top: 60px;'>\
                                <div id='contentHeader' style='height: 45px; padding: 5px !important;'>\
                                    <input type='button' id='surBtn' class='btn btn-primary btn-sm shadow' style='display: inline-block; margin: 0px; margin-right: 10px;' value='New Survey'>\
                                    <input type='button' id='acctBtn' class='btn btn-primary btn-sm shadow' style='display: inline-block; margin: 0px; margin-right: 10px;' value='My Account'>\
                                    <input type='button' id='welcomeBtn' class='btn btn-primary btn-sm shadow' style='float: right;' value='Welcome/Tutorial'>\
                                </div>\
                                <div id='contentContainer'></div>\
                            </div>");
    }
    else{
        $("body").append(  "<div class='dContainer'>\
                                <div class='leftContent'>\
                                    <div id='leftContentHeader' class='shadow'>\
                                        <input type='button' class='btn btn-primary btn-sm shadow' style='display: inline-block; margin: 0px; margin-right: 10px;' onclick='showCreateSurvey()' value='New Survey'>\
                                        <input type='button' class='btn btn-primary btn-sm shadow' style='display: inline-block; margin: 0px; margin-right: 10px;' onclick='showMyAccount()' value='My Account'>\
                                        <input type='button' class='btn btn-primary btn-sm shadow' style='float: right;' onclick='showWelcome()' value='Welcome/Tutorial'>\
                                    </div>\
                                    <div id='lContainer'></div>\
                                </div>\
                                <div class='rightContent'>\
                                    <div class='rContainer' id='rContainer'></div>\
                                </div>\
                            </div>");
    }
    $("#surBtn").click(function(){showCreateSurvey()});
    $("#acctBtn").click(function(){showMyAccount()});
    $("#welcomeBtn").click(function(){showWelcome()});
}

function handleResizeNotMobile(){
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

function displaySurveys(){
    $.ajax({
        url: "../index.php",
        type: "POST",
        data: ({pdd: "true", aType: "POLL"}),
        success: function(response){
            var container;
            if(mobile){
                container = $("#contentContainer");
            }
            else{
                container = $("#lContainer");
            }
            if(response.includes("NONE")){
                container.html("<div style='padding-top: 48%; text-align: center;'>\
                                    <h3 class='greyed-out'>No Surveys</h3>\
                                    <input type='button' onclick='showCreateSurvey()' value='Create New Survey' class='btn btn-secondary shadow'>\
                                </div>");
            }
            else{
                container.html(constructSurveyListHTML(response));
                $(".manage").each(function(i, ele){
                    $(ele).on("click", function(){showManageSurvey($(ele).parent().parent().attr("surName"))});
                });
                $(".edit").each(function(i, ele){
                    $(ele).on("click", function(){showEditSurvey($(ele).parent().parent().attr("surName"))});
                });
                $(".survey-left").each(function(i, ele){
                    $(ele).on("click", function(){showResults($(ele).parent().attr("surName"))});
                });
                $(".survey-middle").each(function(i, ele){
                    $(ele).on("click", function(){showResults($(ele).parent().attr("surName"))});
                });
                $(".surveyListItem").each(function(i, ele){
                    $(ele).on("click", function(){showSelectedItem(ele)});
                })
            }
        },
        error: function(jxqr, status, exception){
            alert("Failing at displaySurveys() ajax call in pDashboard.js: " + exception);
        }
    })
}

function constructSurveyListHTML(surveyJSON){
    var html = "<ul class='surveyList'>";
    //try-catch for error handling.
    try{
        var surArr = JSON.parse(surveyJSON);
    }
    catch(e){
        alert("Failing at constructSurveyListHTML() try/catch in pDashboard.js: " + e);
        $("#lContainer").html(  "<div style='padding-top: 48%; text-align: center;'>\
                                    <h3 class='greyed-out'>No Surveys</h3>\
                                    <input type='button' onclick='showCreateSurvey()' value='Create New Survey' class='btn btn-secondary shadow'>\
                                </div>");
    }
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

function displayRightContent(){
    var contentID = getUrlParameter("content");
    switch(contentID){
        case "welcome":
            showWelcome();
            break;
        case "create":
            showCreateSurvey();
            break;
        case "account":
            showMyAccount();
            break;
        case "manage":
            surName = getUrlParameter("surName");
            showManageSurvey(surName);
            break;
        case "results":
            surName = getUrlParameter("surName");
            showResults(surName);
            break;
        default:
            showWelcome();  
    }
}

function showSelectedItem(ele){
    $(".surveyListItem-selected").removeClass("surveyListItem-selected");
    $(ele).addClass("surveyListItem-selected");
}

function showCreateSurvey(){
    if(!mobile){
        $("#rContainer").html("");
        $("#rContainer").load("embed.pSurvey.html?new=true");
    }
    else{
        $("#contentContainer").html("");
        $("#contentContainer").load("embed.pSurvey.html?new=true");
    }
}

function showMyAccount(){
    if(!mobile){
        $("#rContainer").html("");
        $("#rContainer").load("embed.account.html");
    }
    else{
        $("#contentContainer").html("");
        $("#contentContainer").load("embed.account.html");
    }
}

function showWelcome(){
    if(!mobile){
        $("#rContainer").html("<h1>Tutorial and Welcome Stuff will go here</h1>");
    }
    else{
        $("#contentContainer").html("<h1>Tutorial and Welcome Stuff will go here</h1>");
    }
}

function showManageSurvey(surName){
    if(!mobile){
        $("#rContainer").html("");
        $("#rContainer").load("embed.manageSurvey.html", function(){
            showPinsAndGroupsFilled(surName);
            showResourcesFilled(surName);
        });
    }
    else{
        $("#contentContainer").html("");
        $("#contentContainer").load("embed.manageSurvey.html", function(){
            showPinsAndGroupsFilled(surName);
            showResourcesFilled(surName);
        });
    }
}

function showEditSurvey(surName){
    if(!mobile){
        $("#rContainer").html("");
        $("#rContainer").load("embed.pSurvey.html", function(){
            fillSurveyFields(surName);
        });
    }
    else{
        $("#contentContainer").html("");
        $("#contentContainer").load("embed.pSurvey.html", function(){
            fillSurveyFields(surName);
        });
    }
}

function showResults(surName){
    if(!mobile){
        $("#rContainer").html("");
        $("#rContainer").load("embed.results.html", function(){
            showData(surName);
        });
    }
    else{
        $("#contentContainer").html("");
        $("#contentContainer").load("embed.results.html", function(){
            showData(surName);
        });
    }
}

function logout(){
    $("#logoutForm").submit();   
}

function getNotifications(){
    $.ajax({
        url: "../index.php",
        type: "POST",
        cache: false,
        data: {aType: "POLL", getNotificationCount: true},
        success: function(response){
            if(response.trim() == "true"){
                $("#notification-bell").addClass("opaque");
            }
        },
        error: function(jxqr, status, exception){
            alert("Failure at getNotifications() ajax call in pDashboard.js: " + exception);
        }
    })
}

function openNotifications(){
    $("#notification-bell").removeClass("opaque");
    if(!mobile){
        $("#rContainer").html("");
        $("#rContainer").load("embed.notifications.html", function(){
            showNotifications();
        });
    }
    else{
        $("#contentContainer").html("");
        $("#contentContainer").load("embed.notifications.html", function(){
            showNotifications();
        });
    }
}
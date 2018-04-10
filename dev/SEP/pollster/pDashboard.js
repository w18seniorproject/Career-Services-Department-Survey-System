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
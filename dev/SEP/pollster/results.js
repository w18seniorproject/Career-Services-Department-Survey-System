var groups = array();
var resultsArr = array();
var rLevelArr = array();
var timeArr = array();

function showData(surveyName){
    $.ajax({
        type: "POST",
        cache: false,
        url: "../index.php",
        data: {aType: "POLL", getResults: "true", surName: surveyName},
        success: function(response){
            if(response.includes("THERE ARE NO RESULTS TO BE HAD")){
                $("#overallData").html("<div style='padding-top: 48%; text-align: center;'>\
                                            <h3 class='greyed-out'>No Results</h3>\
                                        </div>");
                $("#showChartsButton").remove();
                $("#exportDataButton").remove();
            }
            else{
                var result;
                var results = JSON.parse(response);
                for(var i = 0; i < results.length; i++){
                    result = JSON.parse(results[i]);
                    var groupName = result.groupName;
                    groups.push(groupName);
                    var qAnswers = parseQuestionData(result.surResults); //May not need this
                    resultsArr.push(qAnswers);
                    var time = result.time;
                    timeArr.push(time);
                }
                displayOverall();
            }
        },
        error: function(jxqr, status, exception){
            alert("Failing at showData() ajax call in results.js");
        }
    });
}

function parseQuestionData(questionsDelimited){ //May not need this
    var questions = array();
    
    return questions;
}

function displayOverall(){
    //TODO display overall view
    // display question view for all groups
}

function displayGroup(groupNum){
    //TODO display question view for particular group
}
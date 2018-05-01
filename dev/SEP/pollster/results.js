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
                //TODO work with response
            }
        },
        error: function(jxqr, status, exception){
            alert("Failing at showData() ajax call in results.js");
        }
    });
}

function parseQuestionData(questionJSON){
    var questions = array();
    //TODO get questions
    return questions;
}
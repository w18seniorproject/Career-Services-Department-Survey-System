
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
                    //TODO
                }
                displayOverall();
            }
        },
        error: function(jxqr, status, exception){
            alert("Failing at showData() ajax call in results.js");
        }
    });
}

function displayOverall(){
    //TODO display overall view
    // display question view for all groups
}

function displayGroup(groupNum){
    //TODO display question view for particular group
}
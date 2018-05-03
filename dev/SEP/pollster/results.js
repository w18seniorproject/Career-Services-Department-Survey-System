
var questions, secReqs, results, groupArr = Array();

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
                var data = JSON.parse(response);
                questions = JSON.parse(data[0]);
                secReqs = JSON.parse(data[1]);
                results = JSON.parse(data[2]);

                displayAllGroups();
            }
        },
        error: function(jxqr, status, exception){
            alert("Failing at showData() ajax call in results.js");
        }
    });
}

function displayAllGroups(){
    var timeSum=0, num=0, timeAvg, rSum=0, rAvg;
    for(; num < results.Length; num++){
        if(!groupArr.includes(results[num].groupName)){
            groupArr.push(results[num].groupName);
        }
        timeSum += results[num].time;
        rSum += results[num].rLevel;
    }
    rAvg = rSum/num;
    timeAvg = timeSum/num;
    $("#overallData").html(constructDashDataHTML(rAvg, timeAvg, num));
}

function displayGroup(groupNum){
    //TODO display question view for particular group
}

function constructDashDataHTML(rAvg, timeAvg, num){
    var toReturn = "<h4>TOTAL RESPONSES</h4><h3>" + num + "</h3>\
                    <h4>AVERAGE TIME</h4><h3>" + timeAvg + "</h3>\
                    <h4>AVERAGE RLEVEL</h4><h3>" + rAvg + "</h3>";

    return toReturn;
}
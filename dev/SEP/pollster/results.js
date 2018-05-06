
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
                displayGroupButtons();

            }
        },
        error: function(jxqr, status, exception){
            alert("Failing at showData() ajax call in results.js");
        }
    });
}

function displayAllGroups(){
    var timeSD, timeSum=0, num=0, timeAvg, rSum=0, rAvg, timeSumofSquares=0;
    for(; num < results.length; num++){
        if(!groupArr.includes(results[num].groupName)){
            groupArr.push(results[num].groupName);
        }
        timeSum += results[num].time;
        rSum += results[num].rLevel;
        timeSumofSquares += results[num].time*results[num].time;
    }
    timeVar = (num * timeSumofSquares - timeSum*timeSum)/(num*num);
    timeSD = Math.sqrt(timeVar);
    rAvg = rSum/num;
    timeAvg = timeSum/num;
    $("#overallData").html(constructDashDataHTML(rAvg, timeAvg, num, timeSD));
}

function displayGroupButtons(){
    for(var i = 0; i < groupArr.length; i++){
        var button = "<input value='" + groupArr[i] + "' type='button' style='display: inline-block; margin: 0px; margin-right: 10px;' class='btn btn-secondary btn-sm shadow gb' groupNum='" + (i+1) + "'>";
        $("#groupButtonBar").append(button);
    }
    var allGroupButton = "<input value='All Groups' type='button' style='display: inline-block; margin: 0px; margin-right: 10px; float: right;' class='btn btn-primary btn-sm shadow gb' groupNum='0'>";
    $("#groupButtonBar").append(allGroupButton);
    $(".gb").each(function(i, ele){
        $(ele).click(function(){
            displayGroup($(ele).attr("groupNum"));
            $(".gb").each(function(i, element){
                $(element).removeClass("btn-primary");
                $(element).addClass("btn-secondary");
            })
            $(ele).removeClass("btn-secondary");
            $(ele).addClass("btn-primary");
        });
    });
}

function displayGroup(groupNum){ // DOESN'T WORK YET!!!
    if(groupNum == 0){
        displayAllGroups();
        return;
    }
    var timeSD, timeSum=0, num=0, timeAvg, rSum=0, rAvg, timeSumofSquares=0;
    for(var i=0; i<results.length; i++){
        if(groupArr.indexOf(results[i].groupName)+1 === groupNum){
            num++;
            timeSum += results[i].time;
            rSum += results[num].rLevel;
            timeSumofSquares += results[num].time*results[num].time;    
        }
    }
    timeVar = (num * timeSumofSquares - timeSum*timeSum)/(num*num);
    timeSD = Math.sqrt(timeVar);
    rAvg = rSum/num;
    timeAvg = timeSum/num;
    $("#overallData").html(constructDashDataHTML(rAvg, timeAvg, num, timeSD));    
}

function constructDashDataHTML(rAvg, timeAvg, num, timeSD){
    var toReturn = "<h4>TOTAL RESPONSES</h4><h3>" + num + "</h3></br>\
                    <h4>TIME</h4><h3>Average: " + Math.round(timeAvg) + " Seconds</h3>\
                    <h3>Standard Deviation: " + Math.round(timeSD) + " Seconds</h3></br>\
                    <h4>AVERAGE RLEVEL</h4><h3>" + (rAvg + 1 )+ "</h3></br>";

    return toReturn;
}
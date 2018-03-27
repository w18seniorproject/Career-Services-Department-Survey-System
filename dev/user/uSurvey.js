var questions;
var checkboxArray = [];
var radioArray = [];
var curLevel = 1;
var rLevelArray = new Array(7).fill(0);

function showLanding(){
    // if From refresh
    if (performance.navigation.type == 1) {
        showQuestions();
    }
    // if From back button
    else if (performance.navigation.type == 2) {
        window.location = "uLogin.html";
    }
    // if First load
    else {
        $(document).ready(function(){
            $.ajax({
                url:'uSurvey.php',
                cache:false,
                success:function(data){
                    document.getElementById("msg").innerHTML = data;
                    document.getElementById("continue").onclick = function(){showQuestions();};
                }
            });
        });
    }
}

function getQuestionString(qNum, qText, rLevelClass){
    var toReturn = "<h3 class='question " + rLevelClass + "'>" + qNum + ") " + qText + "</h3>";
    return toReturn;
}

function getCheckboxString(qChoices, qText, rLevelClass, rLevel, qNum){
    var toReturn = "";
    var choiceArr = qChoices.split("~$#");
    choiceArr.forEach(element =>{
        toReturn += '<label class="question ' + rLevelClass + '">' + 
                    '<input type="checkbox" ' + 
                    'qNum="' + qNum +
                    '" level="' + rLevel + 
                    '" name="' + qText + 
                    '" value="' + element + '">' + 
                    element + '</label>';
    });
    return toReturn;
}

function getMultipleChoiceString(qChoices, qText, rLevelClass, rLevel, qNum){
    var toReturn = "";
    var choiceArr = qChoices.split("~$#");
    choiceArr.forEach(element =>{
        toReturn += '<label class="question ' + 
                    rLevelClass + 
                    '"><input type="radio" level="' + 
                    rLevel + 
                    '" name="' + qText + 
                    '" qNum="' + qNum +
                    '" value="' + element + '">' + 
                    element + '</label>';
    });
    return toReturn;
}

function getScaleString(qText, rLevelClass, rLevel, qNum){
    var toReturn =  '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="sta">Strongly Agree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="a">Agree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="sla">Slightly Agree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="sld">Slightly Disagree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="d">Disagree</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="std">Strongly Disagree</label>';
    return toReturn;
}

function getTrueFalseString(qText, rLevelClass, rLevel, qNum){
    var toReturn =  '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="t">True</label>' +
                    '<label class="question ' + rLevelClass + '"><input type="radio" qNum="' + qNum + '" level="' + rLevel + '" name="' + qText + '" value="f">False</label>';
    return toReturn;
}

function showQuestions(){
    var msg = document.getElementById("msg");
    msg.parentNode.removeChild(msg);
    var cont = document.getElementById("continue");
    cont.parentNode.removeChild(cont);
    $.ajax({
        url:'uSurvey.php',
        cache:false,
        success:function(data){
            questions = JSON.parse(data);
            var index = "I";
            var rLevelClass;
            for(i=0; i<Object.keys(questions).length; i++){
                var rLevel = questions[index]["rLevel"];
                rLevelArray[rLevel]++;
                // Setting up CSS for visible and invisible elements
                switch(rLevel){
                    case 1:
                        rLevelClass = "iiiiii";
                        break;
                    case 2:
                        rLevelClass = "iiiii";
                        break;
                    case 3:
                        rLevelClass = "iiii";
                        break;
                    case 4:
                        rLevelClass = "iii";
                        break;
                    case 5:
                        rLevelClass = "ii";
                        break;
                    case 6:
                        rLevelClass = "i";
                }
                var qText = questions[index]["qText"];
                var qNum = questions[index]["qNum"];
                $('#questions-wrapper').append(getQuestionString(qNum, qText, rLevelClass));
                var qType= questions[index]["qType"];
                var qChoices = questions[index]["qChoices"];
                var questionBody;
                switch(qType){
                    case "chk":
                        questionBody = getCheckboxString(qChoices, qText, rLevelClass, rLevel, qNum);
                        break;
                    case "mc":
                        questionBody = getMultipleChoiceString(qChoices, qText, rLevelClass, rLevel, qNum);
                        break;
                    case "s":
                        questionBody = getScaleString(qText, rLevelClass, rLevel, qNum);
                        break;
                    case "tf":
                        questionBody = getTrueFalseString(qText, rLevelClass, rLevel, qNum);
                        break;
                    default:
                        alert("Uh oh. Something went wrong");
                }
                index = index + "I";
                $('#questions-wrapper').append(questionBody);
            }
            $('#questions-wrapper').append("<input type='button' id='submit' value='Submit Survey' class='question btn btn-primary btn-survey " + rLevelClass + "'>");
            $('#questions-wrapper').append('<input type="button" value="Continue" id="continue" class="btn btn-survey">');
            if($('#submit').is(':visible')){
                $('#continue').css('display', 'none');
            }
            document.getElementById("submit").onclick = function(){checkAnswers();};
            document.getElementById("continue").onclick = function(){loadNext();};
            $('[type="checkbox"]').each(function(i, ele){
                $(ele).on("click", function(){
                    updateCheckboxes(ele);
                });
            });
            $('[type="radio"]').each(function(i, ele){
                $(ele).on("click", function(){
                    updateRadioButtons(ele);
                });
            });
        }
    });
}

function loadNext(){
    if(checkAnswers()){
        $('.question').each(function(i, ele){
            ele.className += "i";
        });
        if($('#submit').is(':visible')){
            $('#continue').css('display', 'none');
        }
        if($("#back").length > 0){
            $('#back').css('display', 'block');
        }
        else{
            $('#questions-wrapper').append('<input type="button" value="Back" id="back" class="btn btn-survey">');
            document.getElementById("back").onclick = function(){loadLast();};
        }
        var numOfQuestions = 0;
        for(i = 1; i <= curLevel; i++){
            numOfQuestions += rLevelArray[i];
        }
        if(checkboxArray.length + radioArray.length != numOfQuestions){
            document.getElementById('errorMessage').innerHTML = "Please answer all questions";
            return false;
        }
        document.getElementById('errorMessage').innerHTML = "";
        curLevel++;
    }
}

function loadLast(){
    $('.question').each(function(i, ele){
        ele.className = ele.className.slice(0, -1);
    });
    if(!$('#submit').is(':visible')){
        $('#continue').css('display', 'block');
    }
    if(!($(".iiiiiii").length > 0)){
        $('#back').css('display', 'none');
    }
    curLevel--;
    $(".question input").each(function(i, ele){
        if($(ele).attr("level") > curLevel){
            $(ele).prop("checked", false);
        }
    });
    for(i = 0; i < checkboxArray.length; i++){
        if(checkboxArray[i].rLevel > curLevel){
            checkboxArray.splice(i,1);
        }
    }
    for(i = 0; i < radioArray.length; i++){
        if(radioArray[i].rLevel > curLevel){
            radioArray.splice(i,1);
            i--;
        }
    }
    document.getElementById('errorMessage').innerHTML = "";
}

function checkForEmpty(){
    var numOfQuestions = 0;
    for(i = 1; i <= curLevel; i++){
        numOfQuestions += rLevelArray[i];
    }
    if(checkboxArray.length + radioArray.length != numOfQuestions){
        document.getElementById('errorMessage').innerHTML = "Please answer all questions";
        return false;
    }
    return true;
}

function submitSurvey(){
    var toSend = "";
    var qDelim = "::::";
    var qSepA = ";;;;";
    for(i=0; i<checkboxArray.length; i++){
        var qText = checkboxArray[i].name;
        var qNum = checkboxArray[i].qNum;
        var ansString = "";
        for(j=0; j < checkboxArray.length; j++){
            if(checkboxArray[j].name == qText){
                ansString += checkboxArray[j].value;
            }
        }
        toSend += qText + qSepA + ansString + qDelim;
    }
    for(i = 0; i < radioArray.length; i++){
        var qText = radioArray[i].name;
        var qNum = radioArray[i].qNum;
        var ans = radioArray[i].value;
        toSend += qText + qSepA + ans + qDelim;
    }
    toSend = toSend.slice(0, -4);
    post(toSend);
}

function post(toSend){
    var form = $('<form action="uSubmit.php" method="post">\
                <input type="hidden" name="results" value="' + toSend + '"/>\
                <input type="hidden" name="rLevel" value="' + curLevel + '"/>\
                </form>');
    $('body').append(form);
    $(form).submit();
}

function checkAnswers(){
    if(!checkForEmpty()){
        return;
    }
    checkRadios();
    checkCheckboxes();
    submitSurvey();
}

function checkCheckboxes(){
    for(i=0; i<checkboxArray.length; i++){
        var index = "";
        var qText = checkboxArray[i].name;
        var qNum = checkboxArray[i].qNum;
        var ansString = "";
        for(j=0; j < checkboxArray.length; j++){
            if(checkboxArray[j].name == qText){
                ansString += checkboxArray[j].value;
            }
        }
        for(j=0; j < qNum; j++){
            index += "I";
        }
        qAns = questions[index]["qAns"].split("~$#");
        ans = ansString.split("~$#");
        qAns.forEach(element => {
            if(!(ans.includes(element)) && questions[index]["qWeight"] == 2){
                submitSurvey();
            }
        });  
        ans.forEach(element =>{
            if(!(qAns.includes(element)) && questions[index]["qWeight"] == 2){
                submitSurvey();
            }
        });    
    }
}

function checkRadios(){
    for(i = 0; i < radioArray.length; i++){
        var index = "";
        var qText = radioArray[i].name;
        var qNum = radioArray[i].qNum;
        var ans = radioArray[i].value;
        for(j=0; j<qNum; j++){
            index += "I";
        }
        if(ans != questions[index]["qAns"] && questions[index]["qWeight"] == 2){
            submitSurvey();
        }
    }
}

function updateCheckboxes(sender){
    var exists = false;
    var sameName = false;
    var entry = {
        value: $(sender).attr("value"),
        name: $(sender).attr("name"),
        rLevel: $(sender).attr("level"),
        qNum: $(sender).attr("qNum")
    };
    for(i = 0; i < checkboxArray.length; i++){
        if(checkboxArray[i].value == entry.value && checkboxArray[i].name == entry.name){
            exists = true;
            checkboxArray.splice(i, 1);
        }
        else if(checkboxArray[i].name == entry.name){
            sameName = true;
            checkboxArray[i].value = checkboxArray[i].value + "~$#" + entry.value;
        }
    }
    if(!exists && !sameName){
        checkboxArray.push(entry);
    }
}

function updateRadioButtons(sender){
    var entry = {
        value: $(sender).attr("value"),
        name: $(sender).attr("name"),
        rLevel: $(sender).attr("level"),
        qNum: $(sender).attr("qNum")
    };
    for(i = 0; i < radioArray.length; i++){
        if(radioArray[i].name == entry.name){
            radioArray.splice(i, 1);
        }
    }
    radioArray.push(entry);
}
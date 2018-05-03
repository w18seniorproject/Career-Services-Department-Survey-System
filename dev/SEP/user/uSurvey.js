$(document).ready(setupPage);

var curSec;
var maxSec;
var secBound;
var secReqs;
var qWeights;
var questions

function setupPage(){
    $("#header").load("../header.html");
    
    curSec = 0;
    showSurText();
}

function getQuest(quest){
    var toReturn = '<h3 class="quest n' + quest.qNum + ' s'+ quest.rLevel + ' ' + quest.qType + '">' + quest.qNum +') ' + quest.qText + '</h3>';
    return toReturn;
}

function getCBAns(quest){
    var toReturn = "";
    var choiceArr = quest.qChoices.split("~$#");
    choiceArr.forEach(element =>{
        element = element.split("|`");
        toReturn += '<label class="quest s' + quest.rLevel + '">' + 
                    '<input class="ans CB n' + quest.qNum + ' s' + quest.rLevel + 
                    '" type="checkbox" ' +
                    '" name="' + quest.qNum + 
                    '" value="' + element + '">' + 
                    element[0] + '</label>';
    });
    return toReturn;
}

function getMCAns(quest){
    var toReturn = "";
    var choiceArr = quest.qChoices.split("~$#");
    choiceArr.forEach(element =>{
        element = element.split("|`");
        toReturn += '<label class="quest s' + quest.rLevel + '">' + 
                    '<input class="ans MC n' + quest.qNum + ' s' + quest.rLevel +
                    '" type="radio" ' +
                    '" name="' + quest.qNum + 
                    '" value="' + element + '">' + 
                    element[0] + '</label>';
    });
    return toReturn;
}

function getSCAns(quest){
    var toReturn =  '<label class="quest s'+ quest.rLevel + '"><input class="ans SC n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="sta">Strongly Agree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans SC n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' + quest.qNum + '" value="a">Agree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans SC n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="sla">Slightly Agree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans SC n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="sld">Slightly Disagree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans SC n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="d">Disagree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans SC n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="std">Strongly Disagree</label>';
    return toReturn;
}

function getTFAns(quest){
    var tVal = 0;
    var fVal = 0;
    if(quest.qAns === 't')
        tVal = 1;
    else if(quest.qAns === 'f')
        fVal = 1;
       
    var toReturn =  '<label class="quest s'+ quest.rLevel + '"><input class="ans TF n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="t '+ tVal + '">True</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans TF n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="f '+ fVal + '">False</label>';
    return toReturn;
}

function showSurText(){
    $.post("../index.php", { aType: 'TAKE' }, function(data){
        var survey = JSON.parse(data);
        questions = JSON.parse(survey[0]);
        secReqs = JSON.parse(survey[1]);
        var surText = survey[2];

        $("#questions-wrapper").html("<h4>" + surText + "</h4>");
        $('#questions-wrapper').append('<input type="button" value="Continue" id="continue" class="btn btn-survey">'); 
        $('#continue').click(showQuestions);

    }).fail(function(){
        $('#questions-wrapper').html("Error - Not logged into quiz. Please return to the login page and enter a pin.");
    });
}

function showQuestions(){
    if(questions.length > 0){
        $('#questions-wrapper').html("");
        
        $(window).on('beforeunload', function() {
            return "Do you really want to close?";
        });
        
        maxSec = 0;
        secBound = new Array();
        qWeights = new Array();
        
        for(var i = 0; i < questions.length; i++){
           $('#questions-wrapper').append(getQuest(questions[i]));
            switch(questions[i].qType){
                case 'mc':
                    $('#questions-wrapper').append(getMCAns(questions[i]));
                    break;
                case 'chk':
                    $('#questions-wrapper').append(getCBAns(questions[i]));
                    break;
                case 'tf':
                    $('#questions-wrapper').append(getTFAns(questions[i]));
                    break;
                case 's':
                    $('#questions-wrapper').append(getSCAns(questions[i]));
                    break;
                default:
                    break;                
            }
            if(questions[i].rLevel > maxSec)
            {    
                maxSec = questions[i].rLevel;
            }
            qWeights[i] = questions[i].qWeight;
            secBound[maxSec] = questions[i].qNum;
        }

        $('#questions-wrapper').append('<input type="button" value="Continue" id="continue" class="btn btn-survey">');   
        $('#questions-wrapper').append('<input type="button" value="Back" id="back" class="btn btn-survey">');

        $('#continue').click(loadNextSec);
        $('#back').click(loadLastSec);

        $('#back').css('display', 'none');

        loadNextSec(); 
    }
}

function loadNextSec(){
    $('#errorMessage').html("");
    if(curSec !== 0 && checkAns() !== true){
        $('#errorMessage').html("Please answer all questions");
        return;
    }
    
    if(curSec !== 0 && (curSec === maxSec || checkScore() !== true)){
        var questions = document.querySelectorAll('.quest');
        questions.forEach( (e) => {
                e.style.display = 'none';
        });
        
        $('#back').css('display', 'none');
        $('#continue').css('display', 'none');
        
        sendResults();
        return;
    }
    
    curSec = curSec + 1;
    
    var questions = document.querySelectorAll('.quest');
    questions.forEach( (e) => {
        if(e.classList.contains("s" + curSec))
            e.style.display = 'block';
        else
            e.style.display = 'none';
    });
    
    if(curSec !== 1)
        $('#back').css('display', 'block');
}

function loadLastSec(){
    $('#errorMessage').html("");
    if(curSec > 1){
        curSec = curSec - 1;
    }
    
    var questions = document.querySelectorAll('.quest');
    questions.forEach( (e) => {
        if(e.classList.contains("s" + curSec))
            e.style.display = 'block';
        else
            e.style.display = 'none';
    });
    
    if(curSec === 1)
        $('#back').css('display', 'none');   
}

function checkAns(){
    var answers;
    var firstQ, lastQ;
    
    if(curSec === 1)
        firstQ = 1;
    else
        firstQ = secBound[curSec - 1] + 1;
    
    lastQ = secBound[curSec];
    
    for(var curQ = firstQ; curQ <= lastQ; curQ++){
        answers = document.querySelectorAll('.ans.n' + curQ);
        var completed = false;
        for(var i = 0; i < answers.length; i++){
            if(answers[i].checked || answers[i].classList.contains('CB')){
                completed = true;
            }
        }
        if(completed !== true)
            return false;
    }  
    return true;
}

function checkScore(){
    var answers, lastQ;
    var score = 0;
    
    lastQ = secBound[curSec];
    
    for(var curQ = 1; curQ <= lastQ; curQ++){
        answers = document.querySelectorAll('.ans.n' + curQ);
        for(var i = 0; i < answers.length; i++){
            if(answers[i].checked){
                if(answers[i].classList.contains('MC') || answers[i].classList.contains('CB')){
                    score += parseInt(answers[i].value.split(',')[1]) * qWeights[curQ - 1];
                }
                else if(answers[i].classList.contains('TF')){
                    score += parseInt(answers[i].value.split(' ')[1]) * qWeights[curQ - 1];
                }
            }
        }    
    }
    if(score >= secReqs[curSec - 1].minScore)
        return true;
    else
        return false;
}

function getResults(){
    var answers;
    var results = Array();
    var lastQ = secBound[maxSec];
    
    for(var curQ = 1; curQ <= lastQ; curQ++){
        answers = document.querySelectorAll('.ans.n' + curQ);
        answers.forEach( (ans) => {
            if(ans.checked){
                var answer = {
                    qNum: curQ,
                    value: ans.value
                }
                results[curQ] = JSON.stringify(answer); 
            }
        });
    }
    return JSON.stringify(results);
}

function sendResults(){
    var results = getResults();
    $(window).unbind('beforeunload');
    $.ajax({
        url: '../index.php',
        type: 'post',
        data: {response : results, aType: 'TAKE'},
        success: function (data) {
            $("#survey-wrapper").html(" <form class='form-centered'>\
                                            <legend class='legend'>Thank You</legend>" +
                                            secReqs[curSec-1].resources +
                                            "</br>\
                                            <div id='comments'>\
                                                <textarea id='commentbox' placeholder='Comments, Questions, etc. (optional)' class='form-control'></textarea>\
                                            </br>\
                                                <input type='button' value='Submit Comment' id='submitComment' class='btn btn-primary btn-lg btn-block shadow'>\
                                            </div>\
                                        </form>");
            $("#submitComment").click(function(){
                submitComment();
            });
        },
        error: function (jqxr, status, exception){
            alert("Failing at sendResults() ajax call in uSurvey.js: " + exception);
        }
    });
}

function submitComment(){
    $.ajax({
        type: 'POST',
        url: '../index.php',
        cache: false,
        data: {comment: $("#commentbox").val(), aType: "TAKE"},
        success: function(data){
            $("#comments").html(data);
        },
        error: function(jqxr, status, exception){
            alert("Failing at submitComment() ajax call in uSurvey.js: " + exception);
        }
    });
}
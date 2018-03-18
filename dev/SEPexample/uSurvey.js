$(document).ready(setupPage);

var curSec;
var maxSec;
var sectBound;

function setupPage(){
    $("#header").load("../header.html");
    
    curSec = 0;
    showQuestions();
}

function getQuest(quest){
    var toReturn = '<h3 class="quest n' + quest.qNum + ' s'+ quest.rLevel + '">' + quest.qNum +') ' + quest.qText + '</h3>';
    return toReturn;
}

function getCBAns(quest){
    var toReturn = "";
    var choiceArr = quest.qChoices.split(",");
    choiceArr.forEach(element =>{
        toReturn += '<label class="quest s' + quest.rLevel + '">' + 
                    '<input class="ans n' + quest.qNum + ' s' + quest.rLevel + 
                    '" type="checkbox" ' +
                    '" name="' + quest.qNum + 
                    '" value="' + element + '">' + 
                    element + '</label>';
    });
    return toReturn;
}

function getMCAns(quest){
    var toReturn = "";
    var choiceArr = quest.qChoices.split(",");
    choiceArr.forEach(element =>{
        toReturn += '<label class="quest s' + quest.rLevel + '">' + 
                    '<input class="ans n' + quest.qNum + ' s' + quest.rLevel +
                    '" type="radio" ' +
                    '" name="' + quest.qNum + 
                    '" value="' + element + '">' + 
                    element + '</label>';
    });
    return toReturn;
}

function getSCAns(quest){
    var toReturn =  '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="sta">Strongly Agree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' + quest.qNum + '" value="a">Agree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="sla">Slightly Agree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="sld">Slightly Disagree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="d">Disagree</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="std">Strongly Disagree</label>';
    return toReturn;
}

function getTFAns(quest){
    var toReturn =  '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="t">True</label>' +
                    '<label class="quest s'+ quest.rLevel + '"><input class="ans n' + quest.qNum + ' s' + quest.rLevel + '" type="radio" name="' +quest.qNum + '" value="f">False</label>';
    return toReturn;
}

function showQuestions(){
    $.post("index.php", function(data){
        var questions = JSON.parse(data);
        if(questions.length > 0){
            $('#questions-wrapper').html("");
            
            $(window).on('beforeunload', function() {
                return "Do you really want to close?";
            });
            
            maxSec = 0;
            sectBound = new Array();

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
                sectBound[maxSec] = questions[i].qNum;
            }

            $("#maxSection").val(maxSec);

            $('#questions-wrapper').append("<input type='submit' id='submit' value='Submit Survey' class='question btn btn-primary btn-survey'>");
            $('#questions-wrapper').append('<input type="button" value="Continue" id="continue" class="btn btn-survey">');   
            $('#questions-wrapper').append('<input type="button" value="Back" id="back" class="btn btn-survey">');

            $('#continue').click(loadNextSec);
            $('#back').click(loadLastSec);
            $('#submit').click(sendResults);

            if(maxSec == 1){
                $('#continue').css('display', 'none');
                $('#submit').css('display', 'block');
            }
            else{
                $('#continue').css('display', 'block');
                $('#submit').css('display', 'none');
            }

            $('#back').css('display', 'none');

            loadNextSec(); 
        }
    }).fail(function(){
        $('#questions-wrapper').html("Error - Not logged into quiz. Please return to the login page and enter a pin.");
    });
}

function loadNextSec(){
    $('#errorMessage').html("");
    if(checkAns() !== true && curSec !== 0){
        $('#errorMessage').html("Please answer all questions");
        return;
    }
        
    if(curSec < maxSec){
        curSec = curSec + 1;
        $("#curSection").val(curSec);
    }
    
    var questions = document.querySelectorAll('.quest');
    questions.forEach( (e) => {
        if(e.classList.contains("s" + curSec))
            e.style.display = 'block';
        else
            e.style.display = 'none';
    });
    
    if(curSec !== 1)
        $('#back').css('display', 'block');
    
    if(curSec === maxSec){
        $('#continue').css('display', 'none');
        $('#submit').css('display', 'block');
    }
}

function loadLastSec(){
    $('#errorMessage').html("");
    if(curSec > 1){
        curSec = curSec - 1;
        $("#curSection").val(curSec);
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
    
    if($('#submit').is(':visible')){
        $('#continue').css('display', 'block');
        $('#submit').css('display', 'none');
    }    
}

function checkAns(){
    var answers;
    var firstQ, lastQ;
    
    if(curSec === 1)
        firstQ = 1;
    else
        firstQ = sectBound[curSec - 1] + 1;
    
    lastQ = sectBound[curSec];
    
    for(var curQ = firstQ; curQ <= lastQ; curQ++){
        answers = document.querySelectorAll('.ans.n' + curQ);
        var completed = false;
        answers.forEach( (ans) => {
            if(ans.checked)
                completed = true; 
        });
        if(completed !== true)
            return false;
    }  
    return true;
}

function sendResults(){
    if(checkAns() !== true && curSec !== 0){
        $('#errorMessage').html("Please answer all questions");
        return;
    }else{
        $(window).unbind('beforeunload');        
        //TO-DO: Implement sending survey's results
        $.ajax({
            url: 'index.php',
            type: 'post',
            data: {
                response: 'XXXXXXXXXXXXXXXXXXX'
            },
            success: function (data) {
                //TO-DO: implement success function
                location.replace("index.php");
            }
        });
    }
}
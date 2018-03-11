$(document).ready(setupPage);

function setupPage(){
    $("#header").load("../header.html");
    $("#curSection").val('0');
    showQuestions();
}

function getQuest(quest){
    var toReturn = '<h3 class="quest n' + quest.qNum + ' s'+ quest.rLevel + '">' + quest.qNum +') ' + quest.qText + '</h3>';
    return toReturn;
}

function getCBAns(quest){
    var toReturn =  '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a1"><input type="checkbox" name="' +quest.qNum + '" value="' + quest.ansOne + '">' + quest.ansOne + '</label>' + 
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a2"><input type="checkbox" name="' +quest.qNum + '" value="' + quest.ansTwo + '">' + quest.ansTwo + '</label>';
    if(quest.ansThree !== null){
        toReturn += '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a3"><input type="checkbox" name="' +quest.qNum + '" value="' + quest.ansThree + '">' + quest.ansThree + '</label>';
    }
    if(quest.ansFour !== null){
        toReturn += '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a4"><input type="checkbox" name="' +quest.qNum + '" value="' + quest.ansFour + '">' + quest.ansFour + '</label>';
    }
    return toReturn;
}

function getMCAns(quest){
    var toReturn =  '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a1"><input type="radio" name="' + quest.qNum + '" value="' + quest.ansOne + '">' + quest.ansOne + '</label>' + 
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a2"><input type="radio" name="' + quest.qNum + '" value="' + quest.ansTwo + '">' + quest.ansTwo + '</label>';
    if(quest.ansThree !== null){
        toReturn += '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a3"><input type="radio" name="' + quest.qNum + '" value="' + quest.ansThree + '">' + quest.ansThree + '</label>';
    }
    if(quest.ansFour !== null){
        toReturn += '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a4"><input type="radio" name="' + quest.qNum + '" value="' + quest.ansFour + '">' + quest.ansFour + '</label>';
    }
    return toReturn;
}

function getSCAns(quest){
    var toReturn =  '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a1"><input type="radio" name="' +quest.qNum + '" value="sta">Strongly Agree</label>' +
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a2"><input type="radio" name="' + quest.qNum + '" value="a">Agree</label>' +
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a3"><input type="radio" name="' +quest.qNum + '" value="sla">Slightly Agree</label>' +
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a4"><input type="radio" name="' +quest.qNum + '" value="sld">Slightly Disagree</label>' +
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a5"><input type="radio" name="' +quest.qNum + '" value="d">Disagree</label>' +
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' a6"><input type="radio" name="' +quest.qNum + '" value="std">Strongly Disagree</label>';
    return toReturn;
}

function getTFAns(quest){
    var toReturn =  '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' aT"><input type="radio" name="' +quest.qNum + '" value="t">True</label>' +
                    '<label class="quest n'+ quest.qNum + ' s'+ quest.rLevel + ' aF"><input type="radio" name="' +quest.qNum + '" value="f">False</label>';
    return toReturn;
}

function showQuestions(){
    $.post("index.php", function(data){
        var questions = JSON.parse(data);
        var maxSec = 0;
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
                maxSec = questions[i].rLevel;
        }
        
        $("#maxSection").val(maxSec);
        $('#questions-wrapper').append("<input type='submit' id='submit' value='Submit Survey' class='question btn btn-primary btn-survey'>");
        $('#questions-wrapper').append('<input type="button" value="Continue" id="continue" class="btn btn-survey">');   
        $('#questions-wrapper').append('<input type="button" value="Back" id="back" class="btn btn-survey">');
        $('#continue').click(loadNextSec);
        $('#back').click(loadLastSec);
        
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
        
    });
}

function loadNextSec(){
    var curSec = parseInt($("#curSection").val());
    var maxSec = parseInt($("#maxSection").val());
    
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
    var curSec = parseInt($("#curSection").val());
    
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
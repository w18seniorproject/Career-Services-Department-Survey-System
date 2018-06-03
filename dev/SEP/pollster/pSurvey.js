// Contains all client functions for creating/editing a survey, including:
// adding and removing sections, questions, and choices
// Sending the survey to the backend for saving to the database
// getting and displaying an existing survey
// Editing an existing survey
// Sending an existing survey to the backend modified for saving

$(document).ready(setupPage);

var surName;

function addSection(){
    var sectionHTML = constructSectionHTML();
    $("#section-wrapper").append(sectionHTML);
    $('.btn-secondary').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addQuestion(ele);
        });
    });
    $('.sClose').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            closeSection($(ele).parent().parent().parent().parent());
        });
    });
    $('.sNum').each(function(i, ele){
        $(ele).html("Section "+(i+1)+":");
    });
}

function addQuestion(ele){
    var questionHTML = constructQuestionHTML();
    $(ele).parent().find('.sWrapper').append(questionHTML);
    $('.qLabel').each(function(i, ele){
        $(ele).html(i+1+")");
    });
    $('.qNum').each(function(i, ele){
        $(ele).val(i + 1);
    });
    $('.select').each(function(i,ele){
        $(ele).unbind('change');
        $(ele).on("change", function(){
            selectType(ele);
        });
    });
    $('.qClose').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            closeQuestion($(ele).parent().parent().parent());
        });
    });
}

function constructQuestionHTML(){
    var toReturn =  "<div class='qWrapper'>\
    <hr>\
    <table><tr>\
    <th><h3 class='qLabel'></h3></th>\
    <th><span class='close qClose'>&#10799</span></th>\
    </tr></table>\
    <input class='form-control input qText' placeholder='Enter Question Text' type='text'></br>\
    <input class='form-control qWeight' value='0' type='number' min='0'>\
    <input class='form-control qNum' type='hidden'>\
    </br>\
    <select class='form-control select'>\
    <option disabled='disabled' selected='selected'>Select a Question Type</option>\
    <option value='mc'>Multiple Choice (Select correct answer. If there isn't one, leave blank)</option>\
    <option value='chk'>Checkboxes (Select correct answers. If there are none, leave blank)</option>\
    <option value='tf'>True/False (Select correct answer. If there isn't one, leave blank)</option>\
    <option value='s'>Scale (Select correct answer. If there isn't one, leave blank)</option>\
    </select>\
    </br>\
    </div>";
    return toReturn;
}

function constructSectionHTML(){
    var toReturn =  "<div class='new-section'>" +
    "<div class='sWrapper'>" +
    "<table><tr>\
    <th><h2 class='sNum'></h2></th>\
    <th><span class='close sClose'>&#10799</span></th>\
    </tr></table>" +
    "<input class='form-control input secName' placeholder='Enter a Section Title' type='text'></br>" +
    "<input class='form-control minScore' value='0' type='number' min='0'>" +
    "</div>\
    </br>\
    <hr>\
    <input class='btn btn-block btn-secondary' type='button' value='Add Question'>" +
    "</div>";
    return toReturn;
}

function closeSection(element){
    var result = confirm("Are you sure you want to delete this Section?");
    if(result){
        $(element).parent().parent().remove();
        $('.qLabel').each(function(i, ele){
            $(ele).html(i+1+")");
        });
        $('.qNum').each(function(i, ele){
            $(ele).val(i + 1);
            console.log(i);
        });
        $('.sNum').each(function(i, ele){
            $(ele).html("Section "+(i+1)+":");
        });
    }
}

function closeQuestion(element){
    $(element).parent().parent().remove();
    $('.qLabel').each(function(i, ele){
        $(ele).html(i+1+")");
    });
}

function selectType(element){
    var type = $(element).prop("selectedIndex");
    var typeHTML = "";
    $(element).parent().find(".qTable").remove();
    typeHTML = constructTypeHTML();
    $(element).parent().append(typeHTML);
    addChoice($(element).parent().find(".qTable"), type);
}

function constructTypeHTML(){
    var toReturn = "<table class='qTable' id='t" + Math.random() + "'></table>";
    return toReturn;
}

function addChoice(element, type){
    var choiceHTML;
    if(type === 1){
        choiceHTML = constructRadioHTML(element);
    }
    else if(type === 2){
        choiceHTML = constructCheckboxHTML();
    }
    else if(type === 3){
        choiceHTML = constructTrueFalseHTML(element);
    }
    else{
        choiceHTML = constructScaleHTML(element);
    }
    $(element).append(choiceHTML);
    $('.add-choice').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addChoice($(ele).parent().parent().parent(), type);
        });
    });
    $('.remove-choice').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeChoice(ele);
        });
    });
    $("[type=radio]").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on('click', function(){
            if($(ele).attr('on') === 'true'){
                $(ele).attr('on', 'false');
                $(ele).prop('checked', false);
            }
            else{
                var name = $(ele).attr('name');
                $('[name="' + name + '"]').each(function(i, rbutton){
                    $(rbutton).attr('on', 'false');
                    $(ele).prop('checked', false);
                });
                $(ele).attr('on', 'true');
                $(ele).prop('checked', true);
            }
        });
    });
}

function removeChoice(ele){
    $(ele).parent().parent().remove();
}

function constructRadioHTML(tableAncestor){
    var identifier = $(tableAncestor).attr('id');
    var toReturn = "<tr>\
    <th class='center-th'><input class='ans' on='false' type='radio' name='r" + identifier + "'></th>\
    <th class='qCell center-th'><input class='form-control qChoice' placeholder='Enter Choice' type='text'></th>\
    <th class='qCell center-th'><input class='form-control qPoints' value='0' type='number' min='0'></th>\
    <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
    </tr>";
    return toReturn;
}

function constructCheckboxHTML(){
    var toReturn = "<tr>\
    <th class='center-th'><input class='ans' type='checkbox'></th>\
    <th class='qCell center-th'><input class='form-control qChoice' placeholder='Enter Choice' type='text'></th>\
    <th class='qCell center-th'><input class='form-control qPoints' value='0' type='number' min='0'></th>\
    <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
    </tr>";
    return toReturn;
}

function constructTrueFalseHTML(tableAncestor){
    var identifier = $(tableAncestor).attr('id');
    var toReturn = "<tr>\
    <th class='center-th'>\
    <input class='ans' on='false' value='t' type='radio' name='r" + identifier + "'><label>True</label>\
    </th>\
    <th class='center-th'>\
    <input class='ans' on='false' value='f' type='radio' name='r" + identifier + "'><label>False</label>\
    </th>\
    </tr>";
    return toReturn;
}

function constructScaleHTML(tableAncestor){
    $(tableAncestor).addClass('scaleTable');
    var identifier = $(tableAncestor).attr('id');
    var toReturn = "<tr>\
    <th>\
    <input class='ans' on='false' value='sta' type='radio' name='r" + identifier + "'><label>Strongly Agree</label>\
    <input class='form-control qPoints' value='0' type='number' min='0'>\
    </th>\
    </tr>\
    <tr>\
    <th>\
    <input class='ans' on='false' value='a' type='radio' name='r" + identifier + "'><label>Agree</label>\
    <input class='form-control qPoints' value='0' type='number' min='0'>\
    </th>\
    </tr>\
    <tr>\
    <th>\
    <input class='ans' on='false' value='sla' type='radio' name='r" + identifier + "'><label>Slightly Agree</label>\
    <input class='form-control qPoints' value='0' type='number' min='0'>\
    </th>\
    </tr>\\n\
    <tr>\
    <th>\
    <input class='ans' on='false' value='d' type='radio' name='r" + identifier + "'><label>Disagree</label>\
    <input class='form-control qPoints' value='0' type='number' min='0'>\
    </th>\
    </tr>\
    <tr>\
    <th>\
    <input class='ans' on='false' value='sld' type='radio' name='r" + identifier + "'><label>Slightly Disagree</label>\
    <input class='form-control qPoints' value='0' type='number' min='0'>\
    </th>\
    </tr>\
    <tr>\
    <th>\
    <input class='ans' on='false' value='std' type='radio' name='r" + identifier + "'><label>Strongly Disagree</label>\n\
    <input class='form-control qPoints' value='0' type='number' min='0'>\
    </th>\\n\
    </tr>";
    return toReturn;
}

function cancel(){
    var result = confirm("Are you sure? All changes will be lost.");
    if(result){
        window.location = "../pollster/pDashboard.html";
    }
}

function checkSections(){
    var sections = document.getElementsByClassName("sWrapper");
    if(sections.length < 1){
        return false;
    }
    return true;
}

function checkQuestions(){
    var value = true;
    $(".sWrapper").each(function(i, sWrapper){
        var questions = $(sWrapper).children().toArray();
        if(questions.length < 4){
            value = false;
        }
    });
    return value;
}

function checkChoices(){
    var value = true;
    $(".choiceQ").each(function(i, choiceQ){
        var choices = $(choiceQ).children().toArray();
        if(choices.length < 2){
            value = false;
        }
    });
    return value;
}

function submit(update){
    var title = $("#surTitle").val();
    surName = title;
    var exit = false;
    if(!checkSections()){
        alert("Please create at least one Section");
        return;
    }
    if(!checkQuestions()){
        alert("Please create at least one Question per Section");
        return;
    }
    if(!checkChoices()){
        alert("Please have at least two choices for every choice-based question");
        return;
    }
    if(!title){
        promptCompletion();
        return;
    }
    var survey = {
        "title": title,
        "sections":[]
    };
    $(".sWrapper").each(function(i,sWrapper){
        var secName = $(sWrapper).find(".input").val();
        var minScore = $(sWrapper).find(".minScore").val();
        if(!secName || !minScore){
            promptCompletion();
            exit = true;
            return;
        }
        survey.sections.push({
            "secNum": i + 1,
            "secName": secName,
            "minScore": minScore,
            "questions": []
        });
        $(sWrapper).find(".qWrapper").each(function(j, qWrapper){
            var qNum = $(qWrapper).find(".qNum").val();
            var qText = $(qWrapper).find(".input").val();
            var qType = $(qWrapper).find(".select").val();
            var qWeight = $(qWrapper).find(".qWeight").val();
            var qChoices = "";
            if(!qText || !qType || !qWeight){
                promptCompletion();
                exit = true;
                return;
            }
            survey.sections[i].questions[j] = {
                "num": qNum,
                "text": qText,
                "type": qType,
                "weight": qWeight
            };
            if(qType === "chk"){
                var correctAnswers = Array();
                $(qWrapper).find(".qTable").find("tr").each(function(k,tr){
                    if(exit){
                        return;
                    }
                    var choiceText = $(tr).find('.qCell').find(".qChoice").val();
                    var qPoints = $(tr).find('.qCell').find(".qPoints").val();
                    if(!choiceText || !qPoints){
                        promptCompletion();
                        exit = true;
                        return;
                    }
                    if($(tr).find("th").find(".ans").prop("checked")){
                        correctAnswers.push(choiceText);
                        survey.sections[i].questions[j].qAns = JSON.stringify(correctAnswers);
                    }
                    qChoices += (choiceText + "|`" + qPoints + "~$#");
                });
                
                if(!survey.sections[i].questions[j].qAns){
                    survey.sections[i].questions[j].qAns = null;
                }
                
                qChoices = qChoices.substring(0, qChoices.length - 3);
                survey.sections[i].questions[j].answers = qChoices;
                
                if(exit){
                    return;
                }
            }
            else if(qType == 'mc'){
                $(qWrapper).find(".qTable").find("tr").each(function(k,tr){
                    if(exit){
                        return;
                    }
                    var choiceText = $(tr).find('.qCell').find(".qChoice").val();
                    var qPoints = $(tr).find('.qCell').find(".qPoints").val();
                    if(!choiceText || !qPoints){
                        promptCompletion();
                        exit = true;
                        return;
                    }
                    if($(tr).find("th").find(".ans").prop("checked")){
                        survey.sections[i].questions[j].qAns = choiceText;
                    }
                    qChoices += (choiceText + "|`" + qPoints + "~$#");
                });
                
                if(!survey.sections[i].questions[j].qAns){
                    survey.sections[i].questions[j].qAns = null;
                }
                
                qChoices = qChoices.substring(0, qChoices.length - 3);
                survey.sections[i].questions[j].answers = qChoices;
                
                if(exit){
                    return;
                }
            }
            else if(qType === "tf"){
                var val = 'none';
                $(qWrapper).find(".qTable").find("tr").find("th").each(function(k,th){
                    var choiceChecked = $(th).find("input").attr("on");
                    if(choiceChecked === "true"){
                        val = $(th).find("input").attr('value');
                    }
                });
                survey.sections[i].questions[j].qAns = val;
            }
            else if(qType === "s"){
                var val = 'none';
                var scores = '';
                $(qWrapper).find(".qTable").find("tr").each(function(k,tr){
                    $(tr).find("th").each(function(l, th){
                        var choiceChecked = $(th).find("input").attr("on");
                        var qPoints = $(th).find(".qPoints").val();
                        if(choiceChecked === "true"){
                            val = $(th).find("input").attr('value');
                        }
                        scores += (" " + qPoints);
                    });
                });
                scores = scores.substring(1);
                survey.sections[i].questions[j].qAns = val;
                survey.sections[i].questions[j].answers = scores;
            }
        });
        if(exit){
            return;
        }
    });
    if(exit){
        return;
    }
    post(survey, update);
}

function promptCompletion(){
    alert("Please fill out all fields");
}

function post(toSend, update){
    var instruc = $("#surText").val();
    if(update){
        $.ajax({
            url: "../index.php",
            type: "POST",
            data: ({aType: "POLL", pReqType: "EDTSUR", dataArray: toSend, surText: instruc, update: true}),
               success: function(response){
                   window.location = "pDashboard.html?content=manage&surName=" + surName;      
               },
               error: function(jqxr, status, exception){
                   alert("Failing at post() ajax call 1 in pSurvey.js");
               }
        });
    }
    else{
        $.ajax({
            url: "../index.php",
            type: "POST",
            data: ({aType: "POLL", pReqType: "EDTSUR", dataArray: toSend, surText: instruc}),
               success: function(response){
                   window.location = "pDashboard.html?content=manage&surName=" + surName;      
               },
               error: function(jqxr, status, exception){
                   alert("Failing at post() ajax call 2 in pSurvey.js");
               }
        });
    }
}

function fillSurveyFields(surveyName){
    $(".legend").html("Edit Survey");
    $.ajax({
        type: 'POST',
        url: '../index.php',
        cache: false,
        data: {aType: "POLL", pReqType: "EDTSUR", editSurvey: true, surName: surveyName},
        success: function(data){
            var survey = JSON.parse(data);
            var questions = JSON.parse(survey[0]);
            var secReqs = JSON.parse(survey[1]);
            curSec = 0;
            
            $("#surTitle").val(surveyName);
            $("#surText").val(survey[2]);
            
            for(var i = 0; i < questions.length; i++){
                
                if(questions[i].rLevel > curSec){
                    addSection();
                    curSec = questions[i].rLevel;
                    $(".minScore")[curSec - 1].value = secReqs[curSec - 1].minScore;
                    $(".secName")[curSec - 1].value = questions[i].rName;
                }
                
                
                addQuestion($(".btn-secondary")[curSec - 1]);
                $(".qText")[i].value = questions[i].qText;
                $(".qWeight")[i].value = questions[i].qWeight;
                $(".select")[i].value = questions[i].qType;
                selectType($(".select")[i]);
                
                if(questions[i].qType === 'mc' || questions[i].qType === 'chk'){
                    var choiceArr = questions[i].qChoices.split("~$#");
                    
                    for(var j = 0; j < choiceArr.length; j++){
                        var choice = choiceArr[j].split("|`");
                        if(j > 0){
                            if(questions[i].qType === 'mc')
                                addChoice($(".qTable")[i], 1);
                            else
                                addChoice($(".qTable")[i], 2);
                        }
                        
                        if(questions[i].qType !== 'chk' && questions[i].qAns === choice[0])
                        {
                            $(".qTable").eq(i).children().find(".ans")[j].checked = true;
                        }
                        else if(questions[i].qType === 'chk' && questions[i].qAns.includes(choice[0]))
                        {
                            $(".qTable").eq(i).children().find(".ans")[j].checked = true;
                        }
                        
                        $(".qTable").eq(i).children().find(".qChoice")[j].value = choice[0];
                        $(".qTable").eq(i).children().find(".qPoints")[j].value = choice[1];
                    }
                }else if(questions[i].qType === 'tf'){
                    if(questions[i].qAns == 't')
                    {
                        $(".qTable").eq(i).children().find(".ans")[0].setAttribute("on", true);
                        $(".qTable").eq(i).children().find(".ans")[0].checked = true;
                    }
                    else if(questions[i].qAns == 'f')
                    {
                        $(".qTable").eq(i).children().find(".ans")[1].setAttribute("on", true);
                        $(".qTable").eq(i).children().find(".ans")[1].checked = true;
                    }
                }else if(questions[i].qType === 's'){
                    var points = questions[i].qChoices.split(" ");
                    $(".qTable").eq(i).children().find(".qPoints").each(function(k, qPoints){
                        qPoints.value = points[k];
                    });
                    $(".qTable").eq(i).children().find(".ans").each(function(k, ans){
                        if(questions[i].qAns === ans.value)
                            ans.checked = true;
                    });
                }
            }
            $("#save").prop('onclick',null).off('click');
            
            $('#save').click(function() {
                submit(true);
            }); 
        },
        error: function(jqxr, status, exception){
            alert("Failing at fillSurveyFields() ajax call in pSurvey.js: " + exception);
        }
    });
}

function setupPage() {
    $('#surTitle').on('input', function () {
        var c = this.selectionStart,
        r = /[^a-z0-9\-_\s]/gi,
        v = $(this).val();
        if (r.test(v)) {
            $(this).val(v.replace(r, ''));
            c--;
        }
        this.setSelectionRange(c, c);
    });
    $('#save').click(function () {
        submit(null);
    });
}
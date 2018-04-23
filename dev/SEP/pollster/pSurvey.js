
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
                        <input class='form-control input' placeholder='Enter Question Text' type='text'></br>\
                        <input class='form-control qWeight' placeholder='Enter Weight' type='number' min='0'>\
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
                            "<input class='form-control input' placeholder='Enter a Section Title' type='text'></br>" +
                            "<input class='form-control minScore' placeholder='Enter Minimum Section Score' type='number' min='0'>" +
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
                        <th class='qCell center-th'><input class='form-control qPoints' placeholder='Enter Points' type='number' min='0'></th>\
                        <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>";
    return toReturn;
}

function constructCheckboxHTML(){
    var toReturn = "<tr>\
                        <th class='center-th'><input class='ans' type='checkbox'></th>\
                        <th class='qCell center-th'><input class='form-control qChoice' placeholder='Enter Choice' type='text'></th>\
                        <th class='qCell center-th'><input class='form-control qPoints' placeholder='Enter Points' type='number' min='0'></th>\
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
                            <input class='ans' on='false' value='std' type='radio' name='r" + identifier + "'><label>Strongly Disagree</label>\
                        </th>\
                        <th>\
                            <input class='ans' on='false' value='sta' type='radio' name='r" + identifier + "'><label>Strongly Agree</label>\
                        </th>\
                    </tr>\
                    <tr>\
                        <th>\
                            <input class='ans' on='false' value='d' type='radio' name='r" + identifier + "'><label>Disagree</label>\
                        </th>\
                        <th>\
                            <input class='ans' on='false' value='a' type='radio' name='r" + identifier + "'><label>Agree</label>\
                        </th>\
                    </tr>\
                    <tr>\
                        <th>\
                            <input class='ans' on='false' value='sld' type='radio' name='r" + identifier + "'><label>Slightly Disagree</label>\
                        </th>\
                        <th>\
                            <input class='ans' on='false' value='sla' type='radio' name='r" + identifier + "'><label>Slightly Agree</label>\
                        </th>\
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
        if(questions.length < 3){
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

function submit(){
    var title = $("#surTitle").val();
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
            if(qType === "mc" || qType === "chk"){
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
                    if($(tr).find("th").find(".ans").prop("checked") && qType !== "chk"){
                        survey.sections[i].questions[j].qAns = k;
                    }
                    qChoices += (choiceText + "|`" + qPoints + "~$#");
                });
                
                if(!survey.sections[i].questions[j].qAns)
                    survey.sections[i].questions[j].qAns = null;
                
                qChoices = qChoices.substring(0, qChoices.length - 2);
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
            else{
                var val = 'none';
                $(qWrapper).find(".qTable").find("tr").each(function(k,tr){
                    $(tr).find("th").each(function(l, th){
                        var choiceChecked = $(th).find("input").attr("on");
                        if(choiceChecked === "true"){
                            val = $(th).find("input").attr('value');
                        }
                    });
                });
                survey.sections[i].questions[j].qAns = val;
            }
        });
        if(exit){
            return;
        }
    });
    if(exit){
        return;
    }
    post(survey);
}

function promptCompletion(){
    alert("Please fill out all fields");
}

function post(toSend){
    var instruc = $("#surText").val();
    $.ajax({
        url: "../index.php",
        type: "POST",
        data: ({dataArray: toSend, surText: instruc, aType: "POLL"}),
        success: function(response){
            window.location = "manageSurvey.html?pin=" + response;
        },
        error: function(jqxr, status, exception){
            alert("Failing at post() ajax call in pSurvey.js");
        }
    });
}


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
    $('.qNum').each(function(i, ele){
        $(ele).html(i+1+")");
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
                            <th><h3 class='qNum'></h3></th>\
                            <th><span class='close qClose'>&#10799</span></th>\
                        </tr></table>\
                        <input class='form-control input' placeholder='Enter Question Text' type='text'>\
                        </br>\
                        <select class='form-control select'>\
                            <option disabled='disabled' selected='selected'>Select a Question Type</option>\
                            <option value='mc'>Multiple Choice</option>\
                            <option value='chk'>Checkboxes</option>\
                            <option value='tf'>True/False</option>\
                            <option value='s'>Scale</option>\
                        </select>\
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
                            "<input class='form-control input' placeholder='Enter a Section Title' type='text'>" +
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
        $('.qNum').each(function(i, ele){
            $(ele).html(i+1+")");
        });
        $('.sNum').each(function(i, ele){
            $(ele).html("Section "+(i+1)+":");
        });
    }
}

function closeQuestion(element){
    $(element).parent().parent().remove();
    $('.qNum').each(function(i, ele){
        $(ele).html(i+1+")");
    });
}

function selectType(element){
    var type = $(element).prop("selectedIndex");
    var typeHTML;
    switch(type){
        case 1:
            $(element).parent().find(".qTable").remove();
            typeHTML = constructTypeHTML();
            break;
        case 2:
            $(element).parent().find(".qTable").remove();
            typeHTML = constructTypeHTML();
            break;
        default:
            typeHTML = "";
    }
    $(element).parent().append(typeHTML);
    addChoice($(element).parent().find(".qTable"));
}

function constructTypeHTML(){
    var toReturn = "<table class='qTable'></table>";
    return toReturn;
}

function addChoice(element){
    var choiceHTML = constructChoiceHTML();
    $(element).append(choiceHTML);
    $('.add-choice').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addChoice($(ele).parent().parent().parent());
        });
    });
    $('.remove-choice').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeChoice(ele);
        });
    });
}

function removeChoice(ele){
    $(ele).parent().parent().remove();
}

function constructChoiceHTML(){
    var toReturn = "<tr>\
                        <th class='qCell'><input class='form-control qChoice' placeholder='Enter Choice' type='text'></th>\
                        <th><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>";
    return toReturn;
}

function cancel(){
    var result = confirm("Are you sure? All changes will be lost.");
    if(result){
        window.location = "../pollster/pDashboard.html";
    }
}

function submit(){
    var title = $("#surTitle").val();
    var exit = false;
    if(!title){
        promptCompletion();
        return;
    }
    var data = [];
    $(".sWrapper").each(function(i,sWrapper){
        var secName = $(sWrapper).find(".input").val();
        if(!secName){
            promptCompletion();
            exit = true;
            return;
        }
        data[secName] = [];
        $(sWrapper).find(".qWrapper").each(function(j, qWrapper){
            var qText = $(qWrapper).find(".input").val();
            if(!qText){
                promptCompletion();
                exit = true;
                return;
            }
            var qType = $(qWrapper).find(".select").val();
            if(!qType){
                promptCompletion();
                exit = true;
                return;
            }
            if(qType == "mc" || qType == "chk"){
                data[secName][qType + "," + qText] = [];
                $(qWrapper).find(".qTable").find("tr").each(function(ii,tr){
                    if(exit){
                        return;
                    }
                    var choiceText = $(tr).find('.qCell').find(".qChoice").val();
                    if(!choiceText){
                        promptCompletion();
                        exit = true;
                        return;
                    }
                    data[secName][qType + "," + qText][choiceText] = ""; //TODO implement weighted questions
                });
                if(exit){
                    return;
                }
            }
            else{
                data[secName][qType + "," + qText] = ""; //TODO implement weighted questions
            }
        });
        if(exit){
            return;
        }
    });
    if(exit){
        return;
    }
    // Do something with data
}

function promptCompletion(){
    alert("Please fill out all fields");
}

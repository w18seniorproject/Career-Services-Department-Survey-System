var numOfSections=0;
var numOfQuestions=0;

function addSection(){
    numOfSections++;
    var id = "section" + numOfSections;
    var btnid = "qAdd" + numOfSections;
    var closeid = "close" + numOfSections;
    $("#section-wrapper").append("<div class='new-section' id='" + id + "'></div>");
    var sectionHTML = constructSectionHTML();
    $("#"+id).append(sectionHTML);
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
    numOfQuestions++;
    var toReturn =  "<div id='qWrapper" + numOfQuestions + "'>\
                        <table><tr>\
                            <th><h3 class='qNum'></h3></th>\
                            <th><span class='close qClose'>&#10799</span></th>\
                        </tr></table>\
                        <input class='form-control input' placeholder='Enter Question Text' type='text' name='question" + numOfQuestions + "'>\
                        </br>\
                        <select name='type" + numOfQuestions + "' class='form-control select'>\
                            <option disabled='disabled' selected='selected'>Select a Question Type</option>\
                            <option value='mc'>Multiple Choice</option>\
                            <option value='chk'>Checkboxes</option>\
                            <option value='tf'>True/False</option>\
                            <option value='s'>Scale</option>\
                        </select>\
                        <hr>\
                    </div>";
    return toReturn;
}

function constructSectionHTML(){
    var toReturn =  "<div class='sWrapper'>" +
                        "<table><tr>\
                            <th><h2 class='sNum'></h2></th>\
                            <th><span class='close sClose'>&#10799</span></th>\
                        </tr></table>" +
                        "<input class='form-control input' placeholder='Enter a Section Title' type='text' name='sectionTitle" + numOfSections + "'>" +
                        "<hr>\
                    </div>\
                    </br>\
                    <input id='qAdd" + numOfSections + "' class='btn btn-block btn-secondary' type='button' value='Add Question'>";
    return toReturn;
}

function closeSection(element){
    $(element).parent().parent().remove();
    $('.qNum').each(function(i, ele){
        $(ele).html(i+1+")");
    });
    $('.sNum').each(function(i, ele){
        $(ele).html("Section "+(i+1)+":");
    });
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
                        <th><input class='form-control qChoice' placeholder='Enter Choice' type='text'></th>\
                        <th><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>";
    return toReturn;
}


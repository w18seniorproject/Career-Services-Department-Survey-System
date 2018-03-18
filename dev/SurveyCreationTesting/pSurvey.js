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
    $('.close').each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            closeSection(ele);
        });
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
}

function constructQuestionHTML(){
    numOfQuestions++;
    var toReturn =  "<div id='qWrapper" + numOfQuestions + "'>\
                        <h3 class='qNum'></h3>\
                        <input class='form-control input' placeholder='Enter Question Text' type='text' name='question" + numOfQuestions + "'>\
                        </br>\
                        <select name='type" + numOfQuestions + "' class='form-control select'>\
                            <option disabled='disabled' selected='selected'>Select a Question Type</option>\
                            <option value='mc'>Multiple Choice</option>\
                            <option value='chk'>Checkboxes</option>\
                            <option value='tf'>True/False</option>\
                            <option value='s'>Scale</option>\
                        </select>\
                    </div>\
                    <hr>";
    return toReturn;
}

function constructSectionHTML(){
    var toReturn =  "<div class='sWrapper'>" +
                        "<span class='close' id='close" + numOfSections + "'>&#10799</span>" +
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
}

function selectType(ele){
    var type = $(ele).prop("selectedIndex");
    var typeHTML = "";
    switch(type){
        case 1:
            typeHTML = constructMCHTML();
            break;
        case 2:
            typeHTML = constructCHKHTML();
            break;
        case 3:
            typeHTML = constructTFHTML();
            break;
        case 4:
            typeHTMK = constructSHTML();
    }
    $(ele).parent().append(typeHTML);
}

function constructMCHTML(ele){
    var toReturn = "<table class='qTable'>\
                        <tr>\
                            <th><input class='form-control input' placeholder='Enter Choice' type='text'></th>\
                            <th><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                        </tr>\
                    </table>";
    return toReturn;
}

function constructCHKHTML(ele){
    alert("chk");
}

function constructSHTML(ele){
    alert("s");
}

function constructTFHTML(ele){
    alert('tf');
}
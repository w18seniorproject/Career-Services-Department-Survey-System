var numOfSections=0;
var numOfQuestions=0;

function addSection(){
    numOfSections++;
    var id = "section" + numOfSections;
    var btnid = "qAdd" + numOfSections;
    $("#section-wrapper").append("<div class='new-section' id='" + id + "'></div>");
    var questionHTML = constructSectionHTML();
    $("#"+id).append(questionHTML);
    document.getElementById(btnid).onclick = function(){addQuestion();};
}

function addQuestion(){
    var questionHTML = constructQuestionHTML();
    var id = "sWrapper" + numOfSections;
    $("#"+id).append(questionHTML);
}

function constructQuestionHTML(){
    numOfQuestions++;
    var toReturn =  "<div id='qWrapper" + numOfQuestions + "'>\
                        <h3>" + numOfQuestions + ")</h3>\
                        <select name='type" + numOfQuestions + "' class='form-control select' onchange='selectType(this.selectedIndex)'>\
                            <option disabled='disabled' selected='selected'>Please Select a Question Type</option>\
                            <option value='mc'>Multiple Choice</option>\
                            <option value='chk'>Checkboxes</option>\
                            <option value='tf'>True/False</option>\
                            <option value='s'>Scale</option>\
                        </select>\
                    </div>";
    return toReturn;
}

function constructSectionHTML(){
    var toReturn =  "<div id='sWrapper" + numOfSections + "'>" +
                        constructQuestionHTML() +
                    "</div>\
                    </br>\
                    <input id='qAdd" + numOfSections + "' class='btn btn-block btn-secondary' type='button' value='Add Question'>";
    return toReturn;
}

function selectType(type){
    //TODO
}

function constructTypeHTML(type){
    //TODO
}
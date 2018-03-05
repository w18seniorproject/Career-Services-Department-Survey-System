function getQuestionString(qNum, qText){
    var toReturn = "<h3>" + qNum + ") " + qText + "</h3>"
    return toReturn;
}

function getCheckboxString(ansOne, ansTwo, ansThree, ansFour, qNum){
    var toReturn =  '<input type="checkbox" name=' + qNum + '" value="' + ansOne + '">' + ansOne + '</br>' + 
                    '<input type="checkbox" name=' + qNum + '" value="' + ansTwo + '">' + ansTwo + '</br>';
    if(ansThree != null){
        toReturn += '<input type="checkbox" name=' + qNum + '" value="' + ansThree + '">' + ansThree + '</br>';
    }
    if(ansFour != null){
        toReturn += '<input type="checkbox" name=' + qNum + '" value="' + ansFour + '">' + ansFour + '</br>';
    }
    return toReturn;
}

function getMultipleChoiceString(ansOne, ansTwo, ansThree, ansFour, qNum){
    var toReturn =  '<input type="radio" name=' + qNum + '" value="' + ansOne + '">' + ansOne + '</br>' + 
                    '<input type="radio" name=' + qNum + '" value="' + ansTwo + '">' + ansTwo + '</br>';
    if(ansThree != null){
        toReturn += '<input type="radio" name=' + qNum + '" value="' + ansThree + '">' + ansThree + '</br>';
    }
    if(ansFour != null){
        toReturn += '<input type="radio" name=' + qNum + '" value="' + ansFour + '">' + ansFour + '</br>';
    }
    return toReturn;
}

function getScaleString(qNum){
    var toReturn =  '<input type="radio" name=' + qNum + '" value="sta">Strongly Agree</br>' +
                    '<input type="radio" name=' + qNum + '" value="a">Agree</br>' +
                    '<input type="radio" name=' + qNum + '" value="sla">Slightly Agree</br>' +
                    '<input type="radio" name=' + qNum + '" value="sld">Slightly Disagree</br>' +
                    '<input type="radio" name=' + qNum + '" value="d">Disagree</br>' +
                    '<input type="radio" name=' + qNum + '" value="std">Strongly Disagree</br>';
    return toReturn;
}

function getTrueFalseString(qNum){
    var toReturn =  '<input type="radio" name=' + qNum + '" value="true">True</br>' +
                    '<input type="radio" name=' + qNum + '" value="false">False</br>';
    return toReturn;
}

function showQuestions(){
    $(document).ready(function(){
        $.ajax({
            url:'uSurvey.php',
            cache:false,
            success:function(data){
                var questions = JSON.parse(data);
                var index = "I";
                for(i=0; i<Object.keys(questions).length; i++){
                    $('#questions-wrapper').append(getQuestionString(questions[index]["qNum"], questions[index]["qText"]));
                    var qNum = questions[index]["qNum"];
                    var qType= questions[index]["qType"];
                    var questionBody;
                    switch(qType){
                        case "chk":
                            questionBody = getCheckboxString(questions[index]["ansOne"], questions[index]["ansTwo"], questions[index]["ansThree"], questions[index]["ansFour"], qNum);
                            break;
                        case "mc":
                            questionBody = getMultipleChoiceString(questions[index]["ansOne"], questions[index]["ansTwo"], questions[index]["ansThree"], questions[index]["ansFour"], qNum);
                            break;
                        case "s":
                            questionBody = getScaleString(qNum);
                            break;
                        case "tf":
                            questionBody = getTrueFalseString(qNum);
                            break;
                        default:
                            alert("Uh oh. Something went wrong");
                    }
                    index = index + "I";
                    $('#questions-wrapper').append(questionBody);
                }
            }
        });
    });
}
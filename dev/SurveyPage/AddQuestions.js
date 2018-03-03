
$.get("dev\\backend\\getQuestions.php", function(data){
  var questions=jQuery.parseJSON(data);
})

var checkboxQuestion='
<div class="checkboxList">\
        <label class="firstchoice">\
          <input type="checkbox" class="choice1 choiceCheck" value="A">\
          </label>\
          <label id="secondchoice">\
            <input type="checkbox" class="choice2 choiceCheck" value="B">\
            </label>\
            <label id="thirdchoice">\
              <input type="checkbox" id="choice3" class="choice choiceCheck" value="C">\
              </label>\
              <label id="fourthchoice">\
                <input type="checkbox" class="choice4 choiceCheck" value="D">\
                </label>\
                </div>';


var radioButtonQuestion='<div class="radioQuestion">\
        <label class="firstchoice">\
          <input type="radio" class="choice1 choiceRadio" value="A">\
          </label><br/>\
          <label id="secondchoice">\
            <input type="radio" class="choice2 choiceRadio" value="B">\
            </label><br/>\
            <label id="thirdchoice">\
              <input type="radio"class="choice3 choiceRadio" value="C">\
              </label><br/>\
              <label id="fourthchoice">\
                <input type="radio" class="choice4 choiceRadio" value="D">\
                </label><br/>\
                </div>';

var level1Div=document.getElementById("rel1");
var level2Div=document.getElementById("rel2");
var level3Div=document.getElementById("rel3");
var level4Div=document.getElementById("rel4");
var level5Div=document.getElementById("rel5");
var level6Div=document.getElementById("rel6");
if("includes" in Array.prototype)
{
  if(!questions.includes("message:No questions."))
  {
    questions.forEach(function(currentQuestion)){
      const newQuestion=[];
      if(questions.qType==="checkbox")
      {
        question.push(
          <div class="question" id="question${currentQuestion.qNum}">
          <div class="questionText">${currentQuestion.qNum}<br/>${currentQuestion.qText}</div><br/>

          <div class="checkboxAnswers">
                <label class="firstchoice">
                  <input type="checkbox" name="question${currentQuestion.qNum}" class="choice1 choiceCheck" value="A">\
                  A :
                  ${currentQuestion.ansOne}

                  </label><br/>
                  <label id="secondchoice">
                    <input type="checkbox" name="question${currentQuestion.qNum}" class="choice2 choiceCheck" value="B">
                    B :
                    $(currentQuestion.ansTwo)
                    </label><br/>
                    <label id="thirdchoice">
                      <input type="checkbox" name="question${currentQuestion.qNum}" class="choice3 choiceCheck" value="C">
                      C :
                      $(currentQuestion.ansThree)
                      </label><br/>
                      <label id="fourthchoice">
                        <input type="checkbox" name="question${currentQuestion.qNum}" class="choice4 choiceCheck" value="D">
                        D :
                        $(currentQuestion.ansFour)
                        </label><br/>
                        </div><br/>
                      </div>);
      }
      else if(questions.qType==="radio")
      {
        question.push(
          <div class="question" id="question${currentQuestion.qNum}">
          <div class="questionText">${currentQuestion.qNum}<br/>${currentQuestion.qText}</div><br/>

          <div class="radioAnswers">
                <label class="firstchoice">
                  <input type="radio" name="question${currentQuestion.qNum}" class="choice1 choiceRadio" value="A">\
                  A :
                  ${currentQuestion.ansOne}

                  </label><br/>
                  <label id="secondchoice">
                    <input type="radio" name="question${currentQuestion.qNum}" class="choice2 choiceRadio" value="B">
                    B :
                    $(currentQuestion.ansTwo)
                    </label><br/>
                    <label id="thirdchoice">
                      <input type="radio" name="question${currentQuestion.qNum}" class="choice3 choiceRadio" value="C">
                      C :
                      $(currentQuestion.ansThree)
                      </label><br/>
                      <label id="fourthchoice">
                        <input type="radio" name="question${currentQuestion.qNum}" class="choice4 choiceRadio" value="D">
                        D :
                        $(currentQuestion.ansFour)
                        </label><br/>
                        </div><br/>
                      </div>);
      }

      switch (currentQuestion.rLevel) {
        case 1:
          level1Div.innerHTML+=newQuestion.join('');
          break;
        case 2:
          level2Div.innerHTML+=newQuestion.join('');
          break;
        case 3:
          level3Div.innerHTML+=newQuestion.join('');
          break;
        case 4:
          level4Div.innerHTML+=newQuestion.join('');
          break;
        case 5:
          level5Div.innerHTML+=newQuestion.join('');
          break;
        case 6:
          level6Div.innerHTML+=newQuestion.join('');
          break;
        default:

      }
    });
  }
}

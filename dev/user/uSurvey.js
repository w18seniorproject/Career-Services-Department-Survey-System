function showQuestions(){
    $(document).ready(function(){
        $.ajax({
            url:'uSurvey.php',
            cache:false,
            success:function(data){
                var questions = JSON.parse(data);
                var index = "I";
                for(i=0; i<Object.keys(questions).length; i++){
                    $('#questions-wrapper').append(questions[index]["qNum"]);
                    index = index + "I";
                }
            }
        });
    });
}
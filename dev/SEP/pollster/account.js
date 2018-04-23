function changepic(){
    $("#ppUpload").click();
}

function getPP(){
    $.ajax({
        url: "../index.php",
        cache: false,
        type: "GET",
        data: ({profpic: "yes"}),
        success: function(response){
            var ppLocation = response;
            $("#ppHolder").html("<img src='" + ppLocation + "' class='profilepic'>");
        },
        error: function(jqxr, status, exception){
            alert("Failing at getPP() ajax call in account.js: " + exception);
        }
    });
    $("#ppUpload").change(function(){
        var profPic = $("#ppUpload").prop('files')[0];
        var base64ImageContent = profPic.replace(image.replace(/^data:image\/(png|jpg);base64,/, ""));
        var toSend = new FormData();
        toSend.append('profPic', base64ImageContent);
        toSend.append('aType', "POLL");

        $.ajax({
            type: "POST",
            processData: false,
            contentType: false,
            data: toSend,
            url: "../index.php",
            success: function(response){
                var ppLocation = response;
                $("#ppHolder").html("<img src='" + ppLocation + "' class='profilepic'>");    
            },
            error: function(jqxr, status, exception){
                alert("Failing at profilePic upload ajax call in account.js: " + exception);
            }
        });
    });
}
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
            $("#ppHolder").html("<img id='profPic' src='" + ppLocation + "' class='profilepic'>");
        },
        error: function(jqxr, status, exception){
            alert("Failing at getPP() ajax call in account.js: " + exception);
        }
    });
    $("#ppUpload").change(function(){
        var profPic = document.getElementById("profPic");
        var base64ImageContent = getBase64Image(profPic);
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
                alert("response: " + response);
                $("#ppHolder").html("<img id='profPic' src='" + ppLocation + "' class='profilepic'>");    
            },
            error: function(jqxr, status, exception){
                alert("Failing at profilePic upload ajax call in account.js: " + exception);
            }
        });
    });
}
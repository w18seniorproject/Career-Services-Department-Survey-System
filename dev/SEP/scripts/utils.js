// miscellaneous reusable functions

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function numericHash() {
    var str = document.getElementById("password").value;
    alert(str.toString());
    var hash = 5381;
    if (str.length == 0) {
        return hash;
    }
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
    }
    alert(hash);
    document.getElementById("password").value = hash;
    document.getElementById("submitInput").submit();
    //return hash;
}

function checkLogin(){
    $.ajax({
        url: "../index.php",
        cache: false,
        type: "POST",
        data: ({aType: "POLL", pReqType: "LOGIN"}),
        success: function(response){
            if(response.includes("NOT LOGGED IN")){
                alert();
                window.location = "pLogin.html";
                return;
            }
        },
        error: function(jqxr, status, exception){
            alert("Failing at checkLogin() ajax call in utils.js: " + exception);
        }
    });
     
}
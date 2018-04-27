function submitComment(){
    $.ajax({
        type: 'POST',
        url: 'comments.php',
        cache: false,
        data: {comment: $("#commentbox").val()},
        success: function(data){
            $("#comments").html(data);
        }
    });
}

function showResources(){
    $.ajax({
        type: 'POST',
        url: 'resources.php',
        cache: false,
        data: {rLevel : getUrlParameter("rLevel")},
        success: function(data){
            $("#resources").html(data);
        }
    });
}
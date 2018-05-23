function showNotifications(){
    $.ajax({
        url: "../index.php",
        type: 'POST',
        cache: false,
        data: { aType:'POLL', getNotifications: 'true'},
        success: function(response){
            var data = JSON.parse(response);
            var notifications = data.notifications.split("~`#");
            var count = data.count;
            var isNew = false;
            for(var i = notifications.length-1; i >= 0; i--){
                if(notifications.length-i <= count){
                    isNew = true;
                }
                displayNotification(notifications[i], isNew);
                isNew = false;
            }
        },
        error: function(jqxr, status, exception){
            alert("Failure at showNotifications() ajax call in notifications.js: " + exception);
        }

    });
}

function displayNotification(notificationJSON, isNew){
    var notification = JSON.parse(notificationJSON);
    var headerString = "New " + notification.nType.toUpperCase() + " in \"" + notification.surName + "\"";
    var style = "normal";
    if(isNew){
        style = "bolder";
    }
    $("#notiContainer").append("<div class='notiDiv'><h3 style='font-weight: " + style + "'>" + headerString + "</h3></div>");
    $(".notiDiv").each(function(i, ele){
        $(ele).click(function(){
            window.location = "pDashboard.html?content=results&surName=" + encodeURIComponent(notification.surName);
        });
    });
}
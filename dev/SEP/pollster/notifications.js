function showNotifications(){
    $.ajax({
        url: "../index.php",
        type: 'POST',
        cache: false,
        data: { aType:'POLL', getNotifications: 'true'},
        success: function(response){
            var data = JSON.parse(response);
            var count = data[0].count;
            var notifications = data[0].notifications.split("~`#");
            for(var i = 0; i < notifications.length; i++){
                displayNotification(notifications[i]);
            }
        },
        error: function(jqxr, status, exception){
            alert("Failure at showNotifications() ajax call in notifications.js: " + exception);
        }

    });
}

function displayNotification(notificationJSON){
    //TODO parse json and show notification on screen
}
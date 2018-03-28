function showPinsAndGroups(){
    var pin = getUrlParameter("pin");
    var html =  "<table class='qTable' id='pinTable'>\
                    <tr>\
                        <th class='center-th'>Group Name</th>\
                        <th class='center-th'>PIN</th>\
                        <th class='center-th'>Generate New</th>\
                        <th class='center-th'>Add/Remove</th>\
                    </tr>\
                    <tr>\
                        <th class='center-th' style='padding-right: 10px'><input class='form-control qChoice' placeholder='Enter Group Name' value='General' type='text'></th>\
                        <th class='center-th pinHolder'>" + pin + "</th>\
                        <th class='center-th'><span class='refreshPin'>⟳</span></th>\
                        <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>\
                </table>";
    $("#pinsandgroups").append(html);
    $(".refreshPin").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function refreshPin(ele){
    $(ele).parent().parent().find(".pinHolder").html(Math.floor(Math.random()*(9999-1001)+1000));
    $(".refreshPin").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function addGroup(ele){
    $(ele).parent().parent().parent().append(constructGroupPinHTML());
    $(".refreshPin").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).unbind('click');
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function removeGroup(ele){
    $(ele).parent().parent().remove();
}

function constructGroupPinHTML(){
    var toReturn =  "<tr>\
                        <th class='center-th' style='padding-right: 10px'><input class='form-control qChoice' placeholder='Enter Group Name' type='text'></th>\
                        <th class='center-th pinHolder'>" + Math.floor(Math.random()*(9999-1000+1)+1000) + "</th>\
                        <th class='center-th'><span class='refreshPin'>⟳</span></th>\
                        <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>";
    return toReturn;
}

function showResources(){
    $.ajax({
        url: "manageSurvey.php",
        cache: false,
        success: function(data){
            for(var i = 1; i <= data; i++){
                $("#resources").append(constructResourceHTML(i));
            }
        }
    });
}

function constructResourceHTML(level){
    var toReturn =  "<h3>Section " + level + ":</h3>\
                    <textarea class='form-control' placeholder='End of Survey Resources/Links'></textarea>";
    return toReturn;
}

function save(){
    
}
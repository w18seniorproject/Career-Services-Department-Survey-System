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
                        <th class='center-th'><input class='form-control qChoice' placeholder='Enter Group Name' value='General' type='text'></th>\
                        <th class='center-th pinHolder'>" + pin + "</th>\
                        <th class='center-th'><span class='refreshPin'>⟳</span></th>\
                        <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>\
                </table>";
    $("#pinsandgroups").append(html);
    $(".refreshPin").each(function(i, ele){
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function refreshPin(ele){
    $(ele).parent().parent().find(".pinHolder").html(constructRefreshHTML());
    $(".refreshPin").each(function(i, ele){
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
        $(ele).on("click", function(){
            removeGroup(ele);
        });
    });
}

function constructRefreshHTML(){
    var toReturn = "<th class='center-th pinHolder'>" + Math.floor(Math.random()*(9999-1001)+1000) + "</th>";
    return toReturn;
}

function addGroup(ele){
    alert("addGroup");
    $(ele).parent().parent().parent().append(constructGroupPinHTML());
    $(".refreshPin").each(function(i, ele){
        $(ele).on('click', function(){
            refreshPin(ele);
        });
    });
    $(".add-choice").each(function(i, ele){
        $(ele).on("click", function(){
            addGroup(ele);
        });
    });
    $(".remove-choice").each(function(i, ele){
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
                        <th class='center-th'><input class='form-control qChoice' placeholder='Enter Group Name' type='text'></th>\
                        <th class='center-th pinHolder'>" + Math.floor(Math.random()*(9999-1000+1))+1000 + "</th>\
                        <th class='center-th'><span class='refreshPin'>⟳</span></th>\
                        <th class='center-th'><span class='add-choice'>+</span><span class='remove-choice'>&#10799</span></th>\
                    </tr>";
}
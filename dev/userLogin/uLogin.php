<!DOCTYPE html>
<html lang= en>
	<head>
		<meta charset="utf-8">		
		<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">
        <link href="../CSS/styles.css" rel="stylesheet" type="text/css">
        <script type="text/javascript" src="../scripts/utils.js"></script>
    </head>
    <body id="pLoginBody">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <div class= "container-fluid">
            <div id= "headerRow" class="row" >
                <img id= "headerEWU" src="https://assets.ewu.edu/assets/testing-hdr-bg.png" alt="https://assets.ewu.edu/assets/testing-hdr-bg.png" class="transparent"> 
            </div>
            <div id= "firstContent" class= "row"  >
                <div id= "secondContent" class= "col-md-6 col-md-offset-3">	
                    <br>
                    <div id="loginPanel" class="panel">	

                        <div class= "panel-heading">
                            <h1 style="text-align: center">
                                <b>Take the Survey</b>
                            </h1>
                        </div>
                        <div class= "panel-body">
                            <form action= "uAuth.php" method= "post">
                                <fieldset>
                                    <legend>Login:</legend>
                                    <p>
                                        Pin: <input type="password" placeholder= "Pin" name= "pin">
                                    </p>
                                    <br>
                                    <br>
                                    <input  id= "buttonSubmit" class= "btn btn-primary btn-block" type="submit" value= "Submit">
                                </fieldset>
                                <label id="errorMessage" style="color: red"></label>
                                <script type="text/javascript">
                                    var string = getUrlParameter("error");
                                    var message = "";
                                    if(string == "wrongPin"){
                                        message = "Wrong PIN. Please try again."
                                    }
                                    else if(string == "notUnique"){
                                        message = "devteam messed up. PINS aren't unique";
                                    }
                                    document.getElementById("errorMessage").innerText = message;
                                </script>
                            </form>
                            <br>
                            <br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>

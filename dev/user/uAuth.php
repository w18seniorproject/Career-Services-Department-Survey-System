<?php 
    //include db connection file
    include_once '../config/takerDB.php';
       
    // see ../config/database.php for how this works
    $database = new Database();

    // establishes connection
    $conn = $database->getConnection();
    
    //grabs pin from post data
    $pin = $_POST["pin"];
    
    //creates and executes query to get surveyname, groupname, and account from pins table
    $sql = "SELECT surName, acctName FROM pins WHERE pin= ?;";
    $result = $conn->prepare($sql);
    $result->execute(array($pin));

    $numOfRows = $result->rowCount();
    
    //sets values for next query
    if($numOfRows == 1){
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $surveyname = $row['surName'];
        $account = $row['acctName'];
    }
    else if($numOfRows > 1){
        header("Location: uLogin.html?error=notUnique");
        die("We messed up. Pins aren't unique");
        //THIS SHOULD NEVER HAPPEN
    }
    else{
        header("Location: uLogin.html?error=wrongPin");
    }
      
    //creates session for use in survey after destroying any old remnants
    session_start();
    session_destroy();
    session_start();
    $_SESSION["surName"] = $surveyname;
    $_SESSION["acctName"] = $account;
    
    header("Location: uSurvey.php");

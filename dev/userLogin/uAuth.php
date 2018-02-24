<?php 
    //include db connection file
    include_once '../config/database.php';

    sleep(1);
        
    // see ../config/database.php for how this works
    $database = new Database();

    // establishes connection
    $conn = $database->getConnection();
    
    //grabs pin from post data
    $pin = $_POST["pin"];
    
    //creates and executes query to get surveyname, groupname, and account from pins table
    $sql = "SELECT surveyname, account FROM pins WHERE pin='$pin';";
    $result = $conn->prepare($sql);
    $result->execute();

    $numOfRows = $result->rowCount();
    
    //sets values for next query
    if($numOfRows == 1){
        $row = $result->fetch(PDO::FETCH_ASSOC);
        $surveyname = $row['surveyname'];
        $account = $row['account'];
    }
    else if($numOfRows > 1){
        header("Location: login.php?error=notUnique");
        die("We messed up. Pins aren't unique");
        //THIS SHOULD NEVER HAPPEN
    }
    else{
        header("Location: login.php?error=wrongPin");
        die("Oops! Wrong PIN");
    }
      
    //creates and executes next query to get the questions 
    $sql = "SELECT * FROM questions WHERE account='$account' AND surveyname='$surveyname';";
    $result = $conn->prepare($sql);
    $result->execute();

    echo "Success";
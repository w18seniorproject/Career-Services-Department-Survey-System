<?php 
    //include db connection file
    include_once '/config/database.php';
    //mitigates brute-force by limiting requests to one per second
    $cur_time = time();
    $timer_file = fopen("time.txt", "w+")
    or die("Could not open time.txt");

    $last_time = fgets($timer_file);
    if($cur_time == $last_time){
        fclose($timer_file);
        header("login.php?error=tooFast");
        die("You're doing that too much. Try again.");
    }
    fwrite($timer_file, time());
    fclose($timer_file);
    
    $database = new Database();
    //establishes connection
    //Note here: getConnection uses PDO rather than mysql_connect (generally preferable)
    //I believe the syntax for use is the same ie. query()/prepare() etc. but there may
    //need to be some changes made to account for this. (Remove this comment when no longer needed)
    $conn = $database->getConnection();
    
    //grabs pin from post data
    $pin = $_POST["pin"];
    
    //creates and executes query to get surveyname, groupname, and account from pins table
    $sql = "SELECT surveyname, groupname, account FROM pins WHERE pin='$pin';";
    $query = $conn->prepare($sql);
    $result = $conn->query($query);
    
    //sets values for next query
    if($result->num_rows == 1){
        $row = $result->fetch_assoc();
        $surveyname = $row["surveyname"];
        $account = $row["account"];
        $groupname = $row["groupname"];
    }
    else if($result->num_rows > 1){
        die("We messed up. Pins aren't unique");
        //THIS SHOULD NEVER HAPPEN
    }
    else{
        header("login.php?error=wrongPin");
        die("Oops! Wrong PIN");
    }
    
    //creates and executes next query to get the questions
    $sql = "SELECT * FROM questions WHERE account='$account' AND surveyname='$surveyname';";
    $query = $conn->prepare($sql);
    $result = $conn->query($query);
    
    //sends info to front-end
    echo '<script type="text/javascript">', 
        'displayQuestions(' . $result . ')',
        '</script>';
    

    
        

<?php 
    //mitigates brute-force by limiting requests to one per second
    $cur_time = time();
    $timer_file = fopen("time.txt", "w+");
    $last_time = fgets($timer_file);
    if($cur_time == $last_time){
        fclose($timer_file);
        die("You're doing that too much. Try again");
    }
    fwrite($timer_file, time());
    fclose($timer_file);
    
    //basic database connection variables
    $host = 'localhost';
    $db = 'csdss';
    $user = 'surveytaker';
    $pass = 'surveytaker';
        
    //establishes connection
    $conn = mysql_connect($host, $user, $pass, $db);
    if ($conn->connect_error){
        die('Error connecting to mysql: ' .mysql_error());
    }
    
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
    else{
        die("Oops! Couldn't find that PIN");
        //TODO Nice error message for the user
    }
    
    //creates and executes next query to get the questions
    $sql = "SELECT * FROM questions WHERE account='$account' AND surveyname='$surveyname';";
    $query = $conn->prepare($sql);
    $result = $conn->query($query);
    
    //sends info to front-end
    echo '<script type="text/javascript">', 
        'displayQuestions(' . $result . ')',
        '</script>';
    

    
        

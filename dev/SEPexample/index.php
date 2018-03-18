<?php
    $root = $_SERVER['DOCUMENT_ROOT'];
    include_once $root . '/Career-Services-Department-Survey-System/dev/config/database.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/pin.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/questions.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/response.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/takerLogin.php';
    
    //TO-DO: Possibly security before starting session
    session_start();
    $db = new Database();
    
    //TO-DO: Check if user is a pollster
    if(true){ 
        /* TAKER HANDLING */
        //get request handling, redirect to either the survey (if pin was already entered but not used) or taker login
        if($_SERVER['REQUEST_METHOD'] === 'GET'){
            if(isset($_SESSION['surName']) && isset($_SESSION['acctName'])){      
                header("Location: uSurvey.html");
                exit();
            }
            else{
                header("Location: uLogin.html");
                exit();
            }
        }
        //post request handling, see inner comments for details
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            //check if taker is entering a pin; if so, set survey variables
            if(isset($_POST['pin'])){
                TakerLogin::login($db);
            }
            //check if taker is posting a response to a survey; if so, send
            //results and unset session variables
            elseif(isset($_POST['response']) && isset($_SESSION['surName']) && isset($_SESSION['acctName']) && isset($_SESSION['groupName'])){
                Response::sendResponse($db, $_POST['response'], 0);
            }
            //check if user has already entered a valid pin, gotten session variables; 
            //if so, return questions. 
            elseif(isset($_SESSION['surName']) && isset($_SESSION['acctName'])){ 
                questions::sendQuestions($db);
            }    
            //otherwise throw error code
            else{
                http_response_code(400);
                exit();
            }
        }
        //otherwise throw error code
        else{
            http_response_code(400);
            exit();
        }
    }
    //TO-DO: Implement pollster stuff
    else{
        http_response_code(400);
        exit();
    }
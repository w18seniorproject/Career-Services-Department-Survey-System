<?php
    //TO-DO: Possible security before starting session
    session_start();
        
    if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['aType'])){
        $root = $_SERVER['DOCUMENT_ROOT'];
        include_once $root . '/Career-Services-Department-Survey-System/dev/config/database.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pin.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pLogin.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pSignup.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/questions.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/response.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/secReqs.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/survey.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/tLogin.php';

        $db = new Database();

        if($_POST['aType'] === 'POLL'){
            /* POLLSTER HANDLING */
            if(isset($_POST['username']) && isset($_POST['pword'])){
                PollsterLogin::login($db);
                exit();
            }
            elseif(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['email'])){
                PollsterSignup::signup($db);
                exit();
            }
            elseif(isset($_SESSION['userName']) && isset($_POST['surText']) && isset($_POST['dataArray'])){
                Survey::createSurvey($db);
                exit();
            }
            elseif(isset($_SESSION['userName']) && isset($_POST['resources'])){
                Survey::SetGroupsAndResources($db);         
                exit("Success");
            }
            //otherwise throw error code
            else{
                http_response_code(400);
                exit();
            }
        }
        else if($_POST['aType'] === 'TAKE'){
            /* TAKER HANDLING */
            //check if taker is entering a pin; if so, set survey variables
            if(isset($_POST['pin'])){
                TakerLogin::login($db);
                exit();
            }
            //check if taker is posting a response to a survey; if so, send
            //results and unset session variables
            elseif(isset($_POST['response']) && isset($_SESSION['surName']) && isset($_SESSION['acctName'])){
                Response::sendResponse($db, $_POST['response'], 0);
                exit();
            }
            //check if user has already entered a valid pin, gotten session variables; 
            //if so, return questions. 
            elseif(isset($_SESSION['surName']) && isset($_SESSION['acctName'])){ 
                Survey::sendSurvey($db);
                exit();
            }    
            //otherwise throw error code
            else{
                http_response_code(400);
                exit();
            }
        } 
    }
    else if($_SERVER['REQUEST_METHOD'] === 'GET'){
        if(isset($_SESSION['surName']) && isset($_SESSION['acctName'])){      
            header("Location: user/uSurvey.html");
            exit();
        }
        elseif(isset($_SESSION['rLevel'])){
            $rLevel = $_SESSION['rLevel'];
            echo $rLevel;
            exit();
        }
        else{
            header("Location: user/uLogin.html");
            exit();
        }
    }
    //otherwise throw error code
    else{   
        http_response_code(400);
        exit();
    }
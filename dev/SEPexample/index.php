<?php
    $root = $_SERVER['DOCUMENT_ROOT'];
    include_once $root . '/Career-Services-Department-Survey-System/dev/config/database.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/pin.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/question.php';
    
    $db = new Database();
    
    if($_SERVER['REQUEST_METHOD'] == 'POST'){
        session_start();
        if(isset($_POST['pin'])){
            $conn = $db->getConnection('taker');
            $pin = new pin($conn);
            $survey = json_decode($pin->getPins($_POST['pin']), true);
            
            if(isset($survey['surName']) && isset($survey['acctName'])){
                $surveyname = $survey['surName'];
                $account = $survey['acctName'];
            }
            elseif(isset($survey['message'])){
                if($survey['message'] === 'notUni'){
                    header("Location: uLogin.html?error=notUnique");
                    exit("We messed up. Pins aren't unique");
                    //THIS SHOULD NEVER HAPPEN
                }elseif($survey['message'] === 'badPin'){
                    header("Location: uLogin.html?error=wrongPin");
                    exit();
                }
            }
            else{
                http_response_code(500);
                exit();
                //THIS SHOULD NEVER HAPPEN
            }
            
            session_destroy();
            session_start();
            $_SESSION["surName"] = $surveyname;
            $_SESSION["acctName"] = $account;

            header("Location: uSurvey.html");
            exit();
        }
        elseif(isset($_SESSION['surName']) && isset($_SESSION['acctName'])){      
            $conn = $db->getConnection('taker');
            $quest = new Question($conn);
            $_SESSION['questions'] = $quest->getQuestions($_SESSION['surName'], $_SESSION['acctName']);
            echo $_SESSION['questions'];
            exit();
        }
        else{
            http_response_code(400);
            exit();
        }
    }
    else{
        http_response_code(400);
        exit();
    }
<?php
    $root = $_SERVER['DOCUMENT_ROOT'];
    include_once $root . '/Career-Services-Department-Survey-System/dev/config/database.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/pin.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEPexample/question.php';
    
    session_start();
    $db = new Database();
    
    /*TO-DO: Check if user is a pollster*/
    if(true){ 
        //get request handling, redirect to either the survey (if pin was already entered but not used somehow) or taker login
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
                $conn = $db->getConnection('taker');
                $pin = new pin($conn);
                $survey = json_decode($pin->getPin($_POST['pin']), true);

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

                session_unset();
                $_SESSION["surName"] = $surveyname;
                $_SESSION["acctName"] = $account;

                header("Location: uSurvey.html");
                exit();
            }
            //check if taker is posting a response to a survey; if so, return user
            //to login page (TO-DO: send user to results page instead). 
            elseif(isset($_POST['response'])){
                header("Location: uLogin.html");
                exit();
            }
            //check if user has already entered a valid pin, gotten session variables; 
            //if so, return questions. Reset session variables so that only one survey 
            //can be entered per pin login. (We can change/discuss this, but I have
            //a few reasons for doing it this way)
            elseif(isset($_SESSION['surName']) && isset($_SESSION['acctName'])){ 
                $conn = $db->getConnection('taker');
                $quest = new Question($conn);
                $_SESSION['questions'] = $quest->getQuestions($_SESSION['surName'], $_SESSION['acctName']);
                echo $_SESSION['questions'];
                session_unset();
                exit();
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
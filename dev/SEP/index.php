<?php
    //Single entry point for the whole system. All .html files are directed here, and redirected appropriately.
    error_reporting(E_ALL);
    session_start();

    if(isset($_POST['pReqType'])){
        if(!isset($_SESSION['userName']) && $_POST['pReqType'] === 'DASH'){
            echo("NOT LOGGED IN");
            exit();
        }
    
        if($_POST['pReqType'] === "getLoginStatus"){
            if(isset($_SESSION['userName'])){
                echo "TRUE";
            }
            else{
                echo "FALSE";
            }
            exit();
        }
    }
    $root = $_SERVER['DOCUMENT_ROOT'];
    include_once $root . '/Career-Services-Department-Survey-System/dev/config/database.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/account.php';
    $db = new Database();

    if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['aType'])){
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/chartHelper.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/forgotPassword.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/manageSurvey.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pActivate.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pDashboard.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pLogin.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pSignup.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/passwordReset.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pin.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/questions.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/response.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/results.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/secReqs.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/survey.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/tLogin.php';

        if($_POST['aType'] === 'POLL'){
            /* POLLSTER HANDLING */
            
            //Login handling
            if($_POST['pReqType'] === 'LOGIN'){
                if(isset($_POST['username']) && isset($_POST['pword'])){
                    try{
                        PollsterLogin::login($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error with Pollster Login\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['logout'])){
                    try{
                        session_unset();
                        header("Location: ./pollster/pLogin.html");
                    } catch (Exception $e){
                        echo 'Error with Pollster Logout\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
            }
            //Account management handling
            elseif($_POST['pReqType'] === 'MNGACT'){
                if(isset($_POST['known_value'])){
                    try{
                        ForgotPassword::sendToken($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error with Forgot Password (sendToken)\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['newPassword']) && isset($_POST['confirmPassword']) && isset($_POST['token'])){
                    try{
                        PasswordReset::pReset($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error with Password Reset\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['email'])){
                    try{
                        PollsterSignup::signup($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error with Pollster Signup\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }   
                elseif(!isset($_POST['newPassword']) && isset($_POST['token'])){
                    try{
                        AccountActivate::pActivate($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error with Account Activation\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
            }
            //Pollster profile management handling
            elseif($_POST['pReqType'] === 'MNGPRO'){
                if(isset($_POST['profPic'])){
                    try{
                        PollsterAccount::SetProfilePic($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error setting profile pic\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['password']) && isset($_POST['email']) && isset($_POST['password-confirm'])){
                    try{
                        PollsterAccount::SetAccountInfo($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error setting account info\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
            }
            //Pollster Dashboard handling
            elseif($_POST['pReqType'] === 'DASH'){
                if(isset($_POST['getNotificationCount'])){
                    try{
                        PollsterDashboard::getNotificationCount($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting notifcation count\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['getNotifications'])){
                    try{
                        PollsterDashboard::getNotifications($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting notifications\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST["pdd"])){
                    try{
                        PollsterDashboard::GetSurveys($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting surveys\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
            }
            //Manage survey handling
            elseif($_POST['pReqType'] === 'MNGSUR'){
                if(isset($_POST['isLive'])){
                    try{
                        ManageSurvey::setLive($db);
                    exit();
                    } catch (Exception $e){
                        echo 'Error setting live/dead\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['getUniquePin'])){
                    try{
                        ManageSurvey::setNewGroupPin($db);
                    exit();
                    } catch (Exception $e){
                        echo 'Error setting new pin\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['resources']) && isset($_POST['pins']) && isset($_POST['groups'])){
                    try{
                        ManageSurvey::SetSurveyData($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error setting resources\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['manageSurveyEditResources']) && isset($_POST['surName'])){
                    try{
                        ManageSurvey::GetResources($db);
                    exit();
                    } catch (Exception $e){
                        echo 'Error getting resources\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['manageSurveyEditPins']) && isset($_POST['surName'])){
                    try{
                        ManageSurvey::GetPins($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting pins/groups\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['deleteSurvey'])){
                    try{
                        ManageSurvey::DeleteSurvey($db);
                    exit();
                    } catch (Exception $e){
                        echo 'Error deleting survey\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
            }
            //Edit survey handling
            elseif($_POST['pReqType'] === 'EDTSUR'){
                if(isset($_POST['editSurvey'])){
                    try{
                        $_SESSION['surName'] = $_POST['surName'];
                        $_SESSION['acctName'] = $_SESSION['userName'];
                        Survey::sendSurvey($db);
                        unset($_SESSION['acctName']);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting survey\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_SESSION['userName']) && isset($_POST['surText']) && isset($_POST['dataArray']) && isset($_POST['update'])){
                    if($_POST['update'] == true){
                        try{    
                            Survey::updateSurvey ($db);
                        } catch (Exception $e){
                            echo 'Error updating survey\nError: ',  $e->getMessage(), "\n";
                            exit();
                        }
                    }
                    else{
                        try{
                            Survey::createSurvey($db);
                        } catch (Exception $e){
                            echo 'Error creating survey\nError: ',  $e->getMessage(), "\n";
                            exit();
                        }
                    }
                    exit();
                }
            }
            //Results and Charts handling
            elseif($_POST['pReqType'] === 'RESULT'){            
                if(isset($_POST['getResults'])){
                    try{
                        $_SESSION['surName'] = $_POST['surName'];
                        $_SESSION['acctName'] = $_SESSION['userName']; //Setting this variable for code reuse. I'm reusing a "taker" function which needs 'acctName' to be set.
                        Results::GetResults($db);
                        unset($_SESSION['acctName']);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting results\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['getSurNames']))
                {
                    try{
                        Charts::GetSurNames($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting survey names\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                elseif(isset($_POST['getAvgResults']))
                {
                    try{
                        $_SESSION['surName'] = $_POST['surName'];
                        Charts::GetAvgResults($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting average results\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                else if(isset($_POST['getQuestions']))
                {
                    try{
                        $_SESSION['surName'] = $_POST['surName'];
                        $_SESSION['acctName'] = $_SESSION['userName'];
                        $questions = Charts::GetQuestionsFromDB($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting questions\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
                else if(isset($_POST['getChartResults']))
                {
                    try{
                        $_SESSION['surName'] = $_POST['surName'];
                        Charts::GetChartResults($db);
                        exit();
                    } catch (Exception $e){
                        echo 'Error getting chart results\nError: ',  $e->getMessage(), "\n";
                        exit();
                    }
                }
            }
            //otherwise throw error code Bad Request
            else{
                http_response_code(400);
                echo "Bad Request: Pollster";
                exit();
            }
        }
        else if($_POST['aType'] === 'TAKE'){
            /* TAKER HANDLING */
            //check if taker is entering a pin; if so, set survey variables
            if(isset($_POST['pin'])){
                try{
                    TakerLogin::login($db);
                    exit();
                } catch (Exception $e){
                    echo 'Error logging into survey\nError: ',  $e->getMessage(), "\n";
                    exit();
                }
            }
            //check if taker is posting a comment to survey
            elseif(isset($_POST['comment'])){
                try{
                    Survey::sendComment($db);
                    exit();
                } catch (Exception $e){
                    echo 'Error posting comment\nError: ',  $e->getMessage(), "\n";
                    exit();
                }
            }
            //check if taker is posting a response to a survey; if so, send
            //results and unset session variables
            elseif(isset($_POST['response']) && isset($_SESSION['surName']) && isset($_SESSION['acctName'])){
                try{
                    Response::sendResponse($db, $_POST['response'], 0);
                    exit();
                } catch (Exception $e){
                    echo 'Error posting response\nError: ',  $e->getMessage(), "\n";
                    exit();
                }
            }
            //check if user has already entered a valid pin, gotten session variables;
            //if so, return questions.
            elseif(isset($_SESSION['surName']) && isset($_SESSION['acctName']) && isset($_SESSION['startTime'])){
                try{
                    Survey::sendSurvey($db);
                    exit();
                } catch (Exception $e){
                    echo 'Error getting survey\nError: ',  $e->getMessage(), "\n";
                    exit();
                }
            }
            //otherwise throw error code Bad Request
            else{
                http_response_code(400);
                echo "Bad Request: Taker";
                exit();
            }
        }
    }
    else if($_SERVER['REQUEST_METHOD'] === 'GET'){
        if(isset($_GET['profpic'])){
            try{
                PollsterAccount::GetProfilePic($db);
                exit();
            } catch (Exception $e){
                echo 'Error getting profile pic\nError: ',  $e->getMessage(), "\n";
                exit();
            }
        }
        elseif(isset($_GET['accountInfo'])){
            try{
                PollsterAccount::GetAccountInfo($db);
            } catch (Exception $e){
                echo 'Error getting account info\nError: ',  $e->getMessage(), "\n";
                exit();
            }
        }
        elseif(isset($_SESSION['surName']) && isset($_SESSION['acctName'])){
            header("Location: user/uSurvey.html");
            exit();
        }
        else{
            header("Location: user/uLogin.html");
            exit();
        }
    }
    //otherwise throw error code Bad Request
    else{
        http_response_code(400);
        echo "Bad Request: Outside";
        exit();
    }
<?php
    //TO-DO: Possible security before starting session
    session_start();

    $root = $_SERVER['DOCUMENT_ROOT'];
    include_once $root . '/Career-Services-Department-Survey-System/dev/config/database.php';
    include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/account.php';
    $db = new Database();

    if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['aType'])){
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pin.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pLogin.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pSignup.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/questions.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/response.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/secReqs.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/survey.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/tLogin.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/manageSurvey.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pDashboard.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/forgotPassword.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/passwordReset.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/pActivate.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/results.php';
        include_once $root . '/Career-Services-Department-Survey-System/dev/SEP/pHp/chartHelper.php';


        if($_POST['aType'] === 'POLL'){
            /* POLLSTER HANDLING */
            if(isset($_POST['username']) && isset($_POST['pword'])){
                PollsterLogin::login($db);
                exit();
            }
            elseif(isset($_POST['getResults'])){
                $_SESSION['surName'] = $_POST['surName'];
                $_SESSION['acctName'] = $_SESSION['userName']; //Setting this variable for code reuse. I'm reusing a "taker" function which needs 'acctName' to be set.
                Results::GetResults($db);
                unset($_SESSION['acctName']);
                exit();
            }
            elseif(isset($_POST['getNotificationCount'])){
                PollsterDashboard::getNotificationCount($db);
                exit();
            }
            elseif(isset($_POST['isLive'])){
                ManageSurvey::setLive($db);
                exit();
            }
            elseif(isset($_POST['getNotifications'])){
                PollsterDashboard::getNotifications($db);
                exit();
            }
            elseif(isset($_POST['editSurvey'])){
                $_SESSION['surName'] = $_POST['surName'];
                $_SESSION['acctName'] = $_SESSION['userName'];
                Survey::sendSurvey($db);
                unset($_SESSION['acctName']);
                exit();
            }
            elseif(isset($_POST['known_value'])){
                ForgotPassword::sendToken($db);
                exit();
            }
            elseif(isset($_POST['logout'])){
                session_unset();
                header("Location: ./pollster/pLogin.html");
            }
            elseif(isset($_POST['newPassword']) && isset($_POST['confirmPassword']) && isset($_POST['token'])){
                PasswordReset::pReset($db);
                exit();
            }
            elseif(!isset($_POST['newPassword']) && isset($_POST['token'])){
                AccountActivate::pActivate($db);
                exit();
            }
            elseif(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['email'])){
                PollsterSignup::signup($db);
                exit();
            }
            elseif(isset($_POST["pdd"])){
                PollsterDashboard::GetSurveys($db);
                exit();
            }
            elseif(isset($_SESSION['userName']) && isset($_POST['surText']) && isset($_POST['dataArray']) && isset($_POST['update'])){
                if($_POST['update'] == true){
                    Survey::updateSurvey ($db);
                }
                else{
                    Survey::createSurvey($db);
                }
                exit();
            }
            elseif(isset($_POST['resources']) && isset($_POST['pins']) && isset($_POST['groups'])){
                ManageSurvey::SetSurveyData($db);
                exit();
            }
            elseif(isset($_POST['manageSurveyEditResources']) && isset($_POST['surName'])){
                ManageSurvey::GetResources($db);
                exit();
            }
            elseif(isset($_POST['manageSurveyEditPins']) && isset($_POST['surName'])){
                ManageSurvey::GetPins($db);
                exit();
            }
            elseif(isset($_POST['manageSurveyInitial'])){
                ManageSurvey::GetSectionNum($db);
                exit();
            }
            elseif(isset($_POST['deleteSurvey'])){
                ManageSurvey::DeleteSurvey($db);
                exit();
            }
            elseif(isset($_POST['profPic'])){
                PollsterAccount::SetProfilePic($db);
                exit();
            }
            elseif(isset($_POST['password']) && isset($_POST['email']) && isset($_POST['password-confirm'])){
                PollsterAccount::SetAccountInfo($db);
                exit();
            }

            elseif(isset($_POST['getSurNames']))
            {
              Charts::GetSurNames($db);
              exit();
            }
            elseif(isset($_POST['getAvgResults']))
            {
              $_SESSION['surName'] = $_POST['surName'];
              Charts::GetAvgResults($db);
              exit();
            }
            else if(isset($_POST['getQuestions']))
            {
              $_SESSION['surName'] = $_POST['surName'];
              $_SESSION['acctName'] = $_SESSION['userName'];
              $questions = Charts::GetQuestionsFromDB($db);
              exit();
            }
            else if(isset($_POST['getChartResults']))
            {
              $_SESSION['surName'] = $_POST['surName'];
              Charts::GetChartResults($db);
              exit();
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
                TakerLogin::login($db);
                exit();
            }
            //check if taker is posting a comment to survey
            elseif(isset($_POST['comment'])){
                Survey::sendComment($db);
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
            elseif(isset($_SESSION['surName']) && isset($_SESSION['acctName']) && isset($_SESSION['startTime'])){
                Survey::sendSurvey($db);
                exit();
            }
            //otherwise throw error code
            else{
                http_response_code(400);
                echo "Bad Request: Taker";
                exit();
            }
        }
    }
    else if($_SERVER['REQUEST_METHOD'] === 'GET'){
        if(isset($_GET['profpic'])){
            PollsterAccount::GetProfilePic($db);
            exit();
        }
        elseif(isset($_GET['accountInfo'])){
            PollsterAccount::GetAccountInfo($db);
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

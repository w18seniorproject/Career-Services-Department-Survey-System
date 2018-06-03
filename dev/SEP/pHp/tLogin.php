<?php
    // Provides surveyTaker login and verification
    class TakerLogin{
        public static function login($db){
            $survey = json_decode(Pin::getPin($db, $_POST['pin']), true);

            if(isset($survey['surName']) && isset($survey['acctName'])){
                $surveyName = $survey['surName'];
                $account = $survey['acctName'];
                $groupName = $survey['groupName'];
            }
            elseif(isset($survey['message'])){
                if($survey['message'] === 'notUni'){
                    header("Location: user/uLogin.html?error=notUnique");
                    return;
                    //THIS SHOULD NEVER HAPPEN
                }elseif($survey['message'] === 'badPin'){
                    header("Location: user/uLogin.html?error=wrongPin");
                    return;
                }
            }
            else{
                http_response_code(500);
                return;
                //THIS SHOULD NEVER HAPPEN
            }

            session_unset();
            $_SESSION["surName"] = $surveyName;
            $_SESSION["acctName"] = $account;
            $_SESSION["groupName"] = $groupName;
            $_SESSION['startTime'] = time();

            header("Location: user/uSurvey.html");
        }
    }
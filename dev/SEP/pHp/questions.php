<?php
    /** 
     * Questions Class: 
     *  Holds a static function that returns all questions for a given survey.
     **/
    class Questions{ 
        private $conn;
        private $table = "questions";

        private function __construct($conn){
            $this->conn = $conn;
        }
        
        //Static function that returns all questions for a given survey.
        public static function getQuestions($db){ 
            $quest = new Questions($db->getConnection('taker'));
            $questions = $quest->queryDB($_SESSION['surName'], $_SESSION['acctName']);
            return $questions;
        }
        
        //Helper function that querys the DB for questions based on survey and
        //user name and formats them into a JSON object.
        private function queryDB($surName, $acctName){
            $stmt = $this->buildQuery($surName, $acctName);

            $stmt->execute();

            $rNum = $stmt->rowCount();

            if($rNum>0){ 
                $questionsArr=array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){	
                    extract($row);

                    $question=array(
                        "surName" => $surName, 
                        "qNum" => $qNum,
                        "qType" => $qType,
                        "qText" => $qText,
                        "qChoices" => $qChoices,
                        "qAns" => $qAns,
                        "qWeight" => $qWeight,
                        "rLevel" => $rLevel,
                        "rName" => $rName
                    );
                    $questionsArr[] = $question;
                }
                return json_encode($questionsArr);	
            }	 
            else{
                return json_encode(array("message" => "No questions."));
            }
        }
        
        //Helper function that builds the query for queryDB
        private function buildQuery($surName, $acctName){
            $query = "SELECT * FROM " . $this->table;

            if(isset($surName) && isset($acctName)){
                $query = $query . " WHERE surName = ? AND acctName = ? ORDER BY qNum ASC"; 
                $stmt = $this->conn->prepare($query);

                $stmt->bindValue(1, $surName);
                $stmt->bindParam(2, $acctName);

                return $stmt;			
            }
            else{
                throw new Exception('Variable not set.');
            }
        }
    }
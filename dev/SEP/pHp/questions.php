<?php
    class Questions{ 
        private $conn;
        private $table = "questions";

        public function __construct($conn){
            $this->conn = $conn;
        }
        
        public static function getQuestions($db){ 
            $quest = new Questions($db->getConnection('taker'));
            $questions = $quest->queryDB($_SESSION['surName'], $_SESSION['acctName']);
            return $questions;
        }
        
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
<?php
    class Question{ 
        private $conn;
        private $table = "questions";

        public $surName;
        public $qNum;
        public $qType;
        public $qText;
        public $qChoices;
        public $qAns;
        public $qWeight;
        public $rLevel;
        public $rName;
        public $acctName;

        public function __construct($conn){
                $this->conn = $conn;
        }

        public function getQuestions($surName, $acctName){
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
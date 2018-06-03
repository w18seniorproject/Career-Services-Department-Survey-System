<?php
    /**
     * Section Requirements Class: 
     *  Holds a static function that returns the section requirments for a given
     *  survey. 
     **/
    class SecReqs {
        private $conn;
        private $table = "secReqs";

        private function __construct($conn){
            $this->conn = $conn;
        }
        
        //Public static function to return SecReqs
        public static function getReqs($db){ 
            $reqs = new SecReqs($db->getConnection('taker'));
            $secReqs = $reqs->queryDB($_SESSION['surName'], $_SESSION['acctName']);
            return $secReqs;
        }
        
        //Helper function that executes a DB query, returns results as JSON
        private function queryDB($surName, $acctName){
            $stmt = $this->buildQuery($surName, $acctName);

            $stmt->execute();

            $rNum = $stmt->rowCount();

            if($rNum>0){ 
                $secReqs=array();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){	
                    extract($row);

                    $req=array(
                        "rLevel" => $rLevel,
                        "minScore" => $minScore,
                        "resources" => $resources
                    );
                    $secReqs[] = $req;
                }
                return json_encode($secReqs);	
            }	 
            else{
                return json_encode(array("message" => "No questions."));
            }
        }
        
        //Helper function that builds the proper query for queryDB
        private function buildQuery($surName, $acctName){
            $query = "SELECT * FROM " . $this->table;

            if(isset($surName) && isset($acctName)){
                $query = $query . " WHERE surName = ? AND acctName = ? ORDER BY rLevel ASC"; 
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
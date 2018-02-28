<?php
	class Question{ 
		private $conn;
		private $table = "questions";
		
		public $surName;
		public $qNum;
		public $qType;
		public $qText;
		public $ansOne;
		public $ansTwo;
		public $ansThree;
		public $ansFour;
		public $qAns;
		public $qWeight;
		public $rLevel;
		public $rName;
		public $acctName;

		public function __construct($db){
			$this->conn = $db;
		}
		
		public function getQuestions($surName, $acctName){
			$stmt = $this->buildQuery($surName, $acctName);
		 
			$stmt->execute();
		 
			return $stmt;
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
?>
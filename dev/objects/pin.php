<?php
	class pin{ 
		private $conn;
		private $table = "pins";
		
		public $pin;
		public $surName;
		public $groupName;
		public $acctName;
		
		public function __construct($db){
			$this->conn = $db;
		}
		
		public function getPins($pin){
			$stmt = $this->buildQuery($pin);
		 
			$stmt->execute();
		 
			return $stmt;
		}
		
		private function buildQuery($pin){
			$query = "SELECT * FROM " . $this->table;
			
			if(isset($pin)){
				$query = $query . " WHERE pin = ?";	
				
				$stmt = $this->conn->prepare($query);
				
				$stmt->bindValue(1, $pin);
				
				return $stmt;			
			}
			else{
				throw new Exception('Variable not set.');
			}
		}
	}
?>
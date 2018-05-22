<?php
	class Result{ 
		private $conn;
		private $table = "results";
		
		public $recNum;
		public $surName;
		public $groupName;
		public $surResults;
		public $rLevel;
		
		public function __construct($db){
			$this->conn = $db;
		}
		
		public function getResults($surName, $groupName){
			$stmt = $this->buildQuery($surName, $groupName);
		 
			$stmt->execute();
		 
			return $stmt;
		}
		
		private function buildQuery($surName, $groupName){
			$query = "SELECT * FROM " . $this->table;
			
			if(isset($surName)){
				$query = $query . " WHERE surName = ?";	
				if(isset($groupName))
					$query = $query . " AND groupName = ?"; 	
				$query = $query . " ORDER BY qNum ASC"; 
				
				$stmt = $this->conn->prepare($query);
				
				$stmt->bindValue(1, $surName);
				if(isset($groupName))
					$stmt->bindValue(2, $groupName);
				
				return $stmt;			
			}
			else{
				throw new Exception('Variable not set.');
			}
		}
	}
?>
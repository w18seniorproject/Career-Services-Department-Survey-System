<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	 
	include_once '../config/takerDB.php';
	include_once '../objects/pin.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	
	if($_SERVER['REQUEST_METHOD'] == 'GET'){
		try{
			$pins = new pin($db);
	
			$stmt = $pins->getPins($_GET['pin']);

			$num = $stmt->rowCount();
			
			if($num > 0){ 
				$resultsArr=array();
			 
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){	
					extract($row);
			 
					$pin=array(
						"pin" => $pin,
						"surName" => $surName,
						"groupName" => $groupName,
						"acctName" => $acctName
					);
					$pinsArr[] = $pin;
				}
				echo json_encode($pinsArr);	
			}	 
			else{
				echo json_encode(array("message" => "No results."));
			}
		}
		catch(Exception $exc){
			http_response_code(400);
			echo "Error: " . $exc->getMessage();
			exit();
		}
		http_response_code(200);
	}
	else{
		http_response_code(400);
	}
?>
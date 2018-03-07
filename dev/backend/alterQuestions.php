<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	
	include_once '../config/pollsterDB.php';
	include_once '../objects/question.php';
	
	//TO-DO: Account verification/security, refactor to use views rather than questions table.
	$database = new Database();
	$db = $database->getConnection();
	
	switch($_SERVER['REQUEST_METHOD']){	
		case 'PUT':
			parse_str(file_get_contents('php://input'), $_PUT);
			
			if(isset($_PUT['surName']) && isset($_PUT['qNum']) && isset($_PUT['qType']) && isset($_PUT['qText']) && isset($_PUT['acctName'])){
				try{
					$update = "UPDATE questions SET qType = ?, qText = ?, ansOne = ?, ansTwo = ?, ansThree = ?, ansFour = ?, qAns = ?, qWeight = ?, rLevel = ?, rName = ? WHERE surName = ? AND qNum = ?";
					$stmt = $db->prepare($update);
					
					$stmt->bindValue(1, $_PUT['qType']);
					$stmt->bindValue(2, $_PUT['qText']);
					$stmt->bindValue(3, $_PUT['ansOne']);
					$stmt->bindValue(4, $_PUT['ansTwo']);
					$stmt->bindParam(5, $_PUT['ansThree']);
					$stmt->bindParam(6, $_PUT['ansFour']);
					$stmt->bindParam(7, $_PUT['qAns']);
					$stmt->bindParam(8, $_PUT['qWeight']);
					$stmt->bindParam(9, $_PUT['rLevel']);
					$stmt->bindParam(10, $_PUT['rName']);
					$stmt->bindParam(11, $_PUT['surName']);
					$stmt->bindParam(12, $_PUT['qNum']);
					
					$stmt->execute();
				}
				catch(PDOException $exc){
					http_response_code(500);
					echo "Error: " . $exc->getMessage();
					break;
				}
			}
			else{
				http_response_code(400);
				break;
			}
			http_response_code(204);
			break;
			
		case 'POST':	
			if(isset($_PUT['surName']) && isset($_PUT['qNum']) && isset($_PUT['qType']) && isset($_PUT['qText']) && isset($_PUT['acctName'])){
				try{
					$insert = "INSERT INTO questions (surName, qNum, qType, qText, ansOne, ansTwo, ansThree, ansFour, qAns, qWeight, rLevel, rName, acctName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
					$stmt = $db->prepare($insert);
					
					$stmt->bindParam(1, $_PUT['surName']);
					$stmt->bindParam(2, $_PUT['qNum']);
					$stmt->bindValue(3, $_PUT['qType']);
					$stmt->bindValue(4, $_PUT['qText']);
					$stmt->bindValue(5, $_PUT['ansOne']);
					$stmt->bindValue(6, $_PUT['ansTwo']);
					$stmt->bindParam(7, $_PUT['ansThree']);
					$stmt->bindParam(8, $_PUT['ansFour']);
					$stmt->bindParam(9, $_PUT['qAns']);
					$stmt->bindParam(10, $_PUT['qWeight']);
					$stmt->bindParam(11, $_PUT['rLevel']);
					$stmt->bindParam(12, $_PUT['rName']);

					$stmt->execute();
				}
				catch(PDOException $exc){
					http_response_code(500);
					echo "Error: " . $exc->getMessage();
					break;
				}
			}
			else{
				http_response_code(400);
				break;
			}
			
			http_response_code(204);	
			break;
			
		case 'DELETE':
			parse_str(file_get_contents('php://input'), $_DELETE);
			
			try{
				if(isset($_DELETE['surName']) && isset($_DELTE['qNum'])){
					$remove = "DELETE FROM questions WHERE surName = ? AND qNum = ?";
				}	
				else{
					http_response_code(400);
					break;
				}
				
				$stmt = $db->prepare($remove);
				
				$stmt->bindParam(1, $_DELETE['surName']);
				$stmt->bindValue(2, $_DELETE['qNum']);

				$stmt->execute();
			}
			catch(PDOException $exc){
				http_response_code(500);
				echo "Error: " . $exc->getMessage();
				break;
			}
			
			http_response_code(204);
			break;
			
		case 'OPTIONS':
			http_response_code(200);
			header("Allow: POST, PUT, DELETE");
			break;
	}	
	
?>
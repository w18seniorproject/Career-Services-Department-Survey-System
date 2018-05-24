<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	
	include_once '../config/pollsterDB.php';
	include_once '../objects/bannedAccount.php';
	
	//TO-DO: Account verification/security, refactor to use views rather than questions table.
	$database = new Database();
	$db = $database->getConnection();
	
	switch($_SERVER['REQUEST_METHOD']){	
		case 'PUT':
			parse_str(file_get_contents('php://input'), $_PUT);
			
			if(isset($_PUT['email']) && isset($_PUT['desc'])){
				try{
					$update = "UPDATE bans SET desc = ? WHERE email = ? ";
					$stmt = $db->prepare($update);
					
					$stmt->bindValue(1, $_PUT['desc']);
					$stmt->bindValue(2, $_PUT['email']);
					
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
			if(isset($_PUT['email']) && isset($_PUT['desc'])){
				try{
					$insert = "INSERT INTO bans (email, desc) VALUES (?, ?)";
					$stmt = $db->prepare($insert);
					
					$stmt->bindParam(1, $_PUT['email']);
					$stmt->bindParam(2, $_PUT['desc']);

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
				if(isset($_DELETE['email'])){
					$remove = "DELETE FROM questions WHERE email = ?";
				}	
				else{
					http_response_code(400);
					break;
				}
				
				$stmt = $db->prepare($remove);
				
				$stmt->bindParam(1, $_DELETE['email']);

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
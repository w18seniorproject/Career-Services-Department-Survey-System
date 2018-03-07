<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	
	include_once '../config/takerDB.php'; //this will need to be changed to point to the pollster db file.
	include_once '../objects/result.php';
	
	//TO-DO: Account verification/security, refactor to use views rather than results table.
	$database = new Database();
	$db = $database->getConnection();
	
	//Note: I didn't include any method of altering results or deleting specfic responses. Only deleting an entire
	//survey's results is currently supported.
	switch($_SERVER['REQUEST_METHOD']){	
		case 'DELETE':
			parse_str(file_get_contents('php://input'), $_DELETE);
			
			try{
				if(isset($_DELETE['surName'])){
					$remove = "DELETE FROM results WHERE surName = ?";
				}	
				else{
					http_response_code(400);
					break;
				}
				
				$stmt = $db->prepare($remove);
				
				$stmt->bindParam(1, $_DELETE['surName']);

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
			header("Allow: DELETE");
			break;
	}	
	
?>
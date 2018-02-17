<!-- 8.2.2 Functional Requirement 2.2
USE CASE: Pollster login page: Pollster Login
DESCRIPTION: The pollster will be able to log in to the pollster home page by entering a correct username and password
WHY: To ensure the pollster can access the pollster home page securely -->
<html>
	<body>
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

		<div class= "container">
			<div class= "row" id= "header_row">

				<img src="https://assets.ewu.edu/assets/testing-hdr-bg.png" alt="https://assets.ewu.edu/assets/testing-hdr-bg.png" class="transparent">

				</div>

				<div class= "row" id= "first_content">
					<div class= "col-md-4 col-md-offset-4" id= "center_content">						
							<div class= "panel-heading">
								<h1><b> Survey Administrator</b></h1>
							</div>
							<div class= "panel-body">
								<form action= "pAuth.php" method= "post">
									<fieldset>
										<legend>Login:</legend>

											Username: <input type="text" placeholder= "Username" name= "username">
											<br>
												<br>
											Password: <input type="password" placeholder= "Password" name= "pword">
														<br>
															<br>
																<input class= "btn btn-primary btn block" type="submit" value= "Submit" name= "submit">
																</fieldset>
																<br>
																<p><i> 
																	<a href= "mailto:insert_email@here.com?Subject=Survey%20System%20Password%20Reset"> forgot username / password? </a>
																</i></p>
															</form>
														</div>
													</div>
											</div>


										</div>
									</body>
									</html>
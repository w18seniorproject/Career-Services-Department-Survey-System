<?php

    //include db connection file
    include_once "../config/pollsterDB.php";

    $database = new Database();

    $conn = $database->getConnection();

    $username = $_POST["username"];
    $pass = $_POST["password"];
    $passConfirm = $_POST["password-confirm"];
    $email = $_POST["email"];

    if($pass != $passConfirm){
        header("Location: pSignup.html?error=noMatch");
        die("passwords don't match");
    }

    if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        header("Location: pSignup.html?error=badEmail");
        die("bad email");
    }

    //check for duplicate email
    $sql = "SELECT email FROM accounts;";
    $result = $conn->prepare($sql);
    $result->execute();
    for($i = 0; $i < $result->rowCount(); $i++){
        if($email == $result->fetchColumn(0)){
            header("Location: pSignup.html?error=emailTaken");
            die("Email Already in Use");
        }
    }
    
    //check for duplicate username
    $sql = "SELECT acctName FROM accounts;";
    $result = $conn->prepare($sql);
    $result->execute();
    for($i = 0; $i < $result->rowCount(); $i++){
        if($username == $result->fetchColumn(0)){
            header("Location: pSignup.html?error=usernameTaken");
            die("Username Already in Use");
        }
    }

    //check for profane usernames or emails TODO

    $hashedPass = password_hash($pass, PASSWORD_BCRYPT);

    $sql = "INSERT INTO `accounts` (`pass`, `email`, `acctName`) VALUES (?, ?, ?);";

    $result = $conn->prepare($sql);
    $result->execute(array($hashedPass, $email, $username));

    echo "Success";

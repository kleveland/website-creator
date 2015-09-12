<?php 

    // First we execute our common code to connection to the database and start the session 
    require("common.php"); 
     
    // This if statement checks to determine whether the registration form has been submitted 
    // If it has, then the registration code is run, otherwise the form is displayed 
     
?> 
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>HTML Template</title>

    <!-- Bootstrap-->
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="../creator/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="../creator/css/bootstrap-theme.min.css">

    <!-- Latest compiled and minified JavaScript -->
        <script src="../creator/js/jquery-2.1.4.min.js"></script>
    <script src="../creator/js/bootstrap.min.js"></script>
    <script src="../creator/js/bootstrap.js"></script>
    <!--End Bootstrap-->
    
    <!--JS-->
    <script src="js/main.js"></script>

    <link rel="stylesheet" href="css/main.css" type="text/css">

</head>

<body>
    <div class="panel panel-default content">
        <div class="panel-heading">
            <h3 class="panel-title">Register</h3>
        </div>
        <div class="panel-body">
<?php
    $errors = array();

    if(!empty($_POST)) 
    { 
        // Ensure that the user has entered a non-empty username 
        if(empty($_POST['username'])) 
        { 
            // Note that die() is generally a terrible way of handling user errors 
            // like this.  It is much better to display the error with the form 
            // and allow the user to correct their mistake.  However, that is an 
            // exercise for you to implement yourself.
            $errors['nousername'] = 'Please enter a username';
        } 
         
        // Ensure that the user has entered a non-empty password 
        if(empty($_POST['password'])) 
        { 
                        $errors['nopass'] = 'Please enter a password';
        } 
         
        // Make sure the user entered a valid E-Mail address 
        // filter_var is a useful PHP function for validating form input, see: 
        // http://us.php.net/manual/en/function.filter-var.php 
        // http://us.php.net/manual/en/filter.filters.php 
        if(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) 
        { 
                        $errors['invalemail'] = 'Please enter a valid E-mail';
        } 
         
        // We will use this SQL query to see whether the username entered by the 
        // user is already in use.  A SELECT query is used to retrieve data from the database. 
        // :username is a special token, we will substitute a real value in its place when 
        // we execute the query. 
        $query = " 
            SELECT 
                1 
            FROM users 
            WHERE 
                username = :username 
        "; 
         
        // This contains the definitions for any special tokens that we place in 
        // our SQL query.  In this case, we are defining a value for the token 
        // :username.  It is possible to insert $_POST['username'] directly into 
        // your $query string; however doing so is very insecure and opens your 
        // code up to SQL injection exploits.  Using tokens prevents this. 
        // For more information on SQL injections, see Wikipedia: 
        // http://en.wikipedia.org/wiki/SQL_Injection 
        $query_params = array( 
            ':username' => $_POST['username'] 
        ); 
         
        try 
        { 
            // These two statements run the query against your database table. 
            $stmt = $db->prepare($query); 
            $result = $stmt->execute($query_params); 
        } 
        catch(PDOException $ex) 
        { 
            // Note: On a production website, you should not output $ex->getMessage(). 
            // It may provide an attacker with helpful information about your code.  
            die("Failed to run query: " . $ex->getMessage()); 
        } 
         
        // The fetch() method returns an array representing the "next" row from 
        // the selected results, or false if there are no more rows to fetch. 
        $row = $stmt->fetch(); 
         
        // If a row was returned, then we know a matching username was found in 
        // the database already and we should not allow the user to continue. 
        if($row) 
        {
                        $errors['usernameinuse'] = 'That username is already in use';
        } 
         
        // Now we perform the same type of check for the email address, in order 
        // to ensure that it is unique. 
        $query = " 
            SELECT 
                1 
            FROM users 
            WHERE 
                email = :email 
        "; 
         
        $query_params = array( 
            ':email' => $_POST['email'] 
        ); 
         
        try 
        { 
            $stmt = $db->prepare($query); 
            $result = $stmt->execute($query_params); 
        } 
        catch(PDOException $ex) 
        { 
        } 
         
        $row = $stmt->fetch(); 
         
        if($row) 
        { 
                        $errors['emailinuse'] = 'That E-mail is already in use';
        } 
         
        // An INSERT query is used to add new rows to a database table. 
        // Again, we are using special tokens (technically called parameters) to 
        // protect against SQL injection attacks. 
        $query = " 
            INSERT INTO users ( 
                username, 
                password, 
                salt, 
                email 
            ) VALUES ( 
                :username, 
                :password, 
                :salt, 
                :email 
            ) 
        "; 
         
        // A salt is randomly generated here to protect again brute force attacks 
        // and rainbow table attacks.  The following statement generates a hex 
        // representation of an 8 byte salt.  Representing this in hex provides 
        // no additional security, but makes it easier for humans to read. 
        // For more information: 
        // http://en.wikipedia.org/wiki/Salt_%28cryptography%29 
        // http://en.wikipedia.org/wiki/Brute-force_attack 
        // http://en.wikipedia.org/wiki/Rainbow_table 
        $salt = dechex(mt_rand(0, 2147483647)) . dechex(mt_rand(0, 2147483647)); 
         
        // This hashes the password with the salt so that it can be stored securely 
        // in your database.  The output of this next statement is a 64 byte hex 
        // string representing the 32 byte sha256 hash of the password.  The original 
        // password cannot be recovered from the hash.  For more information: 
        // http://en.wikipedia.org/wiki/Cryptographic_hash_function 
        $password = hash('sha256', $_POST['password'] . $salt); 
         
        // Next we hash the hash value 65536 more times.  The purpose of this is to 
        // protect against brute force attacks.  Now an attacker must compute the hash 65537 
        // times for each guess they make against a password, whereas if the password 
        // were hashed only once the attacker would have been able to make 65537 different  
        // guesses in the same amount of time instead of only one. 
        for($round = 0; $round < 65536; $round++) 
        { 
            $password = hash('sha256', $password . $salt); 
        } 
         
        // Here we prepare our tokens for insertion into the SQL query.  We do not 
        // store the original password; only the hashed version of it.  We do store 
        // the salt (in its plaintext form; this is not a security risk). 
        $query_params = array( 
            ':username' => $_POST['username'], 
            ':password' => $password, 
            ':salt' => $salt, 
            ':email' => $_POST['email'] 
        ); 
        
        try 
        { 
            $captcha = @$_POST['ct_captcha']; // the user's entry for the captcha code
            require_once dirname(__FILE__) . '/securimage/securimage.php';
            $securimage = new Securimage();
                          if ($securimage->check($captcha) == false) {
                    $errors['captcha_error'] = 'Incorrect security code entered<br />';
                    throw new PDOException("Invalid Captcha");
                }
            // Execute the query to create the user 
            $stmt = $db->prepare($query); 
            $result = $stmt->execute($query_params);
                    // This redirects the user back to the login page after they register
         
        // Calling die or exit after performing a redirect using the header function 
        // is critical.  The rest of your PHP script will continue to execute and 
        // will be sent to the user if you do not die or exit.
                            echo '<div class="alert alert-success alert-dismissible" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <strong>Account Created.</strong> Please go back to the login page and login.
</div>';  
        die('<a href="index.php">Click here to return to the login page.</a>'); 
        } 
        catch(PDOException $ex) 
        {
            foreach($errors as $error) {
                echo '<div class="alert alert-danger alert-dismissible" role="alert">
  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <strong>Error!</strong> ' . $error . '
</div>';  
            }
            
            // Note: On a production website, you should not output $ex->getMessage(). 
            // It may provide an attacker with helpful information about your code. 
        }

    } 
?>
<form action="register.php" method="post"> 
                            <div class="input-group inputsec">
                    <span class="input-group-addon" id="basic-addon1">Username</span>
                    <input type="text" name="username" class="form-control" placeholder="Username" aria-describedby="basic-addon1">
                </div>
                                        <div class="input-group inputsec">
                    <span class="input-group-addon" id="basic-addon1">Password</span>
                    <input type="password" name="password" class="form-control" placeholder="Password" aria-describedby="basic-addon1">
                </div>
                <div class="input-group inputsec">
                    <span class="input-group-addon" id="basic-addon1">Email</span>
                    <input type="text" name="email" class="form-control" placeholder="example@example.com" aria-describedby="basic-addon1">
                </div>
      <p>
    <?php
      // show captcha HTML using Securimage::getCaptchaHtml()
      require_once 'securimage/securimage.php';
      $options = array();
      $options['input_name'] = 'ct_captcha'; // change name of input element for form post

      if (!empty($_SESSION['ctform']['captcha_error'])) {
        // error html to show in captcha output
        $options['error_html'] = $_SESSION['ctform']['captcha_error'];
      }

      echo Securimage::getCaptchaHtml($options);
    ?>
  </p>
                <div class="logincontainer">
                    <a href="index.php">Login</a> | <button type="submit" value="Register" class="btn btn-primary">Register</button>
                </div>
            </form>
        </div>
    </div>
</body>

</html>
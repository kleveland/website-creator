<?php 

    // First we execute our common code to connection to the database and start the session 
    require("../login/common.php"); 
     
    // At the top of the page we check to see whether the user is logged in or not 
    if(empty($_SESSION['user'])) 
    { 
        // If they are not, we redirect them to the login page. 
        header("Location: ../login/"); 
         
        // Remember that this die statement is absolutely critical.  Without it, 
        // people can view your members-only content without logging in. 
        die("Redirecting to ../login/"); 
    } 
     
    // Everything below this point in the file is secured by the login system 
     
    // We can display the user's username to them by reading it from the session array.  Remember that because 
    // a username is user submitted content we must use htmlentities on it before displaying it to the user. 
?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>HTML Template</title>

        <!-- REMOVABLE FILES -->
        <script src="js/jquery-2.1.4.min.js"></script>
        <script src="jqueryui/jquery-ui.js"></script>
        <link href="jqueryui/jquery-ui.css" rel="stylesheet">
        <script src="base64/base64.js"></script>
        <script src="js/jquery.js"></script>
        <script src="colorpicker/dist/js/bootstrap-colorpicker.js"></script>
        <link href="colorpicker/dist/css/bootstrap-colorpicker.min.css" rel="stylesheet">

        <link href="tooltip/css/jquery.powertip.css" rel="stylesheet">
        <script src="tooltip/jquery.powertip.js"></script>
        <!-- CONTEXT MENU -->
        <script src="contextmenu/src/jquery.contextMenu.js" type="text/javascript"></script>
        <link href="contextmenu/src/jquery.contextMenu.css" rel="stylesheet" type="text/css" />
        <!-- JS EDITORS -->

        <script type="text/javascript" src="tinymce/js/tinymce/tinymce.min.js"></script>

        <!-- END JS EDITORS -->

        <!-- JSZIP -->
        <script type="text/javascript" src="jszip/dist/jszip.js"></script>
        <script type="text/javascript" src="filesaver/FileSaver.js"></script>
        <!-- END JSZIP -->

        <!-- Bootstrap-->
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="css/bootstrap.min.css">

        <!-- Optional theme -->
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">

        <!-- Latest compiled and minified JavaScript -->
        <script src="js/bootstrap.min.js"></script>
        <!--End Bootstrap-->

        <!-- END REMOVABLE FILES -->

        <link rel="stylesheet" href="css/main.css" type="text/css">

        <!-- EXTRA CODE -->

    </head>
    <body>
        <!-- END EXTRA CODE -->
        <!-- TOOLS -->
        
        <ul class="panelmanage">
            <div class="topbar">
                <div class="close"><img src="img/close.png"></img>
                </div>
            </div>
            <div class="panelinfo">

            </div>
        </ul>
        <button class="btn btn-primary togglebar" id="togglebar" type="button">Show Toolbar</button>
        <div class="fixednavbar">
            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <!-- Brand and toggle get grouped for better mobile display -->
                    <div class="navbar-header">
                        <a class="navbar-brand" href="http://kleveland.me/">
                            <img class="smalllogo" src="img/smalllogo.png"></img>
                        </a>
                    </div>

                    <!-- Collect the nav links, forms, and other content for toggling -->
                    <div class="navbar1" id="navbar1">
                        <ul class="nav navbar-nav">
                            <p class="navbar-text"><b><?php echo htmlentities($_SESSION['user']['username'], ENT_QUOTES, 'UTF-8'); ?> </b><a href="../login/logout.php">Logout</a></p>
                            <li>
                                <button type="button" id="togglebaroff" class="btn btn-primary navbutton">
                                    Hide Toolbar
                                </button>
                            </li>

                            <li>
                                <button type="button" id="export" class="btn btn-primary navbutton">
                                    Generate HTML
                                </button>
                            </li>

                            <li>
                                <div class="input-group navbutton" id="wallpaperset">
                                    <span class="input-group-btn navbutton">
        <button class="btn btn-primary" id="changewallpaper" type="button">Change Wallpaper</button>
      </span>
                                    <input type="text" class="form-control" id="wallpaperurl" placeholder="Image url...">
                                </div>
                            </li>

                        </ul>

                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <button type="button" id="paneltoggle" class="btn btn-primary navbutton">
                                    Toggle Panel Menu
                                </button>
                            </li>

                            <li>
                                <button type="button" id="editortoggle" class="btn btn-primary navbutton">
                                    Toggle Editor
                                </button>
                            </li>
                        </ul>

                    </div>
                    <!-- /.navbar-collapse -->

                </div>
                <!-- /.container-fluid -->
            </nav>
            <div class="editor" id="editpanel">
                <textarea class="tinymce" id="editor1" name="editor1"></textarea>
            </div>
        </div>

        <div class="panel panel-default panelbotright" id="panelmenu">
            <div class="panel-heading">
                <h3 class="panel-title">Panel Settings</h3>
            </div>
            <div class="panel-body">

                <button type="button" id="paneladd" class="btn btn-primary bttn">
                    Add Panel
                </button>

                <button type="button" id="delete" class="btn btn-primary bttn">
                    Delete Selected Panel
                </button>

                <div class="input-group colorpicker bttn">
                    <input type="text" value="" id="panelcolor" placeholder="Color Chooser" class="form-control" readonly="readonly" />
                    <span class="input-group-addon"><i></i></span>
                </div>

                <div class="input-group bttn">
                    <input type="text" class="form-control" id="panelwidth" placeholder="100px or 100%" value="100px" aria-describedby="basic-addon2">
                    <span class="input-group-addon" id="basic-addon2">Width</span>
                </div>

                <div class="input-group bttn">
                    <input type="text" class="form-control" id="panelheight" placeholder="100px or 100%" value="100px" aria-describedby="basic-addon2">
                    <span class="input-group-addon" id="basic-addon2">Height</span>
                </div>

                <button type="button" id="addcss" class="btn btn-primary bttn">
                    Additional CSS...
                </button>

            </div>
        </div>

        <div class="menuoperator">
            <!-- Nav/logo -->
            <!-- End Nav/logo -->
        </div>
        <!-- END TOOLS -->

        <ul class="content">
        </ul>
        <!-- CONTENT END -->

        <!-- END -->
    </body>

    </html>
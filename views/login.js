<!DOCTYPE html>
<html>
  <head>
	<title>DND LFG</title>
	<!-- This 3rd-party stylesheet incorporates SVG icons from Font Awesome: http://fontawesome.com/ -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.0/css/all.css" crossorigin="anonymous">
	<link rel="stylesheet" href="css/style.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.6/handlebars.runtime.js"></script>
<!--     this line is for a thing i hope i dont need
        <script src="character.js" charset="utf-8" defer></script>
        <script src="index.js" charset="utf-8" defer></script>
-->
        <script src="js/login.js" charset="utf-8" defer></script>
  </head>
  <body id="login-body">
	<header>
		<h1 class="site-title"><i class="fas fa-dragon"></i>   D<i class="fab fa-d-and-d"></i>D LFG</h1></a>
    </header> 
	<div class="login-page">
		<div class="login-full-form">
			<div class="login">
				<div class="login-header">
					<h3>Enter the Dungeon</h3>
				</div>
			</div>
			<form class="login-form">
				<input id="login-username" type="text" placeholder="username"/>
				<input id="login-password" type="password" placeholder="password"/>
				<button id="login-button">login</button>
				<p class="message"><a href="signup">sign up</a></p>
			</form>
		</div>
	</div>
  </body>
</html>

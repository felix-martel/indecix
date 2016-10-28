<?php

	$recipient = "flx.martel@gmail.com";
    $title = "Activate your KHOTE account";
    $header = "From: activation@khote.com";

    $message = 'Hi just for testing purpose';
     // Serveur mail à configurer...
     mail($recipient, $title, $message, $header);

?>
function checkInputData() {
	var inElement=document.getElementById("telephone");
	var alertElements=document.getElementsByClassName("modal_message_erreur_saisie");
 
	var errorText="";
	var isValid=true;
 
	if(inElement.value.length>10) {
		errorText="(trop long)";
		isValid=false;
	}
	else if(inElement.value.length<10) {
		errorText="(trop court)";
		isValid=false;
	}	
	else if(checkNumberValidity(inElement.value)==false) {
		errorText="(non valide)"+errorText;
		isValid=false;
	}
 
	if(isValid==true) {
		var $texte=$("#check_number_message");
		$texte.css("color", "black");
		$texte.html("ok"+errorText);
	}
	else {
		var $texte=$("#check_number_message");
		$texte.css("color", "red");
		$texte.html("erreur de saisie"+errorText);
 
		for(var i=0;i<alertElements.length;i++) {
			var msg=alertElements[i];
			msg.innerHTML="Erreur de saisie: assurez vous d'avoir bien saisi toutes les donn&eacutees";
		}
	}
}
 
function checkNumberValidity(num_tel) {
	var regex = new RegExp(/^(01|02|03|04|05|06|08|09)[0-9]{8}/gi);
 
	var match = false;
	if(regex.test(num_tel)) {
		match = true;
	}
	else {
		match = false;
	}
	return match;
}
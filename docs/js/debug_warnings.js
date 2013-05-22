$(document).ready(function() {

	if ($(".row-fluid").length){
		console.log("## CLASS UPDATE - .row-fluid should be changed to .grid -- unless it's supposed to be a fixed width, then change it to .grid-px-width");
	}
	if ($(".row").length){
		console.log("## CLASS UPDATE - .row should be changed to .grid -- unless it's supposed to be a fixed width, then change it to .grid-px-width");
	}
	if ($(".container-fluid").length){
		console.log("## CLASS UPDATE - .container-fluid should be changed to .container -- unless it's supposed to be a fixed width, then change it to .container-px-width");
	}
	
});
var ajEmployees;

// callback function for ajax request
function fnDisplayEmployee(i, employee){
    // create string that looks like html and insert information from the employee oject
	var sEmployeeCardHtml = '<div class="employee-card" id="'+ i +'">';
	sEmployeeCardHtml += '<img src="'+ employee.picture.large +'">';
	sEmployeeCardHtml += '<div class="employee-details">';
	sEmployeeCardHtml += '<h2 class="employee-name">'+ fnConvertToCamelCase(employee.name.first) +' '+ fnConvertToCamelCase(employee.name.last) +'</h2>';
	sEmployeeCardHtml += '<p class="employee-mail">'+ employee.email +'</p>';
	sEmployeeCardHtml += '<p>'+ employee.login.username +'</p>';
	sEmployeeCardHtml += '<p>'+ fnConvertToCamelCase(employee.location.city) +', '+ fnConvertToCamelCase(employee.location.state) +'</p></div>';
	// append the string to the div with the id employee-list
	$("#employee-list").append(sEmployeeCardHtml);
}

// function to convert string to camel case format
function fnConvertToCamelCase(string){
	// split the string into an array
	var aString = string.split(' ');
	// loop through array; each item is a word
	for(i = 0; i < aString.length; i++){
		// split the word into an array of letters
		var aWord = aString[i].split('');
		// convert the first character to upper case
		aWord[0] = aWord[0].toUpperCase();
		// join the array to a string/word again
		aString[i] = aWord.join('');
	}
	// return the joined string
	return aString.join(' ');
}

// function to format birthdate
function fnFormatBirthdate(birth){
	// split birth data into array
	var aBirthdate = birth.split(' ');
	// split the date into separate array, reverse the order of the items in the array and join it with /
	return aBirthdate[0].split('-').reverse().join('/');
}

// function to generate html for modal
function fnGenerateModalHtml(jEmployee, sId){
    // create string that looks like html and insert information from the employee oject
    var sEmployeeModalHtml = '<div id="modal-content">';
    sEmployeeModalHtml += '<span id="close-modal" class="fa fa-times"></span>';
    sEmployeeModalHtml += '<img src="' + jEmployee.picture.large +'">';
	sEmployeeModalHtml += '<div id="personal-info"><h2>' + fnConvertToCamelCase(jEmployee.name.first) +' '+ fnConvertToCamelCase(jEmployee.name.last) +'</h2>';
	sEmployeeModalHtml += '<p>' + jEmployee.email +'</p>';
	sEmployeeModalHtml += '<p>' + jEmployee.login.username +'</p>';
	sEmployeeModalHtml += '<p>' + fnConvertToCamelCase(jEmployee.location.state) + '</p></div>'; 
	sEmployeeModalHtml += '<div id="additional-info"><p>'+ jEmployee.cell +'</p>';
	sEmployeeModalHtml += '<p>' + fnConvertToCamelCase(jEmployee.location.street) + ', ' + jEmployee.location.postcode + ' ' + fnConvertToCamelCase(jEmployee.location.city) + '</p>';
	sEmployeeModalHtml += '<p> Birthday: ' + fnFormatBirthdate(jEmployee.dob) +'</p></div>';
	sEmployeeModalHtml += '<div id="modal-navigation"><input type="hidden" value="'+ sId +'"><span id="previous" class="fa fa-arrow-left" aria-hidden="true"></span><span id="next" class="fa fa-arrow-right" aria-hidden="true"></span></div></div>';
	return sEmployeeModalHtml;
}

// function to open modal window
function fnOpenModal(){
	$("#modal").css("display", "flex");
}
// function to close modal window
function fnCloseModal(){
	$("#modal").css("display", "none");
}
// function to search for employees
function fnSearchEmployees(search){
	// define search pattern
	let pattern = new RegExp(search, "ig");
	// create empty matches array
	let aMatches = [];
	// loop through all employees
	for(i = 0; i < ajEmployees.length; i++){
		// get employee name
		let sEmployeeName = ajEmployees[i].name.first + ' ' + ajEmployees[i].name.last;
		// get employee mail
		let sEmployeeMail = ajEmployees[i].email;
		// check if name matches search pattern
		let matchResultName = sEmployeeName.match(pattern);
		// check if mail matches search pattern
		let matchResultMail = sEmployeeMail.match(pattern);
		// if name or mail match, push employee to matches array
		if(matchResultName !== null || matchResultMail !== null){
			aMatches.push(ajEmployees[i]);
		}
	}
	// hide all employees
	$(".employee-card").css("display", "none");
	// check if there are more than 0 matches
	if(aMatches.length > 0){
		// remove the no-result message in case it's displayed
		$("#no-result").remove();
		// reset styles from previous search, in case there were any
	    $("#employee-list").css("justify-content", "");
	    $(".employee-card").css("margin-right", "");
	    // if there are less than 3 results change css, so the row is displayed aligned to the left
	    if(aMatches.length < 3){
	        $("#employee-list").css("justify-content", "flex-start");
	        $(".employee-card").css("margin-right", "20px");
	    }
	    // loop through matches and set display to flex, so they will be displayed - "unhiding" employees
	    for(i = 0; i < aMatches.length; i++){
	        var iResultIndex = ajEmployees.indexOf(aMatches[i]);
	        $("#"+iResultIndex).css("display", "flex");
	    }
	}else{
		// if the no-result message is not there yet, append it
		if($("#no-result").length == 0){
			$("#employee-list").append('<h3 id="no-result">There is no employee matching your search.</h2>');
		}
	}
}

// function to reset the search
function fnResetSearch(){
	// remove value from input field
    $("#search").val("");
    // change the icon back to the search icon
    $("#search-icon").removeClass("fa-times").addClass("fa fa-search");
    // display all employees
   	$(".employee-card").css("display", "flex");
   	// reset css styles if they were changed during the search
   	$(".employee-card").css("margin-right", "");
	$("#employee-list").css("justify-content", "");
	// remove the no-result message if it's present
	$("#no-result").remove();
}

// ajax request to API
// if the request is successful, loop through all items and execute the callback function for each item
$.ajax({
  url: "https://randomuser.me/api/?results=12&nat=us,gb",
  dataType: "json"
}).done(function(jData){
	// assign returned results to the variable ajEmployees
    ajEmployees = jData.results;
    // loop through all items/employees
	$.each(jData.results, fnDisplayEmployee);
});

/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/************************************************     SEARCH     ***************************************************************/

// search when keyword is typed
$("#search").bind('input propertychange', function(){
	// get the value of the input field
	var sKeyword = $(this).val();
	// check if the input field has a value
	if(sKeyword.length > 0){
		// change the search icon to the reset icon
	    $("#search-icon").removeClass("fa-search").addClass("fa fa-times");
	    // call the function fnSearchEmployees and pass the search value to it
	    fnSearchEmployees(sKeyword);
	}else{
		// if the field has no input, reset the search
	    fnResetSearch();
	}
})

// reset search when reset icon is clicked
$(document).on("click", "#search-icon.fa.fa-times", function(){
	// reset the search
    fnResetSearch();
})

/*******************************************************************************************************************************/
/*******************************************************************************************************************************/
/*************************************************     MODAL     ***************************************************************/

// display modal with employee information when card is clicked
$(document).on("click", ".employee-card", function(){
    // get the index from ID of the clicked item
    var sEmployeeIndex = $(this).attr("id");
    // get the employee object using the index
    var jEmployee = ajEmployees[sEmployeeIndex];
    // pass the employee object to fnGenerateModalHtml function
    var sEmployeeModalHtml = fnGenerateModalHtml(jEmployee, sEmployeeIndex);
	// replace innerhtml of div with id modal
	$("#modal").html(sEmployeeModalHtml);
	// call the fnOpenModal function to display the modal
	fnOpenModal();
})

// display previous or next employee when navigation arrows are clicked
$(document).on("click", "#modal-navigation span", function(){
	// get the id of the currently displayed employee
	var sCurrentEmployeeIndex = $(this).siblings('input[type="hidden"]').val();
	// determine if the previous or the next employee should be displayed
	if($(this).attr("id") == "previous"){
		// calculate the index of the previous employee
		var sNewEmployeeIndex = parseInt(sCurrentEmployeeIndex) -1;
		if(sCurrentEmployeeIndex == 0){
			sNewEmployeeIndex = 11;
		}
	}else{
		// calculate the index of the previous employee
		var sNewEmployeeIndex = parseInt(sCurrentEmployeeIndex) +1;
		if(sCurrentEmployeeIndex == 11){
			sNewEmployeeIndex = 0;
		}
	}
	// get the previous employee from the ajEmployees array
	var jNewEmployee = ajEmployees[sNewEmployeeIndex];
	// call fnGenerateModalHtml function and pass the employee and its index, save the returned data to the variable sEmployeeModalHtml
	var sEmployeeModalHtml = fnGenerateModalHtml(jNewEmployee, sNewEmployeeIndex);
	// replace the modal's html
	$("#modal").html(sEmployeeModalHtml);
	// display the modal
	fnOpenModal();
})

// close modal when the close icon is clicked
$(document).on("click", "#close-modal", function(){
    fnCloseModal();
})
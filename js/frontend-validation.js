/*
 * This script will handle all the front-end validation of the registration form.
 *	ASSUMING EVERY FIELD IS REQUIRED. 
 */
 function validInput(input) {
 	/*
 	 * This function will update the input and display the given error message.
 	 * 
 	 * @param (input)(Object) => The input object that is being checked.
 	 * @param (error)(String) => The error message that will be displayed below the submit button.
 	 * 
 	 * @return (null) => This function modify the DOM.
 	 */
	input.removeClass('has-error');

	var name = input.attr('name');
	var form = input.parent();

	// removing error from list of errors...
	if(form.find('#errors > #' + name).length)
		$('#' + name).remove();

	// checking if there are still errors...
	console.log(form.find('#errors').children());
	if(form.find('#errors').children().length < 2) {
		$('#errors').remove();
		form.find('button[type="submit"]').attr('disabled', false);
	}

 }

 function invalidInput(input, error) {
 	/*
 	 * This function will update the input and display the given error message.
 	 * 
 	 * @param (input)(Object) => The input object that is being checked.
 	 * @param (error)(String) => The error message that will be displayed below the submit button.
 	 * 
 	 * @return (null) => This function modify the DOM.
 	 */
	input.addClass('has-error');

	var name = input.attr('name');
	var form = input.parent();
	var errors = form.find('#errors');
	
	// listing out the errors...
	if(errors.length) {
		// other errors exist...
		if(!errors.find('#' + name).length) {
			errors.append('<li id="' + name + '">' + error + '</li>');
		} else {
			$('#' + name).text(error);
		}
	} else {
		// need to start a list of errors...
		form.append('<ul id="errors"><strong>Errors:</strong><li id="' + name + '">' + error + '</li></ul>');
	}

	// disabling submit button...
	form.find('button[type="submit"]').attr('disabled', true);

}


 function isBlank(data, input) {
 	/*
 	 * This function will determine if the given data is blank, and a sting of blank spaces.
 	 * 
 	 * @param (data)(String) => The data that was entered by the user.
 	 * @param (input)(Object) => The input object that is being checked.
 	 * 
 	 * @return (boolean) => True/false flag if the input was left blank.
 	 */
	var regex = /^ *$/;

	if(regex.test(data)) {
		
		// the input was left blank, or has nothing but spaces...
		var error = null;
		switch(input.attr('name')){

			case 'first-name':
			case 'last-name':
			case 'job-title':
			case 'company-name':
				var data = input.attr('name').replace(/[\-]/g, ' ');
				error = 'Your ' + data + ' cannot be left blank.';
				break;

			case 'email':
				error = 'Your email address cannot be left blank.';
				break;

			case 'phone':
				error = 'Your phone number cannot be left blank.';
				break;

			default:
				break;

		}
		invalidInput(input, error);
		return 0;

	} else {

		return 1;

	}

}

function name(data, input) {
	/*
 	 * This function will validate generic names (first, last, company).
 	 * 
 	 * @param (data)(String) => The data that was entered by the user.
 	 * @param (input)(Object) => The input object that is being checked.
 	 * 
 	 * @return (boolean) => True/false flag if the input has a valid name.
 	 */
	if(isBlank(data, input)) {

		// A name should only consist of letters, and can have hyphens (-) and/or apostrophes (')...
		var regex = /[!@#$%^&*\(\)\_+=\[\]\{\}\\\|<>\/?,\.;:"`~0-9]/;
		if(regex.test(data.trim())) {

			var error = 'Invalid ' + input.attr('name').replace(/[\-]/g, ' ') + '.';
			invalidInput(input, error);
			return 0;

		} else {

			return 1;

		}

	} else {

		return 0;

	}

}

function email(data, input) {
	/*
 	 * This function will validate the user's email address.
 	 * 
 	 * @param (data)(String) => The email address provided by the user.
 	 * @param (input)(Object) => The input object that is being checked.
 	 * 
 	 * @return (boolean) => True/false flag if the input has a valid email.
 	 */
	if(isBlank(data, input)) {
		
		var regex = /^[a-z0-9_!#$%&'*+\-\/=?^`{|}~]+(\.[a-z0-9_!#$%&'*+\-\/=?^`{|}~]+)?@[a-z0-9\-]+(\.[a-z]+)+$/gi;
		
		if(!regex.test(data.trim())) {

			invalidInput(input, 'Invalid email address.');
			return 0;

		} else {

			return 1;

		}

	} else {

		return 0;

	}

}

function phone(data, input) {

	// This function will validate a phone number using any format and then re-write to be consistant...
	data = data.replace(/[\(\)\-\. ]/g, '');

	if(isBlank(data, input)) {

		// will check if striped down number is correct...
		var regex = /^\d{10}$/;
		if(!regex.test(data)) {

			invalidInput(input, 'Invalid phone number.');
			return 0;

		} else {

			var i = 0;
			var number = '';

			while(i < 10){

				switch(i){

					case 0:
						number += '(' + data[i];
						i++;
						break;

					case 2:
						number += data[i] + ') ';
						i++;
						break;

					case 5:
						number += data[i] + '-';
						i++;
						break;

					default:
						number += data[i];
						i++;
						break;

				}

			}

			input.val(number);
			return 1;

		}

	} else {

		return 0;

	}

}


$('body').on('focusout', 'input', function() {
	/*
	 * Based on the input's type, this function will call the appropriate method.
	 */
	var value = $(this).val();
	var fn = null;

	switch($(this).attr('name')){

		case 'first-name':
		case 'last-name':
		case 'job-title':
			fn = 'name';
			break;

		case 'email':
			fn = 'email';
			break;

		case 'phone':
			fn = 'phone';
			break;

		default:
			fn = 'isBlank';
			break;

	}

	if(jQuery.isFunction(window[fn]))
		if(window[fn](value, $(this)))
			validInput($(this));

});
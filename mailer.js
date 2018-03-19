var sendErrorEmailAndQuit = function(errorMessage) {
	//stuff needed to connect to the mail service
  var api_key = 'key-167b566395edd8b326dce5c1326e5a29';
  var DOMAIN = 'sandboxb5f8022927fc49e586c7b401d2383395.mailgun.org';
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});
	
	var data = {
	  from: 'Deforester <noreply@deforester.com>',
	  to: 'jrodmanu@yahoo.com',
	  subject: 'Error in Deforester',
	  text: errorMessage
	};
	
	mailgun.messages().send(data, function (error, body) {
	  console.log(body);
    require('electron').remote.app.quit();
	});
}
//when you do require(./mailer) the object reutrned will be sendErrorEmailAndQuit
module.exports.sendErrorEmailAndQuit = sendErrorEmailAndQuit;

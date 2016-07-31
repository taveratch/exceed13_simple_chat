$(document).ready(function () {
	var user;
	var currentMessageId = 0;
	var messageArray;
  var MessageWrapper = $('#messages-wrapper');
	var Messages = $('#messages');
  var MessageList = $('#message-list');
	var MyMessage = $('#my-message');
  var SigninModal = $('#signinModal');
	var SendButton = $('#btn-send');
  var SigninButton = $('#signin');
  if(!user) {
    SigninModal.modal('toggle');
  }
  SigninButton.click(function() {
    signin();
  });
  function signin() {
    user = $('#username').val();
    SigninModal.modal('toggle');
  }
	function messageConverter(messageStr) {
		return JSON.parse(messageStr);
	}

	function showMessage(message) {
		Messages.html(Messages.val() + '\n' + message);
	}

	function renderMessages(messageArr) {
		// Messages.html('');
    MessageList.empty();
    var lastMessage = messageArray[messageArray.length - 1];

		messageArr.map(function (item) {
      var newMessage = item.user + ' : ' + item.message;
      MessageList.append('<li class="'+(item.user === user ? 'owner' : "")+'"><div class="list-wrapper"><img class="dot" width="20" src="assets/yellow.png"/>'+newMessage+'</div></li>');
      // showMessage(newMessage);
		});
    MessageWrapper.scrollTop(MessageWrapper[0].scrollHeight); //scroll to bottom
	}

	function sendMessage(message) {
		var serverMessage = EXcreateMessage(message, user);
		messageArray.push(serverMessage);
		$.ajax({
				url: 'http://10.32.176.4:8080/workshop/' + EXformat(messageArray)
			})
			.done(function (data) {
				console.log('success');
			});
	}

	SendButton.click(function () {
		var message = MyMessage.val();
		sendMessage(message);
    MyMessage.val('');
	});

	MyMessage.keyup(function (e) {
		if (e.keyCode === 13) {
			var message = MyMessage.val();
			sendMessage(message);
      MyMessage.val('');
		}
	});

	setInterval(function () {
		$.ajax({
				url: 'http://10.32.176.4:8080/workshop/'
			})
			.done(function (data) {
				var messageArr = messageConverter(data);
				var lastMessage = messageArr[messageArr.length - 1];
				if (lastMessage.id !== currentMessageId) {
					messageArray = messageArr;
					currentMessageId = lastMessage.id;
					renderMessages(messageArr);
				}
			});
	}, 1000);
});

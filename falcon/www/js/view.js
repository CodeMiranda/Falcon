function getFromDatabase(id, callback)
{
	$.get(config.serverUri + '/groups?id=' + id, callback);
	/*var obj = {
		id: localStorage.getItem('groupID'),
		name: 'Math 25',
        description: 'Math 25 study group',
        location: 'Lamont',
        timeCreated: 'now',
        timeEnd: 'tomorrow'
	};
	callback(obj);*/
}

var groupInfo = {};

function joinGroup() {
	$.post(config.serverUri + '/join?userId=' +
		localStorage.getItem('userID') + '&groupId=' + 
		groupInfo.id, function(response) {
			console.log(response);
			$('#joinButton').prop('disabled', true);
			$('#attendance').text(String(groupInfo.members.length+1) + ' attending');
		});
}

var group = {
	initialize: function() {
		getFromDatabase(localStorage.getItem('groupID'), function(response) {
			$('#groupName').text(response.reply.groupName);
			$('#times').text(String(moment(response.reply.timeStart, 'X').format('h:mm A')) +
				'-' + String(moment(response.reply.timeEnd, 'X').format('h:mm A')));
			$('#location').text(response.reply.location);
			$('#description').text(response.reply.description);
			$('#attendance').text(String(response.reply.members.length) + ' attending');
			var member = false;
			for (var i = 0; i < response.reply.members.length; i++) {
				if (response.reply.members[i] === Number(localStorage.getItem("userID"))) {
					member = true;
					break;
				}
			}
			if (member) {
				$('#joinButton').prop('disabled', true);
			}
			else {
				$('#joinButton').prop('disabled', false);
			}
			groupInfo = response.reply;
		});
	}
};
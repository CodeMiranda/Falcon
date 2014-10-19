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

var group = {
	initialize: function() {
		getFromDatabase(localStorage.getItem('groupID'), function(response) {
			$('#groupName').text(response.reply.groupName);
			$('#times').text(String(moment(response.reply.timeStart, 'X').format('h:mm A')) +
				'-' + String(moment(response.reply.timeEnd, 'X').format('h:mm A')));
			$('#location').text(response.reply.location);
			$('#description').text(response.reply.description);
			$('#attendance').text(String(response.reply.members.length) + ' attending');
		});
	}
};
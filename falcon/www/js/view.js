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
		getFromDatabase(0, function(response) {
			console.log(response.reply);
			/*$('#name').text(groupInfo.name);
			$('#times').text(groupInfo.timeCreated + '-' + groupInfo.timeEnd);
			$('#location').text(groupInfo.location);
			$('#description').text(groupInfo.description);
			$('#attendance').text('over 9000 people attending');*/
		});
	}
};
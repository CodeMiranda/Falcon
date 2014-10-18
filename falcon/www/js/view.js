function getFromDatabase(id)
{
	var obj = {
		id: localStorage.getItem('groupID'),
		name: 'Math 25',
        desc: 'Math 25 study group',
        location: 'Lamont',
        timeCreated: 'now',
        timeEnd: 'tomorrow'
	};
	return obj;
}

var group = {
	initialize: function() {
		var groupInfo = getFromDatabase(0);
		$('#name').text(groupInfo.name);
		$('#times').text(groupInfo.timeCreated + '-' + groupInfo.timeEnd);
		$('#location').text(groupInfo.location);
		$('#description').text(groupInfo.desc);
	}
};
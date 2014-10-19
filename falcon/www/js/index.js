/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var groups = [];

function getListItems(callback) {
    $.get(config.serverUri + '/home', callback);
}

function chooseGroup(id) {
    if ($('.chosen-group').length>0) {
        var chosen = $('.chosen-group');
        for (var i = 0; i < chosen.length; i++) {
            unchooseGroup(Number(chosen[i].id.substring(6,7)));
        }
    }
    var groupIndex = 0;
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].id === id) {
            groupIndex = i;
            break;
        }
    }
    var userID = Number(localStorage.getItem('userID'));
    $.get(config.serverUri + '/groups?id=' + String(id), function(response) {
        $('#group_' + String(id)).replaceWith(groupItemFormatSelected(groups[groupIndex]));
        var member = false;
        for (var i = 0; i < response.reply.members.length; i++) {
            if (response.reply.members[i] === userID || response.reply.author === userID) {
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
    });
}

var joinGroupButtonClickedFlag = false;

function joinGroup(id) {
    joinGroupButtonClickedFlag = true;
    $('#group_' + String(id)).focus();
    $.post(config.serverUri + '/join?userId=' +
        localStorage.getItem('userID') + '&groupId=' + 
        String(id), function(response) {
            var groupIndex = -1;
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].id === id) {
                    groupIndex = i;
                    break;
                }
            }
            $('#joinButton').prop('disabled', true);
            if (groupIndex !== -1) {
                groups[groupIndex].numMembers++;
            }
            $('#attendants').text(String(groups[groupIndex].numMembers) + ' attending');
        });
}

function unchooseGroup(id) {
    if (joinGroupButtonClickedFlag) {
        joinGroupButtonClickedFlag = false;
        return;
    }
    var groupIndex = 0;
    for (var i = 0; i < groups.length; i++) {
        if (groups[i].id === id) {
            groupIndex = i;
            break;
        }
    }
    $('#group_' + String(id)).replaceWith(groupItemFormatUnselected(groups[groupIndex]));
}

function groupItemFormatSelected(item) {
    var answer = '';
    answer += '<div href="javascript:void(0)" onclick="unchooseGroup(' +
        String(item.id) +
        ')" class="list-group-item chosen-group" id="group_' +
        String(item.id) + '"><div class="row">' +
        '<h3 class="list-group-item-heading pull-left">' + item.groupName + '</h3>' +
        '<p class="list-group-item-paragraph pull-right">' + 
        moment(item.timeStart, 'X').format('h:mm A') + '-' + 
        moment(item.timeEnd, 'X').format('h:mm A') + '</p>' +
        '</div><div class="row">' +
        '<h5 class="list-group-item-heading">' + item.location + '</h5>' +
        '<p class="list-group-item-heading">Description: ' + item.description + '</p>' +
        '<p id="attendants">' + String(item.numMembers) + ' attending' + '</p>' + 
        '</div><div class="row">' +
        '<span href="javascript:void(0)" onclick="joinGroup(' + item.id + ')">' +
        '<button class="btn btn-warning pull-left" id="joinButton" disabled>Join</button></span>' +
        '<span href="javascript:void(0)">' + 
        '<button class="btn btn-default pull-right" disabled>Chat</button></span>' + 
        '</div></div>';
    return answer;
}

function groupItemFormatUnselected(item) {
    var answer = '';
    answer += '<a href="javascript:void(0)" onclick="chooseGroup(' +
        String(item.id) +
        ')" class="list-group-item" id="group_' +
        String(item.id) + '"><div class="row">' +
        '<h3 class="list-group-item-heading pull-left">' + item.groupName + '</h3>' +
        '<p class="list-group-item-paragraph pull-right">' + 
        moment(item.timeStart, 'X').format('h:mm A') + '-' + 
        moment(item.timeEnd, 'X').format('h:mm A') + '</p>' +
        '</div><div class="row">' +
        '<h5 class="list-group-item-heading">' + item.location + '</h5>' +
        '</div>' +
        '</a>';
    return answer;
}

function resortList(index, asc) {
    $('#items').empty();
    groups = sort(groups, index, asc);
    for (var i = 0; i < groups.length; i++) {
        $('#items').append(groupItemFormatUnselected(groups[i]));
    }
}

function initializeApp() {
    getListItems(function(response) {
        groups = response.reply;
        resortList('numMembers', 0);
    });
}

function compare(item1, item2, index) {
    if ((!item1[index] && (item1[index] !== 0)) || (!item2[index] && (item2[index] !== 0))) {
        return 0;
    }
    if (item1[index] === item2[index]) {
        return 0;
    }
    return (item1[index] < item2[index] ? -1 : 1);
}

function sort(items, index, asc) {
    var toReturn = items.sort(function(item1, item2) {
        return (asc > 0) ? compare(item1, item2, index) : -compare(item1, item2, index);
    });
    return toReturn;
}

function showMyGroups() {
    $('#items').empty();
    $('#items').append('<h3 style="text-align:center">' + 
        localStorage.getItem("userName") + '</h>');
    var numGroupListsLoaded = 0;
    var id = localStorage.getItem('userID');
    var ownedGroups = [];
    var joinedGroups = [];
    function addGroups() {
        if (ownedGroups.length > 0) {
            $('#items').append('<div class="list-group-item"><h4 class="list-group-item-heading">Groups Owned</h4></div>');
            for (var i = 0; i < ownedGroups.length; i++) {
                $('#items').append(groupItemFormatUnselected(ownedGroups[i]))
            }
        }
        if (joinedGroups.length > 0) {
            $('#items').append('<div class="list-group-item"><h4 class="list-group-item-heading">Groups Joined</h4></div>');
            for (var i = 0; i < joinedGroups.length; i++) {
                $('#items').append(groupItemFormatUnselected(joinedGroups[i]))
            }
        }
    }
    $.get(config.serverUri + '/owned?id=' + String(id), function(response) {
        numGroupListsLoaded++;
        ownedGroups = response.reply;
        if (numGroupListsLoaded === 2) {
            addGroups();
        }
    });
    $.get(config.serverUri + '/joined?id=' + String(id), function(response) {
        numGroupListsLoaded++;
        joinedGroups = response.reply;
        if (numGroupListsLoaded === 2) {
            addGroups();
        }
    });
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        initializeApp();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

if (window.localStorage.getItem("userName") === "") {
    //window.location = "login.html";
    var userID = Math.floor((Math.random() * 3) + 1);
    $.get(config.serverUri + '/users?id=' + String(userID), function(response) {
        window.localStorage.setItem("userHandle", response.reply.handle);
        window.localStorage.setItem("userID", response.reply.id);
        window.localStorage.setItem("userName", response.reply.name);
        window.localStorage.setItem("userPicture", response.reply.picture);
    });
}

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
function getListItems(callback) {
    $.get(config.serverUri + '/home', callback);
    /*var items = [
        {
            id: 0,
            name: 'Math 25',
            description: 'Math 25 study group',
            location: 'Lamont',
            timeStart: 'now',
            timeEnd: 'tomorrow'
        },
        {
            id: 1,
            name: 'Math 55',
            description: 'Math 55 study group',
            location: 'Lamont',
            timeStart: 'now',
            timeEnd: 'tomorrow'
        },
        {
            id: 2,
            name: 'CS 61',
            description: 'CS 61 study group',
            location: 'Lamont',
            timeStart: 'now',
            timeEnd: 'tomorrow'
        },
        {
            id: 3,
            name: 'SW 43',
            description: 'SW 43 study group',
            location: 'Lamont',
            timeStart: 'now',
            timeEnd: 'tomorrow'
        }
    ];
    callback(items);*/
}

function chooseGroup(id) {
    localStorage.setItem('groupID', id);
    window.location.replace('view.html');
}

function groupItemFormat(item) {
    var answer = '';
    answer += '<a href="javascript:void(0)" onclick="chooseGroup(' +
        String(item.id) +
        ')" class="list-group-item">' +
        '<h4 class="list-group-item-heading">' + item.groupName + '</h4>' +
        '<h5 class="list-group-item-heading">' + item.location + '</h5>' +
        '<p class="list-group-item-paragraph">' + 
        moment(item.timeStart, 'X').format('h:mm A') + '-' + 
        moment(item.timeEnd, 'X').format('h:mm A') + '<br>' +
        'over 9000 people attending' + '</p>' + 
        '</a>';
    return answer;
}

function initializeApp() {
    getListItems(function(response) {
        console.log(response);
        for (var i = 0; i < response.reply.length; i++) {
            $('#items').append(groupItemFormat(response.reply[i]));
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

if (window.localStorage.getItem("realname") == null) {
    window.location = "login.html";
}

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
function getListItems() {
    var items = [
        {
            name: 'Math 25',
            desc: 'Math 25 study group',
            location: 'Lamont',
            timeCreated: 'now',
            timeEnd: 'tomorrow'
        },
        {
            name: 'Math 55',
            desc: 'Math 55 study group',
            location: 'Lamont',
            timeCreated: 'now',
            timeEnd: 'tomorrow'
        },
        {
            name: 'CS 61',
            desc: 'CS 61 study group',
            location: 'Lamont',
            timeCreated: 'now',
            timeEnd: 'tomorrow'
        },
        {
            name: 'SW 43',
            desc: 'SW 43 study group',
            location: 'Lamont',
            timeCreated: 'now',
            timeEnd: 'tomorrow'
        }
    ];
    return items;
}

function initializeApp() {
    var items = getListItems();
    for (var i = 0; i < items.length; i++) {
        $('#items').append(
            '<li class="list-group-item">' +
            items[i].name + 
            '</li>');
    }
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

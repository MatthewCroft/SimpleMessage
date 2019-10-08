import { Component, OnInit } from '@angular/core';
import { Stomp } from '@stomp/stompjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor() { }

  establishConnection() {
    // Create a WebSocket connection. Replace with your hostname
    let socket = "ws://localhost:15674/ws";
    var client = Stomp.client(socket);

    // RabbitMQ Web-Stomp does not support heartbeats so disable them
    client.heartbeat.outgoing = 0;
    client.heartbeat.incoming = 0;

    client.debug = onDebug;

    // Make sure the user has limited access rights
    client.connect("guest", "guest", onConnect, onError, "vhost");

    //Start subscribing to the chat queue
    function onConnect() {
      var id = client.subscribe("/exchange/message", function(d) {
        var m = d;
        console.log(d.body);
        // console.log("username: " + m[0] + " message: " +  m[1]);
      });
      console.log('connected!!');
    }

    //Send a message to the chat queue
    function sendMsg() {
      // var msg = document.getElementById('msg').value;
      // client.send('/exchange/web/chat', { "content-type": "text/plain" }, msg);
    }

    function onError(e) {     
      console.log("STOMP ERROR", e);
    }

    function onDebug(m) {
      console.log("STOMP DEBUG", m);
    }

    client.onWebSocketClose = function onWebSocketClose(e) {
      console.log(e);
    }
  }



  ngOnInit() {
    this.establishConnection();
  }

}

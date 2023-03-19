import Input from "./input";
import "./App.css";
import Messages from "./Messages";
import React, { Component } from "react";



function giveRandomUserName() {
  const firstNames = [
    "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark",
    "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter",
    "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue",
    "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long",
    "late", "lingering", "bold", "little", "morning", "muddy", "old", "red",
    "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering",
    "withered", "wild", "black", "young", "holy", "solitary", "fragrant",
    "aged", "snowy", "proud", "floral", "restless", "divine", "polished",
    "ancient", "purple", "lively", "nameless"
  ];
  const secondNames = [
    "waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning",
    "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter",
    "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook",
    "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly",
    "feather", "grass", "haze", "mountain", "night", "pond", "darkness",
    "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder",
    "violet", "water", "wildflower", "wave", "water", "resonance", "sun",
    "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog",
    "smoke", "star"
  ];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const secondName = secondNames[Math.floor(Math.random() * secondNames.length)];
  return firstName + secondName;
}

function setRandomColorToUser() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}



class App extends Component {
  state = {
    messages: [],
    member: {
      username: giveRandomUserName(),
      color: setRandomColorToUser()
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("YOUR-CHANNEL-ID", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
    
  }

  render() {
    return (
      <div className="App">
      <div className="App-header">
        <h1>My Chat App</h1>
      </div>
      <Messages
        messages={this.state.messages}
        currentMember={this.state.member}
      />
      <Input
        onSendMessage={this.onSendMessage}
      />
    </div>
    );
  }  
}
export default App;

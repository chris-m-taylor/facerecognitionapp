import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Particles from 'react-particles-js';
import './App.css';
const Clarifai = require('clarifai');


const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}

// create clarifai object
const app = new Clarifai.App({apiKey: '140fc7357402461ab4f1c014ba102ac4'});


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: ''
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    console.log("image url is: ", this.state.imageURL);
    // Predict the contents of an image by passing in a URL.
    app.models.predict(Clarifai.COLOR_MODEL, 'https://samples.clarifai.com/metro-north.jpg')
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageURL={this.state.imageURL}/>
        
      </div>
    );
  }
}

export default App;

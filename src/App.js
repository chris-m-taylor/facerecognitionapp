import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation.js';
import SignIn from './components/SignIn/SignIn.js';
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
      imageURL: 'https://samples.clarifai.com/face-det.jpg',
      box: {},
      // keeps track of where we are on the page
      route: 'signin',
    }
  }

  calculateFaceLocation = (data) => {
    //response.outputs[0].data.regions[0].region_info.bounding_box
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width); //since this is a string and we want to do calculations with it
    const height = Number(image.height);
    // return an object that will change the box state
    // the object will tell where to draw the lines on the image
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    // Predict the contents of an image by passing in a URL.
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => {
      console.log(err);
    });
  }

  onRouteChange = (route) => {
    this.setState({route: route});

  }

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        
        <Navigation onRouteChange={this.onRouteChange}/>
        {/* If state is signin, return signing, else return the other stuff */}
        { this.state.route === 'signin' ? 
          <SignIn onRouteChange={this.onRouteChange}/>
            :
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>
          </div>
        }
        
      </div>
    );
  }
}

export default App;

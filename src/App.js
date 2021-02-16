import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';
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
      route: 'signin', // keeps track of where we are on the page
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }

    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  componentDidMount() {
    fetch('http://localhost:3000', {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }

    })
      .then(response => response.json())
      .then(data => console.log(data));
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
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        });
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => {
      console.log(err);
    });
  }
  // routing
  onRouteChange = (route) => {
    if (route === 'signout')
    this.setState({isSignedIn: false});
    else if (route === 'home')
      this.setState({isSignedIn: true})

    this.setState({route: route});
  }

  render() {
    const {isSignedIn, imageURL, route, box} = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {/* If state is signin, return signin, else return the other stuff */}
        { (route === 'home') 
        ? 
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageURL={imageURL}/>
          </div>
        :
          (route === 'signin') ?
            <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          :
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          
        }
        
      </div>
    );
  }
}

export default App;

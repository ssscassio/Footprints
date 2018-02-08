import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import TimeAgo from 'react-timeago';
import brStrings from 'react-timeago/lib/language-strings/pt-br';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {googleProvider, auth, facebookProvider, db} from './fire.js';
import './App.css';

const USER_KEY = 'user_key';

const formatter = buildFormatter(brStrings);

const Comp = ({ text, photoURL }) => <div className="PhotoContainer"><img className="Photo" alt={text} src={photoURL}/></div>;

class App extends Component {
  state = {
    user: null,
    data: null
  }

  constructor(){
    super();

    this.googleLogin = this.googleLogin.bind(this);
    this.facebookLogin = this.facebookLogin.bind(this);
    this.logout = this.logout.bind(this);
    this.renderMap = this.renderMap.bind(this);
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if(user) {
        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.setState({user: user});
        db.ref('users').child(user.uid).once('value')
          .then(snap => {
            this.setState({data: snap.val()});
          })
          .catch(err => console.log(err));
      }
      else {
        window.localStorage.removeItem(USER_KEY);
        this.setState({user: null, data: null});
      }
    });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({user: null});
      })
      .catch(err => console.log(err));
  }

  googleLogin() {
    auth.signInWithPopup(googleProvider)
      .then(result => {
        const user = result.user;
        this.setState({user: user});
      })
      .catch(err => console.log(err));
  }

  facebookLogin() {
    auth.signInWithPopup(facebookProvider)
      .then(result => {
        const user = result.user;
        this.setState({user: user});
      })
      .catch(err => console.log(err));
  }

  renderMap() {
    const coords = this.state.data ? this.state.data.location.coords : {latitude: 0, longitude: 0};
    const photoURL = this.state.user.providerData[0] ? this.state.user.providerData[0].photoURL : this.state.user.photoURL;
    
    return (
      <div className="Map">
        <GoogleMap
          // className="Map"
          bootstrapURLKeys={{key: "AIzaSyBoxI3Bq6jg_R0DsHbpwFtCmAH1DXiuo3o"}}
          // apiKey={"AIzaSyBoxI3Bq6jg_R0DsHbpwFtCmAH1DXiuo3o"}
          center={[coords.latitude, coords.longitude]}
          zoom={18}
        >
        <Comp
            lat={coords.latitude}
            lng={coords.longitude}
            text={this.state.user.displayName}
            photoURL={photoURL}
          />
        </GoogleMap>
      </div>
    );
  }

  render() {
    const battery = this.state.data ? this.state.data.battery : { level: -1, charging: false };
    const timestamp = this.state.data ? this.state.data.location.timestamp : new Date().getTime();


    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Footprints</h1>
        </header>
        {this.state.user ? 
          <div className="MapScreen">
            <button className="LogoutBtn" onClick={this.logout}>Log out</button>
            <div><span><b>Última atualização: </b></span><TimeAgo date={timestamp} formatter={formatter}/></div>
            <div><span><b>Nível de bateria: </b></span>{battery.level === -1 ? "?" : Math.floor(battery.level*100)}%</div>
            {this.renderMap()}
          </div>
          : 
          <div className="LoginBtns">
            <button className="GoogleBtn" onClick={this.googleLogin}>Google Login</button>
            <button className="FacebookBtn" onClick={this.facebookLogin}>Facebook Login</button>
          </div>
        }
      </div>
    );
  }
}

export default App;

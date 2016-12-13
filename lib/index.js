
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
import style from '../scss/index.scss';
// import style from '../scss/reset.scss';


class WelcomePage extends React.Component {
  constructor() {
    super();
    this.state = {
      location: '',
      weather: null,
      disabled: true,
    };
  }

  componentDidMount() {
    this.checkLocalStorage();
    this.getWeather();
  }

  getWeather() {
    $.get(this.props.source, (results) => {
      const filteredLocation = results.filter((w) => {
        return w.location === this.state.location.toLowerCase().replace(' ', '-');
      });
      this.setState({ weather: filteredLocation });
      if (filteredLocation.length) {
        localStorage.setItem('location', this.state.location);
      }
      this.clearInputFields();
      this.toggleDisable();
    });
  }

  setInputLocation(e) {
    const userInput = e.target.value;
    this.setState({ location: userInput });
  }

  toggleDisable() {
    if (this.state.location === '') {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  }

  checkLocalStorage() {
    const storedLocation = localStorage.getItem('location');
    this.setState({ location: storedLocation });
  }

  clearInputFields() {
    this.setState({ location: '' });
  }

  checkEnter(e) {
    if (e.key === 'Enter' && this.state.location !== '') {
      this.getWeather();
    }
  }

  // extremeWeatherAlert() {
  //   if (this.props.weatherType.scale === 3) {
  //     console.log('severe weather!');
  //   //   return (
  //   //     <div>
  //   //     <p>CAUTION. SEVERE WEATHER WARNING!</p>
  //   //     </div>
  //   // );
  //   }
  // }

  render() {
    const locationForm = (

      <div>
        <h1>Oh hello, WELCOME</h1>
        <h2> You must be here for the weather...</h2>
        <input
          className="location-input"
          value={this.state.location}
          placeholder="location"
          onChange={(e) => {
            this.setInputLocation(e);
            this.toggleDisable(e);
          }}
          onKeyDown={(e) => {
            this.checkEnter(e);
          }}
        >
        </input>
        <button
          className="location-button"
          disabled={this.state.disabled}
          onClick={(e) => {
            this.getWeather(e);
          }}
        >Search</button>
        <WeatherForecast weather={this.state.weather} />
      </div>
    );
    return locationForm;
  }
}

class WeatherDisplay extends React.Component {
  constructor() {
    super();
  }

  render() {
    let currentHour = new Date().getHours();
    let currentTemp = this.props.hourly.timeBreakDown[currentHour - 1]['hour' + currentHour].temp;
    return (
      <div className={this.props.weatherType.type}>
        <div className="weather-cards">
          <section className="weather-on-card">
            <p className="place">{this.props.location}</p>
            <p className="type">{this.props.weatherType.type}</p>
            <p className="chance"> percent chance: {this.props.weatherType.chance}</p>
            <p className="scale">severity scale: {this.props.weatherType.scale}</p>
            <p className="date">date: {this.props.date}</p>
            <p className="high-temp">high temp: {this.props.temp.high}</p>
            <p className="low-temp">low temp: {this.props.temp.low}</p>
            <p className="weather-summary">Today: {this.props.weatherType.type},
          it is currently {currentTemp}, the high will be {this.props.temp.high}.</p>
          </section>
        </div>
      </div>
    );
  }
}


class WeatherForecast extends React.Component {
  constructor() {
    super();
  }
  render() {
    if (!this.props.weather) { return null; }
    if (this.props.weather.length == 0) {
      return (
        <div>
          <p className="invalid-message">
          Sorry, that location is unavailable!
          Maybe you should try a place like San Diego? <br />
          What about San Francisco? Maybe Castle Rock? Or possibly Denver?
          </p>
        </div>
      );
    } else {
      return (
        <div>
      {this.props.weather.map((card, i) =>
        <div className="display-forecast" key={i} >
          <WeatherDisplay {...card} />
        </div>
      )}
        </div>
      );
    }
  }
}

ReactDOM.render(<WelcomePage source="http://weatherly-api.herokuapp.com/api/weather" />, document.getElementById('welcome-page'));

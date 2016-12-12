
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
import style from '../scss/main.scss';
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


  getWeather() {
    $.get(this.props.source, (results) => {
      let filteredLocation = results.filter((w) => {
        return w.location === this.state.location;
      });
      this.setState({ weather: filteredLocation }, localStorage.setItem('location', this.state.location));
      this.clearInputFields();
    });
  }

  checkLocalStorage() {
    let storedLocation = localStorage.getItem('location');
    this.setState({ location: storedLocation });
  }

  clearInputFields() {
    this.setState({ location: '' });
  }

  toggleDisable(e) {
    const userInput = e.target.value;
    this.setState({ location: userInput });
    if (userInput === '') {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  }


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
            this.setState({ location: event.target.value });
            this.toggleDisable(e);
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
  componentDidMount() {
    this.checkLocalStorage();
    this.getWeather();
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
      <div>
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
    if (!this.props.weather) {
      return (
        <div>
          <p className="location-message">
          Please enter a location
          </p>
        </div>
        );
    }
    console.log(this.props.weather);
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


ReactDOM.render(<WelcomePage source="http://weatherly-api.herokuapp.com/api/weather" />, document.getElementById('welcome-page'));

'use strict';

const wTypes = {
  CYCLING: 'cycling',
  RUNNING: 'running',
};

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor (coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  _setDescription() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type.at(0).toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDay()}`;
  }
}

class Running extends Workout {
  type = wTypes.RUNNING;

  constructor (coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() { // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = wTypes.CYCLING;

  constructor (coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() { // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 13;

  constructor () {
    // get user position
    this._getPosition();

    // set handlers
    // event handler function's this is the DOMelement! Bind it...
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    // get localStorage data
    this._getLocalStorage();
  }

  _getPosition () {
    if (!navigator.geolocation) return;
    // callback is called as a normal function call!!! We need to bind it...
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
      alert('Could not fetch your position.');
    });
  }

  _loadMap(pos) {
    const { latitude, longitude } = pos.coords;
    const coords = [latitude, longitude]

    // L --> namespace for Leaflet
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel); // 13 is the zoom level
    const tilerURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    L.tileLayer(tilerURL, { attribution }).addTo(this.#map);

    // handle clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach((workout) => {
      this._renderWorkout(workout);
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputCadence.value = inputDistance.value = inputElevation.value = inputDuration.value = '';
    form.style.display = 'none';
    form.classList.add('hidden'); // this also triggers animation
    setTimeout(() => form.style.display = 'grid', 1000)
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const areInputsValid = (...inputs) => inputs.every((input) => Number.isFinite(input) && input > 0);
    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value; // type coercion to number
    const duration = +inputDuration.value; // type coercion to number
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === wTypes.RUNNING) {
      const cadence = +inputCadence.value;
      if (!areInputsValid(distance, duration, cadence)) return alert('Inputs must be positive numbers.')
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === wTypes.CYCLING) {
      const elevation = +inputElevation.value;
      if (!areInputsValid(distance, duration, elevation)) return alert('Inputs must be positive numbers.')
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    this.#workouts.push(workout);
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    this._hideForm();
    this._setLocalStorage();
  }

  _renderWorkoutMarker(w) {
    L.marker(w.coords)
      .addTo(this.#map)
      .bindPopup(L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${w.type}-popup`,
      }))
      .setPopupContent(`${w.type === wTypes.RUNNING ? '🏃‍♂️' : '🚴‍♀️'} ${w.description}`)
      .openPopup();
  }

  _renderWorkout(w) {
    let html = `
      <li class="workout workout--${w.type}" data-id="${w.id}">
        <h2 class="workout__title">${w.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            w.type === wTypes.RUNNING ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${w.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${w.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (w.type === wTypes.RUNNING) {
      html = html + `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${w.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${w.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `;
    }

    if (w.type === wTypes.CYCLING) {
      html = html + `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${w.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${w.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li> 
      `;
    }

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find((w) => w.id === workoutEl.dataset.id);
    console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: { duration: 1 },
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts))
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;
  }

  // public
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
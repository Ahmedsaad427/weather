var findBtn = document.getElementById("findBtn");
var searchInput = document.getElementById("searchInput");

async function searchWeather(city) {
  try {
    var res = await fetch(`https://api.weatherapi.com/v1//forecast.json?key=dc0fd85b50f84e85be9143254240806&q=${city}&days=3`);
    var data = await res.json();
    displayWeather(data.location, data.current, data.forecast);
  } catch (err) {
    document.querySelector(".card-group").innerHTML = `<p class="alert alert-danger text-center fs-5 mx-auto">There is a problem fetching the data<p>`;
  }
}

searchInput.addEventListener("input", function(e) {
  if (e.target.value.length >= 3) {
    searchWeather(e.target.value);
  }
});

findBtn.addEventListener("click", function(e) {
  e.preventDefault();
  if (searchInput.value.length >= 3) {
    searchWeather(searchInput.value);
  }
});

function displayWeather(location, current, forecast) {
  var WeatherContent = "";
  WeatherContent += `<div class="today card">
    <div class="card-header d-flex justify-content-between">
      <div class="day">${getDayName(forecast.forecastday[0].date)}</div>
      <div class="date">${getSpecialDateFormat(forecast.forecastday[0].date)}</div>
    </div>
    <div class="card-body">
      <h5 class="location">${location.name}</h5>
      <div class="degree">
        <h2 class="deg-value text-white">${current.temp_c}°C</h2>
        <img class="deg-img" src="https:${current.condition.icon}" alt="">
      </div>
      <div class="deg-desc">${current.condition.text}</div>
    </div>
    <div class="card-footer d-flex justify-content-between border-0">
      <span><img src="icon-umberella.png" alt="umberella"> ${forecast.forecastday[0].day.daily_chance_of_rain}%</span>
      <span><img src="icon-wind.png" alt="wind"> ${current.wind_kph} km/h</span>
      <span><img src="icon-compass.png" alt="compass"> ${current.wind_dir}</span>
    </div>
  </div>`;

  for (var i = 1; i < forecast.forecastday.length; i++) {
    WeatherContent += `<div class="card text-center">
      <div class="card-header">
        <div class="day">${getDayName(forecast.forecastday[i].date)}</div>
      </div>
      <div class="card-body">
        <div class="degree">
          <img class="deg-img" src="https:${forecast.forecastday[i].day.condition.icon}" alt="">
          <h5 class="max-deg-value text-white">${forecast.forecastday[i].day.maxtemp_c}°C</h5>
          <h6 class="min-deg-value">${forecast.forecastday[i].day.mintemp_c}°C</h6>
          <div class="deg-desc">${forecast.forecastday[i].day.condition.text}</div>
        </div>
      </div>
    </div>`;
  }

  document.querySelector(".card-group").innerHTML = WeatherContent;
}

function getDayName(dateString) {
  var date = new Date(dateString);
  var dayIndex = date.getDay();
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

function getSpecialDateFormat(dateString) {
  var date = new Date(dateString);
  var monthIndex = date.getMonth();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var day = date.getDate()
  return `${day} ${months[monthIndex]}`;
}

var cachedLocation = JSON.parse(localStorage.getItem("userLocation"));

if (cachedLocation) {
  searchWeather(cachedLocation.latitude + "," + cachedLocation.longitude);
} else {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        var location = {
          latitude: latitude,
          longitude: longitude,
        }

        localStorage.setItem("userLocation", JSON.stringify(location));
        searchWeather(latitude + "," + longitude);
      },
      function(error) {
        console.log(error);
        searchWeather("cairo");
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    searchWeather("cairo");
  }
}

var startButton = document.getElementById('start-btn');
var unitsField = document.getElementById('units');
var currentCityName = '';
var userCities = [];



function lookupWeatherByCity(city) {

   var cityField = document.getElementById('cityname');


   if (typeof city === "string" && city != '') {
      currentCityName = city;
      cityField.value = city;
   }
   else
      currentCityName = cityField.value;


   if (currentCityName != '') {
      //store the city alleyways in upper case, no matter how the user insert this city name 
      currentCityName = currentCityName.toLocaleUpperCase();
      //add event to refresh the weather wiht changed unit
      unitsField.addEventListener('change', lookupWeatherByCity);
      var unit = unitsField.value;

      //change this wiht your app id
      var appid = '3267058342c6ea66b59e354428131016';

      //define the api url
      var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + currentCityName + '&appid=' + appid + '&units=' + unit;


      //create object for api call
      var apiResultText = "";
      fetch(apiUrl
      ).then(function (res) {
         if (res.status == 200)
            addCity(currentCityName);
         else
            apiResultText = res.statusText + " (" + res.status + ")";

         return res.json()
      }
      ).then(function (response) {
         showWeatherDetails(response, appid, unit)
         showForecast(currentCityName, appid, unit);
      }).catch((error) => {
         document.getElementById("MessageView").innerText = "Api call Error -> " + apiResultText + " -> " + error;
         showHideWeatherResult(false);
      });

   }
}

function showWeatherDetails(data, appid, unit) {


   if (data != "undefined" && data != null) {
      //store the city weahter data in the local storage with key the city name and value api result (json text) 
      localStorage[currentCityName] = JSON.stringify(data);
      //to be sure parse the data as json 

      var cityWeather = data;
      document.getElementById('w_cityname').innerText = cityWeather.name;

      //show result div
      showHideWeatherResult(true);
      /**
       * According to API description is the date filed contains UNIX format datetime, which is in seconds.
       * https://openweathermap.org/current#data
       * To create correct datetime by JavaScript function, we need to convert the information to milliseconds by multiply by 1000
       */
      var weatherTimeStamp = (cityWeather.dt * 1000);
      document.getElementById('w_date').innerText = new Date(weatherTimeStamp);
      document.getElementById('w_temperature').innerText = cityWeather.main.temp + (unit == "imperial" ? " F°" : " C°");
      document.getElementById('w_windspeed').innerText = cityWeather.wind.speed + ' MPH';
      document.getElementById('w_humidity').innerText = cityWeather.main.humidity + " %";

      var icon_URL = "https://openweathermap.org/img/wn/" + cityWeather.weather[0].icon + "@2x.png";
      var wetherIcon = document.getElementById('current_icon');
      wetherIcon.setAttribute("src", icon_URL);
      wetherIcon.setAttribute("alt", "weather icon");


      var lon = cityWeather.coord.lon;
      var lat = cityWeather.coord.lat;

      //{"lat":34.257,"lon":-85.1647,"date_iso":"2022-08-07T12:00:00Z","date":1659873600,"value":11.04}
      queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + appid + "&lat=" + lat + "&lon=" + lon;

      var apiResultText = "";
      fetch(queryURL
      ).then(function (res) {
         apiResultText = res.statusText + " (" + res.status + ")";
         return res.json()
      }
      ).then(function (response) {
         //response = response.json()
         var uvIndex = response.value;
         var uvColor = "";
         if (uvIndex < 3) { uvColor = "green"; }
         else if (uvIndex < 6) { uvColor = "yellow"; }
         else if (uvIndex < 8) { uvColor = "orange"; }
         else if (uvIndex < 11) { uvColor = "red"; }
         else { uvColor = "violet"; }
         document.getElementById('w_UV').innerText = uvIndex;
         document.getElementById('w_UV').setAttribute("style", "background-color: " + uvColor);
      }).catch((error) => {
         document.getElementById("MessageView").innerText = "Api call Error -> " + apiResultText + " -> " + error;
         showHideWeatherResult(false);

      });


      document.getElementById('weathertable').style.visibility = 'visible';
   }
}
function showForecast(city, APIKey, unit) {

   var currentDate = new Date();
   var foracstDate;
   var dateFiff = 0;
   var foracstDay = 0;

   queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=" + unit;
   fetch(

      queryURL

   ).then(function (res) {
      return res.json()
   })
      .then(function (response) {

         response.list.forEach(function (item) {

            //return to break the foreach loop 
            if (foracstDay >= 5)
               return;

            foracstDate = new Date(item.dt * 1000);
            dateFiff = Math.round((foracstDate.getTime() - currentDate.getTime()) / (3600 * 1000));

            //console.log('DateFiff = '+ DateFiff + ' | currentDate = ' + currentDate + ' | ForacstDate = ' + ForacstDate);

            //if the time different is more than 24 hours, show forcast
            if (dateFiff >= 21) {
               currentDate = foracstDate;

               var icon = item.weather[0].icon;
               var iconURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
               document.getElementById("forcast-icon-" + foracstDay).setAttribute("src", iconURL);

               var dateStr = foracstDate.toLocaleDateString();
               document.getElementById("forcast-date-" + foracstDay).innerText = dateStr;

               document.getElementById("forcast-temp-" + foracstDay).innerText = 'Temp: ' + item.main.temp + (unit == "imperial" ? " F°" : " C°")
               document.getElementById("forcase-wind-" + foracstDay).innerText = 'Wind: ' + item.wind.speed + ' MPH';
               document.getElementById("forcase-humidity-" + foracstDay).innerText = 'Humidity: ' + item.main.humidity + ' %';

               foracstDay++;

            }


         });
      });
}

function addCity(city) {

   if (city === undefined || city === '')
      return;

   var CityDiv;
   // find existing city and remove from DOM and array
   for (var i = 0; i < userCities.length; i++) {
      if (userCities[i] === city) {
         CityDiv = document.getElementById(city);
         if (CityDiv != null)
            CityDiv.remove();
         userCities.splice(i, 1);
      }
   }
   // add city to front of array
   userCities.splice(0, 0, city);

   //userCities.sort();

   // newDiv and prepend to DOM
   newDiv = buildCityDiv(city);
   document.getElementById("cities").appendChild(newDiv);

   // save updated user cities array to local storage
   localStorage.setItem("cities", JSON.stringify(userCities));
}

function showRetrievedCities() {
   var citiesStr = localStorage.getItem("cities");
   if (citiesStr != null) {
      userCities = JSON.parse(citiesStr);
   }
   //userCities.sort();
   // iterate through array, building divs for each city
   var cityName = "";
   for (var i = 0; i < userCities.length; i++) {
      cityName = userCities[i];
      if (typeof cityName === "string")
         document.getElementById("cities").appendChild(buildCityDiv(userCities[i]));
   }

}
function buildCityDiv(city) {
   var newDiv = document.createElement("div");
   newDiv.innerText = city;
   newDiv.setAttribute("id", city);
   newDiv.setAttribute("class", "city-div");
   newDiv.addEventListener('click', function () { lookupWeatherByCity(city); });
   return newDiv;
}
function showHideWeatherResult(showDiv) {

   const collection = document.querySelectorAll(".ResultView");
   //show or hide result div
   collection.forEach(function (view) {
      view.style.visibility = showDiv ? 'visible' : 'hidden';
   });
   document.getElementById("MessageView").style.display = showDiv ? 'none' : 'block';

}



// adding event to search button. 
startButton.addEventListener('click', lookupWeatherByCity);
showRetrievedCities();

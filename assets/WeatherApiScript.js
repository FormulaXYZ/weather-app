var startButton = document.getElementById('start-btn');
var UnitsField = document.getElementById('units');
var CurrentCityName = '';
var userCities = [];



function LookupWeatherByCity(city) {

   var cityField = document.getElementById('cityname');


   if (typeof city === "string" && city != '') {
      CurrentCityName = city;
      cityField.value = city;
   }
   else
      CurrentCityName = cityField.value;


   if (CurrentCityName != '') {
      //store the city alleyways in upper case, no matter how the user insert this city name 
      CurrentCityName = CurrentCityName.toLocaleUpperCase();

      addCity(CurrentCityName);

      var unit = document.getElementById('units').value;
      //change this wiht your app id
      var appid = '3267058342c6ea66b59e354428131016';

      //define the api url
      var ApiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + CurrentCityName + '&appid=' + appid + '&units=' + unit;


      //create object for api call
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", encodeURI(ApiUrl), true);
      xhttp.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
            // call funtion to show result:
            ShowWeatherDetails(xhttp.responseText, appid, unit)
            showForecast(CurrentCityName, appid, unit);
         }
      };
      //fire api call
      xhttp.send();
   }
}


function ShowWeatherDetails(data, appid, unit) {
   /**This function shows the weather date in a table. It stores the REST api call result in the local storage for further usage, which is not implemented now.
    * the paramter "data" Contains the REST api result as JSO text. Here is an example, how the result looks like.
    * 
    *
  {
  "coord":{
     "lon":16.3721,
     "lat":48.2085
  },
  "weather":[
     {
        "id":800,
        "main":"Clear",
        "description":"clear sky",
        "icon":"01d"
     }
  ],
  "base":"stations",
  "main":{
     "temp":34.63,
     "feels_like":35.48,
     "temp_min":33.16,
     "temp_max":36.05,
     "pressure":1011,
     "humidity":36
  },
  "visibility":10000,
  "wind":{
     "speed":7.2,
     "deg":150
  },
  "clouds":{
     "all":0
  },
  "dt":1658761603,
  "sys":{
     "type":2,
     "id":2037452,
     "country":"AT",
     "sunrise":1658719245,
     "sunset":1658774460
  },
  "timezone":7200,
  "id":2761369,
  "name":"Vienna",
  "cod":200
}
    */

   if (data != "undefined" && data != '') {
      //store the city weahter data in the local storage wiht key the city name and value api result (json text) 
      localStorage[CurrentCityName] = JSON.stringify(data);
      //to be sure parse the data as json 

      var CityWeather = JSON.parse(data);
      document.getElementById('w_cityname').innerText = CityWeather.name;

      /**
       * According to API description is the date filed contains UNIX format datetime, which is in seconds.
       * https://openweathermap.org/current#data
       * To create correct datetime by JavaScript function, we need to convert the information to milliseconds by multiply by 1000
       */
      var WeatherTimeStamp = (CityWeather.dt * 1000);
      document.getElementById('w_date').innerText = new Date(WeatherTimeStamp);
      document.getElementById('w_temperature').innerText = CityWeather.main.temp + (unit == "imperial" ? " F°" : " C°");
      document.getElementById('w_windspeed').innerText = CityWeather.wind.speed + ' MPH';
      document.getElementById('w_humidity').innerText = CityWeather.main.humidity + " %";

      var icon_URL = "http://openweathermap.org/img/wn/" + CityWeather.weather[0].icon + "@2x.png";
      var WetherIcon = document.getElementById('current_icon');
      WetherIcon.setAttribute("src", icon_URL);
      WetherIcon.setAttribute("alt", "weather icon");


      var lon = CityWeather.coord.lon;
      var lat = CityWeather.coord.lat;

      //{"lat":34.257,"lon":-85.1647,"date_iso":"2022-08-07T12:00:00Z","date":1659873600,"value":11.04}
      queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + appid + "&lat=" + lat + "&lon=" + lon;

      fetch(queryURL
      ).then(function (res) {
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
         console.log("UV Index call failed");
      });


      document.getElementById('weathertable').style.visibility = 'visible';
   }
}
function showForecast(city, APIKey, unit) {

   var currentDate = new Date();
   var ForacstDate;
   var DateFiff = 0;
   var ForacstDay = 0;

   queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey + "&units=" + unit;
   fetch(

      queryURL

   ).then(function (res) {
      return res.json()
   })
      .then(function (response) {

         response.list.forEach(function (item) {

            //return to break the foreach loop 
            if (ForacstDay >= 5)
               return;

            ForacstDate = new Date(item.dt * 1000);
            DateFiff = Math.round((ForacstDate.getTime() - currentDate.getTime()) / (3600 * 1000));

            //console.log('DateFiff = '+ DateFiff + ' | currentDate = ' + currentDate + ' | ForacstDate = ' + ForacstDate);

            //if the time different is more than 24 hours, show forcast
            if (DateFiff >= 21) {
               currentDate = ForacstDate;

               var icon = item.weather[0].icon;
               var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
               document.getElementById("forcast-icon-" + ForacstDay).setAttribute("src", iconURL);

               var dateStr = ForacstDate.toLocaleDateString();
               document.getElementById("forcast-date-" + ForacstDay).innerText = dateStr;

               document.getElementById("forcast-temp-" + ForacstDay).innerText = 'Temp: ' + item.main.temp + (unit == "imperial" ? " F°" : " C°")
               document.getElementById("forcase-wind-" + ForacstDay).innerText = 'Wind: ' + item.wind.speed + ' MPH';
               document.getElementById("forcase-humidity-" + ForacstDay).innerText = 'Humidity: ' + item.main.humidity + ' %';

               ForacstDay++;

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

function ShowRetrievedCities() {
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
   newDiv.addEventListener('click', function () { LookupWeatherByCity(city); });
   return newDiv;
}



// adding event to search button. 
startButton.addEventListener('click', LookupWeatherByCity);
ShowRetrievedCities();

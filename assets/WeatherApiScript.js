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





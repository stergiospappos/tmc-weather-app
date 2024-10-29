1- list all the countries

when the user click on one of the countries do api call that take give the lang and lat for that country/city

url: http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=5&appid={key}

2- do api call to get the current weather using the lang and lat that you get from the previous api request!

url: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lang}&appid={key}

3- provide defulat city weather, so when the user open it for the first time he can find the current weather of the defulat city/country

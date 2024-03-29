"use strict";

const dayEl = document.querySelector(".default_day");
const dateEl = document.querySelector(".defaul_date");
const formEl = document.querySelector("form");
const inputEl = document.querySelector(".input_field");
const btnEl = document.querySelector(".btn_search");
const iconContainer = document.querySelector(".icons");
const contentSectionEl = document.querySelector(".content_section");

const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");


const API = "5cba9041b30635d6f8bd2e202330cec2";


const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;


let month = day.toLocaleString("default", { month: "long" });
let date = day.getDate();
let year = day.getFullYear();
dateEl.textContent = date + " " + month + " " + year;


btnEl.addEventListener("click", (e) => {
  e.preventDefault();

  if (inputEl.value !== "") {
    const Search = inputEl.value;
    inputEl.value = "";
    findLocation(Search);
  } else {
    alert("Please Enter City, Country Name!");
  }
});


async function findLocation(name) {
  try {
    iconContainer.innerHTML = "";
    dayInfoEl.innerHTML = "";
    listContentEl.innerHTML = "";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
    const data = await fetch(API_URL);
    const result = await data.json();

    console.log(result);

    if (result.cod !== "404") {
      const displayImageContent = imgContent(result);

      const sideContent = displaySideContent(result);

      displayForeCast(result.coord.lat, result.coord.lon);

      setTimeout(() => {
        iconContainer.insertAdjacentHTML("afterbegin", displayImageContent);
        dayInfoEl.insertAdjacentHTML("afterbegin", sideContent);

        iconContainer.classList.add("fadeIn");
        dayInfoEl.classList.add("fadeIn");
        listContentEl.classList.add("fadeIn");
      }, 1500);
    } else {
      const Message = `
      <h2 class="weather_temp">${result.cod}</h2>
      
      <h3 class="cloudtxt">${result.message}</h3>`;
      iconContainer.insertAdjacentHTML("afterbegin", Message);
    }
  } catch (error) {}
}

function imgContent(resultData) {
  return `<img
  src="https://openweathermap.org/img/wn/${resultData.weather[0].icon}@4x.png"
  alt=""/>
  <h2 class="weather_temp">${
    Math.round(resultData.main.temp - 275.15) + "°C"
  }</h2>
  <h3 class="cloudtxt">${resultData.weather[0].description}</h3>`;
}

function displaySideContent(data) {
  return `    <div class="content">
                        <p class="title">NAME</p>
                        <span class="value-1">${data.name}</span>
                       </div>
                        <div class="content">
                            <p class="title">TEMP</p>
                            <span class="value">${
                              Math.round(data.main.temp - 275.15) + "°C"
                            }</span>
                          </div>
                          <div class="content">
                            <p class="title">HUMIDITY</p>
                            <span class="value">${data.main.humidity} %</span>
                          </div>
                          <div class="content">
                            <p class="title">WIND SPEED</p>
                          <span class="value">${data.wind.speed} Km/h</span>
                        </div>`;
}

async function displayForeCast(lat, long) {
  const foreCast_ApI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
  const data = await fetch(foreCast_ApI);
  const result = await data.json();


  const uniqueForecastDays = [];
  const fiveDaysForecast = result.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      return uniqueForecastDays.push(forecastDate);
    }
  });

  fiveDaysForecast.forEach((content, indx) => {
    if (indx <= 3) {
      listContentEl.insertAdjacentHTML("afterbegin", foreCast(content));
    }
  });

  console.log(fiveDaysForecast);
}

function foreCast(frContent) {

  const day = new Date(frContent.dt_txt);
  const dayName = days[day.getDay()];
  const splitDay = dayName.split("", 3);
  const JoinDay = splitDay.join("");

  return `<li>
            <img
              src="https://openweathermap.org/img/wn/${
                frContent.weather[0].icon
              }@4x.png"
              alt=""
              class="weather_img_icon"
            />
            <span>${JoinDay}</span>
            <span class="day_tem">${
              Math.round(frContent.main.temp - 275.15) + "°C"
            }</span>
          </li>`;
}

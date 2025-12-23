let countries = [];
const countriesContainer = document.querySelector(".countries");
const inputField = document.getElementById("input");
const option = document.getElementById("option");
const modeSwitch = document.getElementById("mode-switch");
const countryDetails = document.getElementById("country-details");

if (modeSwitch) {
  modeSwitch.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    modeSwitch.src = document.body.classList.contains("dark-mode")
      ? "images/light-mode.png"
      : "images/dark-mode.png";
  });
}

if (countriesContainer) {
  async function fetchData() {
    try {
      const res = await fetch("data.json");
      const data = await res.json();
      if (data) {
        countries = data;
        renderCountries(countries);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function renderCountries(data) {
    countriesContainer.innerHTML = data
      .map(
        (country) => `<div class="country" data-name="${country.name}">
        <div style="background-image: url('${country.flag}')"></div>
        <h4>${country.name}</h4>
        <span>Population: ${country.population.toLocaleString()}</span>
        <span>Region: ${country.region}</span>
        <span>Capital: ${country.capital}</span>
      </div>`
      )
      .join("");

    document.querySelectorAll(".country").forEach((card) => {
      card.addEventListener("click", () => {
        const selectedName = card.dataset.name;
        localStorage.setItem("selectedCountry", selectedName);
        window.location.href = "country.html";
      });
    });
  }

  fetchData();
}
if (inputField) {
  inputField.addEventListener("input", (country) => {
    const value = inputField.value.trim();
    if (value === "") {
      renderCountries(countries);
    } else if (value && countries) {
      option.value = "All";
      country = countries.filter((item) => {
        return item.name.toLowerCase() === value;
      });
      renderCountries(country);
    }
  });
}
if (option) {
  option.addEventListener("change", () => {
    if (option.value === "All") {
      renderCountries(countries);
    } else {
      inputField.value = "";
      const filtred = countries.filter(
        (country) => country.region === option.value
      );
      renderCountries(filtred);
    }
  });
}

if (countryDetails) {
  const selectedCountry = localStorage.getItem("selectedCountry");
  async function showDetails() {
    try {
      const res = await fetch("data.json");
      const data = await res.json();
      const country = data.find((c) => c.name === selectedCountry);

      let borderCountries = "No border countries";
      if (country.borders && country.borders.length > 0) {
        borderCountries = country.borders
          .map((code) => {
            const borderCountry = data.find((c) => c.alpha3Code === code);
            return borderCountry ? borderCountry.name : code;
          })
          .join(", ");
      }

      if (country) {
        countryDetails.innerHTML = `
        <div>
        <img src="${country.flag}"/>
        </div>
        <div>
        <h3>${country.name}</h3>
        <div class="infos">
        <span><strong>Native Name :</strong> ${country.nativeName}</span>
        <span><strong>Population :</strong> ${country.population}</span>
        <span><strong>Region :</strong> ${country.region}</span>
        <span><strong>Sub Region :</strong> ${country.subregion}</span>
        <span><strong>Capital :</strong> ${country.capital}</span>
        <span><strong>Top Level Domain :</strong> ${
          country.topLevelDomain
        }</span>
        <span><strong>Currencies :</strong> ${country.currencies.map(
          (cur) => cur.name
        )}</span>
        <span><strong>Languages :</strong> ${country.languages.map(
          (lan) => lan.name
        )}</span>
        <span><strong>Borders :</strong> ${borderCountries}</span>
        </div>
        </div>
        `;
      }
    } catch (error) {
      console.error(error);
    }
  }
  showDetails();
}

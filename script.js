// // declare element variables
const baseCurrency = document.querySelector("#base-currency");
const targetCurrency = document.querySelector("#target-currency");
const amount = document.querySelector("#amount");
const convertedAmount = document.querySelector("#converted-amount");
const saveButton = document.querySelector("#save-favorite");
const historyButton = document.querySelector("#historical-rates");
const historicalRate = document.createElement("p");

// declare variables for currency conversion
let fromCurrency = "";
let toCurrency = "";
let currencyAmount = parseFloat(amount.value);
// // declare header for API access
let myHeaders = new Headers();
myHeaders.append("apikey", "HDEc6UGTZOU05ozIOLDw4U36CjxiA8kL");

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

// read local storage and create favorite buttons
window.addEventListener("DOMContentLoaded", () => {
  for (i = 0; i < localStorage.length; i++) {
    const newFavorite = document.createElement("button");
    newFavorite.setAttribute("class", "favorite-button");
    newFavorite.textContent = localStorage.key(i);
    document.querySelector("#favorite-currency-pairs").appendChild(newFavorite);
  }
  let favoriteButtons = document.querySelectorAll(".favorite-button");
  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let pair = e.target.textContent;
      let pairValues = pair.split("/");
      baseCurrency.value = pairValues[0];
      targetCurrency.value = pairValues[1];
      fromCurrency = pairValues[0];
      toCurrency = pairValues[1];
      calculate(baseCurrency.value, targetCurrency.value, currencyAmount);
    });
  });
});

// save button that takes a pair and saves it in local storage and creates a corresponding favorite button
saveButton.addEventListener("click", () => {
  if (fromCurrency && toCurrency) {
    const newFavorite = document.createElement("button");
    newFavorite.setAttribute("class", "favorite-button");
    localStorage.setItem(
      `${fromCurrency}/${toCurrency}`,
      JSON.stringify([fromCurrency, toCurrency])
    );
    newFavorite.textContent = `${fromCurrency}/${toCurrency}`;
    document.querySelector("#favorite-currency-pairs").appendChild(newFavorite);
  } else {
    console.log(
      "No currency pair selected. Please select a pair of currencies and try again."
    );
  }
  let favoriteButtons = document.querySelectorAll(".favorite-button");
  favoriteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let pair = e.target.textContent;
      let pairValues = pair.split("/");
      baseCurrency.value = pairValues[0];
      targetCurrency.value = pairValues[1];
      fromCurrency = pairValues[0];
      toCurrency = pairValues[1];
      calculate(baseCurrency.value, targetCurrency.value, currencyAmount);
    });
  });
});

// when the DOM loads, populates the list with options
window.addEventListener("DOMContentLoaded", () => {
  fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      for (const key in result.symbols) {
        let baseOption = document.createElement("option");
        let targetOption = document.createElement("option");
        baseOption.text = `${key}`;
        targetOption.text = `${key}`;
        baseCurrency.appendChild(baseOption);
        targetCurrency.appendChild(targetOption);
      }
    })
    .catch((error) =>
      console.log(
        "Error fetching symbol data. Please reload the page and try again.",
        error
      )
    );
});

// calculate function that calls the conversion from the API
function calculate(base, target, amount) {
  if (base && target && amount) {
    if (base === target) {
      console.log("You must select two different currency types.");
      return;
    } else {
      fetch(
        `https://api.apilayer.com/exchangerates_data/convert?to=${target}&from=${base}&amount=${amount}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          let convertedValue = parseFloat(result.result).toFixed(2);
          convertedAmount.innerHTML = `${convertedValue} ${target}`;
        })
        .catch((error) =>
          console.log(
            "Error fetching conversion data. Please reload the page and try again.",
            error
          )
        );
    }
  } else if (!base) {
    console.log("You must select a base currency.");
    return;
  } else if (!target) {
    console.log("You must select a currency to convert to.");
    return;
  } else if (!amount) {
    console.log("You must input a currency amount.");
    return;
  } else {
    console.log("Unknown error. Please reload the page and try again.");
    return;
  }
}

// when the amount is changed, checks if variables are valid, then calls API for conversion
amount.addEventListener("change", (amountInput) => {
  currencyAmount = parseFloat(amountInput.target.value);
  if (currencyAmount < 0) {
    console.log("Must input a positive value for amount.");
    currencyAmount = 0;
    return;
  } else if (typeof currencyAmount !== typeof 1.0) {
    console.log("Must input a number to convert.");
    return;
  } else {
    calculate(fromCurrency, toCurrency, currencyAmount);
  }
});

// // // when base currency is changed, verifies if all values are valid, then calls API if they are
baseCurrency.addEventListener("change", (selection) => {
  fromCurrency = selection.target.value;
  calculate(fromCurrency, toCurrency, currencyAmount);
});

// // // when target currency is changed, verifies if all values are valid, then calls API if they are
targetCurrency.addEventListener("change", (selection) => {
  toCurrency = selection.target.value;
  calculate(fromCurrency, toCurrency, currencyAmount);
});

// Historical rates button displays rates for specified date in history
document
  .querySelector("#historical-rates-container")
  .appendChild(historicalRate);
historyButton.addEventListener("click", () => {
  fetch(
    `https://api.apilayer.com/exchangerates_data/2020-10-10?symbols=${toCurrency}&base=${fromCurrency}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      let historicalValue = parseFloat(result.rates[toCurrency]).toFixed(2);
      historicalRate.innerHTML = `On October 10th, 2020, 1 ${fromCurrency} was equal to ${historicalValue} in ${toCurrency}`;
    })

    .catch((error) =>
      console.log(
        "Error fetching historical data. Please reload the page and try again.",
        error
      )
    );
});

////////////////////////////////////
// let testSymbols = {
//   success: true,
//   symbols: {
//     AED: "United Arab Emirates Dirham",
//     AFN: "Afghan Afghani",
//     ALL: "Albanian Lek",
//     AMD: "Armenian Dram",
//   },
// };

// for (const key in testSymbols.symbols) {
//   let baseOption = document.createElement("option");
//   let targetOption = document.createElement("option");
//   baseOption.text = `${key}`;
//   targetOption.text = `${key}`;
//   baseCurrency.appendChild(baseOption);
//   targetCurrency.appendChild(targetOption);
// }
// testHistory = {
//   base: "GBP",
//   date: "2013-12-24",
//   historical: true,
//   rates: {
//     USD: 1.636492,
//   },
//   success: true,
//   timestamp: 1387929599,
// };
//////////////////////////////////////

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const result = document.getElementById("result");

// Example currency list — you can add more
const currencyList = ["USD", "INR", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY"];

window.onload = () => {
  currencyList.forEach(currency => {
  const option1 = document.createElement("option");
  const option2 = document.createElement("option");

  const flag = document.createElement("img");
  const countryCode = currency.slice(0, 2).toLowerCase(); 
  const flagURL = `https://flagcdn.com/24x18/${countryCode}.png`;

  option1.value = option2.value = currency;
  option1.textContent = option2.textContent = currency;
  option1.style.backgroundImage = option2.style.backgroundImage = `url(${flagURL})`;
  option1.style.backgroundRepeat = option2.style.backgroundRepeat = "no-repeat";
  option1.style.backgroundSize = option2.style.backgroundSize = "20px 15px";
  option1.style.paddingLeft = option2.style.paddingLeft = "25px";

  fromCurrency.appendChild(option1);
  toCurrency.appendChild(option2);
});
}

async function convertCurrency() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amountValue = parseFloat(amount.value);

  if (isNaN(amountValue) || amountValue <= 0) {
    result.textContent = "⚠️ Please enter a valid amount!";
    return;
  }

  const url = `https://api.exchangerate-api.com/v4/latest/${from}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rate = data.rates[to];

    if (rate) {
      const converted = (amountValue * rate).toFixed(2);
      result.textContent = `✅ ${amountValue} ${from} = ${converted} ${to}`;
    } else {
      result.textContent = `⚠️ Conversion not available for ${to}`;
    }
  } catch (error) {
    result.textContent = "❌ Error fetching exchange rate.";
  }
}



let chart;
async function fetchHistoricalRates(from, to) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7); // last 7 days

  const format = d => d.toISOString().split("T")[0];
  const start = format(startDate);
  const end = format(endDate);

  const url = `https://api.exchangerate.host/timeseries?start_date=${start}&end_date=${end}&base=${from}&symbols=${to}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const dates = Object.keys(data.rates).sort();
    const rates = dates.map(date => data.rates[date][to]);

    updateChart(dates, rates, from, to);
  } catch (error) {
    console.error("Chart API error:", error);
  }
}
function updateChart(labels, data, from, to) {
  const ctx = document.getElementById("rateChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `Exchange Rate: ${from} → ${to}`,
        data,
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#2ecc71'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}


// 💸 Currency Symbol Rain Animation
const canvas2 = document.getElementById("currencyCanvas");
const ctx2 = canvas2.getContext("2d");

canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;

const symbols = ['$', '₹', '€', '¥', '£'];
const fontSize = 24;
const columns = Math.floor(canvas2.width / fontSize);
const drops = Array(columns).fill(1);

function drawCurrencyRain() {
  ctx2.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

  ctx2.fillStyle = "#2ecc71"; // green currency color
  ctx2.font = `${fontSize}px Segoe UI`;

  for (let i = 0; i < drops.length; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    ctx2.fillText(symbol, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas2.height || Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawCurrencyRain, 50);

window.addEventListener("resize", () => {
  canvas2.width = window.innerWidth;
  canvas2.height = window.innerHeight;
});

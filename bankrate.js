"use strict";
const rateTable = document.querySelectorAll(".rate");
const dat = document.querySelector(".dat");
const flag = document.querySelectorAll(".flag");
const inputThreeMonth = document.querySelector(".three-months");
const inputSixMonth = document.querySelector(".six-months");
const inputToday = document.querySelector(".today");
const fromDate = document.querySelector(".from");
const toDate = document.querySelector(".to");
const curOption = document.querySelector(".check");
const addTable = document.querySelector(".addTable");
const searchBtn = document.querySelector(".search-btn");
const search = document.querySelector(".search");
const serCur = document.querySelector(".searchCur");
const pageNum = document.querySelector(".pagination");
const next = document.querySelector(".next-Page");
// const prePage = document.querySelector(".previous");
// const nextPage = document.querySelector(".next");
const pageItem = document.querySelector(".page-item");
const changeRateFrom = document.querySelector(".change-from");
const changeRateTo = document.querySelector(".change-to");
const inputChangeFrom = document.querySelector(".inputChange-from");
const inputChangeTo = document.querySelector(".inputChange-to");
const referFrom = document.querySelector(".referRate-from");
const referTo = document.querySelector(".referRate-to");

const countryInfo = {
  currency: [
    "USD",
    "CNY",
    "HKD",
    "JPY",
    "EUR",
    "AUD",
    "CAD",
    "GBP",
    "ZAR",
    "NZD",
    "CHF",
    "SEK",
    "SGD",
    "MXN",
    "THB",
  ],
  countryCode: [
    "USA",
    "china",
    "Thailand",
    "japan",
    "uk",
    "australia",
    "canada",
    "South Africa",
    "Mexico",
    "Switzerland",
    "New Zealand",
    "Hong Kong",
    "Sweden",
  ],
};
// Page1
const today = new Date();

const renderDate = function (num) {
  const cal = today.getMonth() + num;
  const da = today.getDate();
  let day = `${today.getFullYear()}-${cal < 9 ? 0 : ""}${cal}-${
    da < 10 ? 0 : ""
  }${da}`;
  return day;
};
const calender = renderDate(1);
const threeMonthAgo = renderDate(-2);
const sixMonthAgo = renderDate(-5);

const showDate = function () {
  const d = `${today} `;
  const date = `資料日期：${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日 ${d.slice(16, 24)}`;
  dat.textContent = date;

  fromDate.setAttribute("value", calender);
  toDate.setAttribute("value", calender);
};
showDate();

const getJson = async function (url) {
  try {
    const response = await fetch(url);
    const getrespnse = await response.json();
    return getrespnse;
  } catch (err) {
    throw err;
  }
};

const getlatestRates = function (cur) {
  const rates = getJson(
    `https://api.exchangerate.host/convert?from=${cur}&to=TWD`
  ).then((re) => {
    const { from } = re.query;
    const result = re.result;
    rateTable.forEach((a) => {
      const el = a.previousElementSibling.getAttribute("data-cur");
      el === from ? (a.textContent = result) : "";
    });
  });
};

const latestRates = async function () {
  try {
    const data = await Promise.all([
      countryInfo.currency.forEach((cur) => {
        getlatestRates(cur);
      }),
    ]);
  } catch (err) {
    console.error(err.message);
  }
};
latestRates();

const getFlag = function (country) {
  getJson(`https://restcountries.com/v2/name/${country}?fullText=true`).then(
    (r) => {
      const { code } = r[0].currencies[0];
      flag.forEach((el) => {
        const att = el.parentElement.getAttribute("data-cur");
        att === code ? (el.src = r[0].flag) : "";
      });
    }
  );
};
const renderFlag = async function () {
  try {
    const data = await Promise.all([
      countryInfo.countryCode.forEach((code) => {
        getFlag(code);
      }),
    ]);
  } catch (err) {
    console.error(err.message);
  }
};
renderFlag();

// Page2
// DOM choose currency metch api
let currentCur;
let currentMonth = calender;
let entries;
let firstClick = 0;

curOption.addEventListener("change", function (e) {
  if (e.target.value === "請選擇") return;
  const value = +e.target.value;
  currentCur = countryInfo.currency[value - 1];
  serCur.textContent = `${curOption[value].textContent}(${currentCur})`;
  addTable.innerHTML = "";
  firstClick === 2 ? periodRate() : (firstClick += 1);
});

// click 3 months, change date on calender, click today , change back
inputThreeMonth.addEventListener("click", function () {
  currentMonth = threeMonthAgo;
  firstClick === 2 ? periodRate() : (firstClick += 1);
  fromDate.setAttribute("value", threeMonthAgo);
});
inputSixMonth.addEventListener("click", function () {
  currentMonth = sixMonthAgo;
  firstClick === 2 ? periodRate() : (firstClick += 1);
  fromDate.setAttribute("value", sixMonthAgo);
});
inputToday.addEventListener("click", function () {
  currentMonth = calender;
  periodRate();
  fromDate.setAttribute("value", calender);
});

const periodRate = function () {
  getJson(
    `https://api.exchangerate.host/timeseries?start_date=${currentMonth}&end_date=${calender}&symbols=TWD&base=${currentCur}`
  ).then((r) => {
    entries = Object.entries(r.rates);
    addTable.innerHTML = "";
    dataDevide(1);
  });
};

// SOLVE ENTRIES RUN BEFORE GET NEW ENTRIES CHANGE
const dataDevide = function (nowPage) {
  const perpage = 12;
  const pageTotal = Math.ceil(entries.length / 12);
  next.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    renderPages(i);
  }
  let currentPage = nowPage;
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }
  const minData = currentPage * perpage - perpage + 1;
  const maxData = currentPage * perpage;

  entries.forEach((el, i) => {
    const num = i + 1;
    if (num <= maxData && num >= minData) {
      const [ke, { TWD }] = el;
      renderTable(ke, TWD);
    }
  });
};

pageNum.addEventListener("click", function (e) {
  addTable.innerHTML = "";
  let getPage = e.target.getAttribute("data-page");
  dataDevide(getPage);
});

// btn search is clicked,show the result
searchBtn.addEventListener("click", function () {
  new Promise(function (resolve, reject) {
    currentCur ? periodRate() : reject(alert("請選擇幣別"));
    resolve(search.classList.remove("hidden"));
  });
});

const renderPages = function (pa) {
  const page = `<li class="page-item"><a class="page-link" href="#" data-page="${pa}">${pa}</a></li>`;
  next.insertAdjacentHTML("beforeend", page);
};

const renderTable = function (da, rate) {
  const html = `<tr>
                    <td>${da}</td>
                    <td>${rate} </td>
                </tr>`;
  addTable.insertAdjacentHTML("beforeend", html);
};

// Page 3
const renderChangeCur = function (tar) {
  if (tar.value === "請選擇") return;
  const value = +tar.value;
  const changedRateCur = countryInfo.currency[value - 1];
  return changedRateCur;
};
let renderFrom;
let renderTo;
let multiInput;

changeRateFrom.addEventListener("change", function (e) {
  renderFrom = renderChangeCur(e.target);
  if (!renderTo || !multiInput) return;
  callRefer();
});
changeRateTo.addEventListener("change", function (e) {
  renderTo = renderChangeCur(e.target);
  if (!renderFrom || !multiInput) return;
  callRefer();
});
inputChangeFrom.addEventListener("change", function (e) {
  multiInput = e.target.value;
  if (!renderFrom && !renderTo) return;
  callRefer();
});
inputChangeFrom.addEventListener("keydown", function () {
  inputChangeTo.value = 0;
});
const rateChange = function (from, to) {
  getJson(`https://api.exchangerate.host/convert?from=${from}&to=${to}`).then(
    (re) => {
      const result = re.result;
      const calc = result * multiInput;
      inputChangeTo.value = calc.toFixed(2);
    }
  );
};

const reference = function (cur, fromto) {
  getJson(`https://api.exchangerate.host/convert?from=${cur}&to=TWD`).then(
    (re) => {
      const result = re.result;
      fromto === "from"
        ? (referFrom.textContent = `參考匯率：${result}`)
        : (referTo.textContent = `參考匯率：${result}`);
    }
  );
};
const callRefer = function () {
  reference(renderFrom, "from");
  reference(renderTo, "to");
  rateChange(renderFrom, renderTo);
};

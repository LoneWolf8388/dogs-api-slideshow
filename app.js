// Utilities
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// State
let images = [];
let index = 0;
let timerId = null;

// Elements
const imgEl = document.getElementById("slide-img");
const breedEl = document.getElementById("breed");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const autoBtn = document.getElementById("auto");
const stopBtn = document.getElementById("stop");
const countForm = document.getElementById("count-form");
const countInput = document.getElementById("count");

// Fetch N random images using async/await
async function fetchDogImages(n = 10) {
  // Dog CEO supports: https://dog.ceo/api/breeds/image/random/{n}
  const url = `https://dog.ceo/api/breeds/image/random/${n}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const data = await res.json();
  return data.message; // array of URLs
}

function getBreedFromUrl(url) {
  // Example: https://images.dog.ceo/breeds/hound-afghan/n02088094_1252.jpg
  const match = url.match(/breeds\/([^/]+)\//i);
  return match ? match[1].replace(/-/g, " ") : "Unknown";
}

function render() {
  if (!images.length) return;
  const url = images[index];
  imgEl.src = url;
  breedEl.textContent = getBreedFromUrl(url);
}

function next() {
  index = (index + 1) % images.length;
  render();
}
function prev() {
  index = (index - 1 + images.length) % images.length;
  render();
}

function startAuto(intervalMs = 2000) {
  if (timerId) return;
  timerId = setInterval(next, intervalMs);
}
function stopAuto() {
  clearInterval(timerId);
  timerId = null;
}

// Wire up UI
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
autoBtn.addEventListener("click", () => startAuto(2000));
stopBtn.addEventListener("click", stopAuto);

countForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  stopAuto();
  const n = Math.max(1, Math.min(50, Number(countInput.value) || 10));
  await load(n);
});

async function load(n = 10) {
  try {
    images = await fetchDogImages(n);
    index = 0;
    render();
  } catch (err) {
    console.error(err);
    breedEl.textContent = "Error loading images. Try again.";
  }
}

// Initial load
load(10);

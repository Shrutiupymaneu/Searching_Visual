const container = document.getElementById("array-container");

const generateBtn = document.getElementById("new-array");
const startBtn = document.getElementById("start");

const algorithmSelect = document.getElementById("algorithm");

const arraySlider = document.getElementById("array-size");
const arrayValue = document.getElementById("array-size-value");

const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speed-value");

const targetInput = document.getElementById("target-input");

const note = document.getElementById("note");
const statusText = document.getElementById("status-text");
const comparisonCount = document.getElementById("comparison-count");

let array = [];
let animationSpeed = Number(speedSlider.value);
let isRunning = false;
let comparisons = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateArray() {
    if (isRunning) return;

    array = [];
    comparisons = 0;

    const size = Number(arraySlider.value);

    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 97) + 3);
    }

    if (algorithmSelect.value === "binary") {
        array.sort((a, b) => a - b);
        note.textContent = "Binary Search needs a sorted array. Array sorted automatically.";
    } else {
        note.textContent = "Enter a target value and start searching.";
    }

    updateStats("Ready", comparisons);
    renderArray();
}

function renderArray() {
    container.innerHTML = "";

    array.forEach((value, index) => {
        const block = document.createElement("div");

        block.className = "block";
        block.textContent = value;
        block.dataset.index = index;
        block.dataset.value = value;

        container.appendChild(block);
    });
}

function getBlocks() {
    return document.querySelectorAll(".block");
}

function resetBlocks() {
    getBlocks().forEach(block => {
        block.className = "block";
    });
}

function updateStats(status, count = comparisons) {
    statusText.textContent = status;
    comparisonCount.textContent = count;
}

function incrementComparisons() {
    comparisons++;
    comparisonCount.textContent = comparisons;
}

function disableControls() {
    isRunning = true;

    generateBtn.disabled = true;
    startBtn.disabled = true;
    algorithmSelect.disabled = true;
    arraySlider.disabled = true;
    targetInput.disabled = true;
}

function enableControls() {
    isRunning = false;

    generateBtn.disabled = false;
    startBtn.disabled = false;
    algorithmSelect.disabled = false;
    arraySlider.disabled = false;
    targetInput.disabled = false;
}

async function linearSearch(target) {
    const blocks = getBlocks();

    updateStats("Running");
    note.textContent = "Linear Search started. Checking every block one by one.";

    for (let i = 0; i < array.length; i++) {
        blocks[i].classList.add("checking");
        note.textContent = `Checking index ${i}, value ${array[i]}`;

        incrementComparisons();

        await sleep(animationSpeed);

        if (array[i] === target) {
            blocks[i].classList.remove("checking");
            blocks[i].classList.add("found");

            updateStats("Found");
            note.textContent = `Target ${target} found at index ${i}.`;

            return;
        }

        blocks[i].classList.remove("checking");
        blocks[i].classList.add("discarded");

        await sleep(animationSpeed / 2);
    }

    blocks.forEach(block => {
        block.classList.remove("discarded");
        block.classList.add("not-found");
    });

    updateStats("Not Found");
    note.textContent = `Target ${target} was not found in the array.`;
    alert(`Target ${target} not found.`);
}

async function binarySearch(target) {
    array.sort((a, b) => a - b);
    renderArray();

    const blocks = getBlocks();

    let left = 0;
    let right = array.length - 1;

    updateStats("Running");
    note.textContent = "Binary Search started. Array sorted automatically.";

    while (left <= right) {
        blocks.forEach((block, index) => {
            block.className = "block";

            if (index < left || index > right) {
                block.classList.add("discarded");
            }
        });

        await sleep(animationSpeed / 2);

        const mid = Math.floor((left + right) / 2);

        blocks[mid].classList.remove("discarded");
        blocks[mid].classList.add("checking");

        note.textContent = `Checking middle index ${mid}, value ${array[mid]}`;

        incrementComparisons();

        await sleep(animationSpeed);

        if (array[mid] === target) {
            blocks[mid].classList.remove("checking");
            blocks[mid].classList.add("found");

            updateStats("Found");
            note.textContent = `Target ${target} found at index ${mid}.`;

            return;
        }

        blocks[mid].classList.remove("checking");
        blocks[mid].classList.add("discarded");

        if (array[mid] < target) {
            for (let i = left; i <= mid; i++) {
                blocks[i].classList.add("discarded");
            }

            note.textContent = `Target is greater than ${array[mid]}. Searching right half.`;
            left = mid + 1;
        } else {
            for (let i = mid; i <= right; i++) {
                blocks[i].classList.add("discarded");
            }

            note.textContent = `Target is smaller than ${array[mid]}. Searching left half.`;
            right = mid - 1;
        }

        await sleep(animationSpeed);
    }

    blocks.forEach(block => {
        block.className = "block not-found";
    });

    updateStats("Not Found");
    note.textContent = `Target ${target} was not found in the array.`;
    alert(`Target ${target} not found.`);
}

arraySlider.addEventListener("input", () => {
    arrayValue.textContent = arraySlider.value;
    generateArray();
});

speedSlider.addEventListener("input", () => {
    animationSpeed = Number(speedSlider.value);
    speedValue.textContent = `${animationSpeed} ms`;
});

generateBtn.addEventListener("click", generateArray);

algorithmSelect.addEventListener("change", generateArray);

startBtn.addEventListener("click", async () => {
    if (isRunning) return;

    const target = Number(targetInput.value);

    if (targetInput.value.trim() === "" || isNaN(target)) {
        alert("Please enter a valid target number.");
        return;
    }

    comparisons = 0;
    updateStats("Running", comparisons);
    resetBlocks();
    disableControls();

    if (algorithmSelect.value === "linear") {
        await linearSearch(target);
    } else {
        await binarySearch(target);
    }

    enableControls();
});

generateArray();

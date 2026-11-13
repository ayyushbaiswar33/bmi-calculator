
// ===================================
// HEALTHTRACK BMI CALCULATOR
// ===================================

// DOM ELEMENTS
// ===================================

const bmiForm = document.getElementById("bmiForm");

const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");

const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");

const resultDescription = document.getElementById("resultDescription");
const healthyWeight = document.getElementById("healthyWeight");

const errorMessage = document.getElementById("errorMessage");

const heightUnit = document.getElementById("heightUnit");
const weightUnit = document.getElementById("weightUnit");

const resetBtn = document.getElementById("resetBtn");

const unitButtons = document.querySelectorAll(".unit-btn");

let currentUnit = "metric";
let currentAudio = null;


// ===================================
// AUDIO FILE PATHS
// ===================================

const bmiSounds = {
    underweight: "./underweight.mp3",
    normal: "./normal.mp3",
    overweight: "./overweight.mp3",
    obesity: "./obesity.mp3"
};


// ===================================
// PLAY BMI SOUND
// ===================================

function playBMISound(category) {

    // Stop previous sound
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }

    let soundPath;

    switch (category) {

        case "underweight":
            soundPath = bmiSounds.underweight;
            break;

        case "normal":
            soundPath = bmiSounds.normal;
            break;

        case "overweight":
            soundPath = bmiSounds.overweight;
            break;

        case "obesity1":
        case "obesity2":
        case "obesity3":
            soundPath = bmiSounds.obesity;
            break;

        default:
            console.error("Unknown BMI category:", category);
            return;
    }

    // Create audio when Calculate is clicked
    currentAudio = new Audio(soundPath);
    currentAudio.volume = 1;
    currentAudio.load();

    const playPromise = currentAudio.play();

    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log("BMI audio playing:", category);
            })
            .catch(error => {
                console.error(
                    "Audio playback failed:",
                    error.name,
                    error.message
                );
            });
    }
}


// ===================================
// BMI CATEGORY CLASSIFICATION
// ===================================

function getBMICategory(bmi) {

    if (bmi < 18.5) {
        return {
            name: "Underweight",
            className: "underweight",
            color: "#38bdf8",
            description:
                "Your BMI is below the healthy range. Consider discussing your nutrition with a healthcare professional."
        };
    }

    if (bmi < 25) {
        return {
            name: "Normal Weight",
            className: "normal",
            color: "#10b981",
            description:
                "Your BMI is within the healthy range. Maintain balanced nutrition and regular physical activity."
        };
    }

    if (bmi < 30) {
        return {
            name: "Overweight",
            className: "overweight",
            color: "#f59e0b",
            description:
                "Your BMI is above the healthy range. Healthy lifestyle habits may help improve your overall health."
        };
    }

    if (bmi < 35) {
        return {
            name: "Obesity Class 1",
            className: "obesity1",
            color: "#f97316",
            description:
                "Your BMI falls within Obesity Class 1. Consider discussing your health goals with a healthcare professional."
        };
    }

    if (bmi < 40) {
        return {
            name: "Obesity Class 2",
            className: "obesity2",
            color: "#ef4444",
            description:
                "Your BMI falls within Obesity Class 2. Professional health guidance may help you plan appropriate next steps."
        };
    }

    return {
        name: "Obesity Class 3",
        className: "obesity3",
        color: "#dc2626",
        description:
            "Your BMI falls within Obesity Class 3. Consider speaking with a healthcare professional for personalized guidance."
    };
}


// ===================================
// BMI CALCULATION
// ===================================

function calculateBMI(height, weight) {

    if (currentUnit === "metric") {
        return weight / Math.pow(height / 100, 2);
    }

    return (weight * 703) / Math.pow(height, 2);
}


// ===================================
// HEALTHY WEIGHT RANGE
// ===================================

function calculateHealthyWeight(height) {

    let minWeight;
    let maxWeight;

    if (currentUnit === "metric") {

        const heightInMeters = height / 100;

        minWeight = 18.5 * heightInMeters * heightInMeters;
        maxWeight = 24.9 * heightInMeters * heightInMeters;

    } else {

        minWeight = (18.5 * height * height) / 703;
        maxWeight = (24.9 * height * height) / 703;
    }

    const unit = currentUnit === "metric" ? "kg" : "lbs";

    return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} ${unit}`;
}


// ===================================
// DISPLAY BMI RESULTS
// ===================================

function displayResults(bmi, height) {

    const category = getBMICategory(bmi);

    // Display BMI
    bmiValue.textContent = bmi.toFixed(1);

    // Display category
    bmiCategory.textContent = category.name;
    bmiCategory.style.color = category.color;

    // Display description
    resultDescription.textContent = category.description;

    // Display healthy weight range
    healthyWeight.textContent = calculateHealthyWeight(height);

    // Play matching audio
    playBMISound(category.className);
}


// ===================================
// FORM SUBMISSION
// ===================================

bmiForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    errorMessage.textContent = "";

    // Validate inputs
    if (
        !Number.isFinite(height) ||
        !Number.isFinite(weight) ||
        height <= 0 ||
        weight <= 0
    ) {
        errorMessage.textContent =
            "Please enter valid height and weight.";
        return;
    }

    // METRIC VALIDATION
    if (currentUnit === "metric") {

        if (height < 50 || height > 250) {
            errorMessage.textContent =
                "Please enter height between 50 and 250 cm.";
            return;
        }

        if (weight < 10 || weight > 500) {
            errorMessage.textContent =
                "Please enter a valid weight in kg.";
            return;
        }

    }

    // IMPERIAL VALIDATION
    else {

        if (height < 20 || height > 100) {
            errorMessage.textContent =
                "Please enter a valid height in inches.";
            return;
        }

        if (weight < 20 || weight > 1100) {
            errorMessage.textContent =
                "Please enter a valid weight in lbs.";
            return;
        }
    }

    // Calculate BMI
    const bmi = calculateBMI(height, weight);

    // Display results and play sound
    displayResults(bmi, height);

});


// ===================================
// UNIT SWITCHING
// ===================================

unitButtons.forEach(button => {

    button.addEventListener("click", function() {

        const selectedUnit = this.dataset.unit;

        if (selectedUnit === currentUnit) return;

        currentUnit = selectedUnit;

        // Update active button
        unitButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        // Update input labels
        if (currentUnit === "metric") {

            heightUnit.textContent = "cm";
            weightUnit.textContent = "kg";

            heightInput.placeholder = "e.g. 175";
            weightInput.placeholder = "e.g. 70";

        } else {

            heightUnit.textContent = "in";
            weightUnit.textContent = "lbs";

            heightInput.placeholder = "e.g. 69";
            weightInput.placeholder = "e.g. 154";
        }

        resetCalculator();

    });

});


// ===================================
// RESET CALCULATOR
// ===================================

function resetCalculator() {

    bmiForm.reset();

    bmiValue.textContent = "--.-";

    bmiCategory.textContent = "Awaiting results";
    bmiCategory.style.color = "";

    resultDescription.textContent =
        "Enter your measurements to discover your BMI category.";

    healthyWeight.textContent = "--";

    errorMessage.textContent = "";

    // Stop audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
}


// ===================================
// RESET BUTTON
// ===================================

resetBtn.addEventListener("click", resetCalculator);

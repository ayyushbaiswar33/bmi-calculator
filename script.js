
// ===================================
// HEALTH TRACK BMI CALCULATOR
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

const gaugeMarker = document.getElementById("gaugeMarker");
const errorMessage = document.getElementById("errorMessage");

const heightUnit = document.getElementById("heightUnit");
const weightUnit = document.getElementById("weightUnit");

const resetBtn = document.getElementById("resetBtn");

const unitButtons = document.querySelectorAll(".unit-btn");

let currentUnit = "metric";

// ===================================
// CUSTOM AUDIO FILES
// ===================================


const bmiSounds = {
    underweight: new Audio("./underweight.mp3"),
    normal: new Audio("./normal.mp3"),
    overweight: new Audio("./overweight.mp3"),
    obesity: new Audio("./obesity.mp3")
};


// Preload audio files
Object.values(bmiSounds).forEach(audio => {
    audio.preload = "auto";
});

// ===================================
// PLAY BMI AUDIO
// ===================================

function playBMISound(category) {

    // Stop all previous audio
    Object.values(bmiSounds).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    let selectedSound = null;

    switch (category) {

        case "underweight":
            selectedSound = bmiSounds.underweight;
            break;

        case "normal":
            selectedSound = bmiSounds.normal;
            break;

        case "overweight":
            selectedSound = bmiSounds.overweight;
            break;

        case "obesity1":
        case "obesity2":
        case "obesity3":
            selectedSound = bmiSounds.obesity;
            break;

        default:
            console.error("Unknown BMI category:", category);
            return;
    }

    // Play selected audio
    selectedSound.currentTime = 0;

    selectedSound.play().catch(error => {
        console.error("Audio playback failed:", error);
    });

    console.log("Playing audio for:", category);
}

// ===================================
// BMI CATEGORY CLASSIFICATION
// ===================================

function getBMICategory(bmi) {

    // UNDERWEIGHT
    if (bmi < 18.5) {

        return {
            name: "Underweight",
            className: "underweight",
            color: "#38bdf8",
            description:
                "Your BMI is below the healthy range. Consider discussing your nutrition with a healthcare professional."
        };
    }

    // NORMAL WEIGHT
    if (bmi < 25) {

        return {
            name: "Normal Weight",
            className: "normal",
            color: "#10b981",
            description:
                "Your BMI is within the healthy range. Maintain balanced nutrition and regular physical activity."
        };
    }

    // OVERWEIGHT
    if (bmi < 30) {

        return {
            name: "Overweight",
            className: "overweight",
            color: "#f59e0b",
            description:
                "Your BMI is above the healthy range. Healthy lifestyle habits may help improve your overall health."
        };
    }

    // OBESITY CLASS 1
    if (bmi < 35) {

        return {
            name: "Obesity Class 1",
            className: "obesity1",
            color: "#f97316",
            description:
                "Your BMI falls within Obesity Class 1. Consider discussing your health goals with a healthcare professional."
        };
    }

    // OBESITY CLASS 2
    if (bmi < 40) {

        return {
            name: "Obesity Class 2",
            className: "obesity2",
            color: "#ef4444",
            description:
                "Your BMI falls within Obesity Class 2. Professional health guidance may help you plan appropriate next steps."
        };
    }

    // OBESITY CLASS 3
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

    // Update gauge marker
    if (gaugeMarker) {

        const markerPosition = Math.min(
            Math.max((bmi / 40) * 100, 0),
            100
        );

        gaugeMarker.style.left = `${markerPosition}%`;
    }

    // Play matching custom audio
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

    // Validate empty and invalid values
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

    // Display results and play audio
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

    bmiValue.textContent = "0.0";

    bmiCategory.textContent = "Not Calculated";

    resultDescription.textContent =
        "Enter your details to calculate your BMI.";

    healthyWeight.textContent = "--";

    errorMessage.textContent = "";

    // Reset gauge
    if (gaugeMarker) {

        gaugeMarker.style.left = "0%";

    }

    // Stop all audio
    Object.values(bmiSounds).forEach(audio => {

        audio.pause();

        audio.currentTime = 0;

    });

}

// ===================================
// RESET BUTTON
// ===================================

resetBtn.addEventListener("click", resetCalculator);

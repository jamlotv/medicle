// Array to store all illnesses
let diseases = []

// Default illnesses to populate the library if it's empty - New feature
// This ensures the library has content when first accessed
const defaultIllnesses = [
  { name: "Common Cold", symptoms: "Cough, Runny Nose, Fatigue, Sore Throat, Sneezing" },
  { name: "Flu", symptoms: "Fever, Body Aches, Fatigue, Headache, Cough" },
  { name: "Allergies", symptoms: "Sneezing, Itchy Eyes, Runny Nose, Congestion, Wheezing" },
  { name: "Migraine", symptoms: "Severe Headache, Nausea, Light Sensitivity, Sound Sensitivity, Vision Changes" },
  { name: "Food Poisoning", symptoms: "Nausea, Vomiting, Diarrhea, Abdominal Pain, Fever" },
]

/**
 * Loads diseases from localStorage or initializes with defaults if none exist
 */
function loadDiseases() {
  // Try to load diseases from localStorage
  const storedDiseases = localStorage.getItem("diseases")
  if (storedDiseases) {
    diseases = JSON.parse(storedDiseases)
  } else {
    // Initialize with default illnesses if no diseases are stored - New feature
    diseases = defaultIllnesses
    saveDiseases()
  }
  updateIllnessList()
}

/**
 * Saves the current diseases array to localStorage
 */
function saveDiseases() {
  localStorage.setItem("diseases", JSON.stringify(diseases))
}

/**
 * Adds a new disease to the library
 * @param {string} name - The name of the illness
 * @param {string} symptoms - Comma-separated list of symptoms
 */
function addDisease(name, symptoms) {
  diseases.push({ name: name, symptoms: symptoms })
  saveDiseases()
  updateIllnessList()
}

/**
 * Clears all diseases from the library
 */
function clearLibrary() {
  diseases = []
  saveDiseases()
  updateIllnessList()
}

/**
 * Updates the displayed list of diseases in the UI
 * Creates HTML elements for each disease with a remove button
 */
function updateIllnessList() {
  const illnessList = document.getElementById("illness-list")
  illnessList.innerHTML = ""

  // Create an element for each disease in the library
  diseases.forEach((disease, index) => {
    const illnessItem = document.createElement("div")
    illnessItem.classList.add("illness-item")
    illnessItem.innerHTML = `
            <strong>${disease.name}</strong>: ${disease.symptoms}
            <button onclick="removeDisease(${index})">Remove</button>
        `
    illnessList.appendChild(illnessItem)
  })
}

/**
 * Removes a disease from the library by index
 * @param {number} index - The index of the disease to remove
 */
function removeDisease(index) {
  diseases.splice(index, 1)
  saveDiseases()
  updateIllnessList()
}

// Event listener for adding a new illness
document.getElementById("add-illness-btn").addEventListener("click", () => {
  const name = document.getElementById("new-illness-name").value.trim()
  const symptoms = document.getElementById("new-illness-symptoms").value.trim()

  // Validate input
  if (name && symptoms) {
    addDisease(name, symptoms)
    // Clear input fields after adding
    document.getElementById("new-illness-name").value = ""
    document.getElementById("new-illness-symptoms").value = ""
  } else {
    alert("Please enter both illness name and symptoms.")
  }
})

// Event listener for clearing the library with confirmation
document.getElementById("clear-library-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the entire disease library?")) {
    clearLibrary()
  }
})

// Initialize the library when the page loads
loadDiseases()


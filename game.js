// Global variables to track game state
let diseases = [] // Array to store all illnesses
let currentDisease // Currently selected illness for the game
let previousDisease // Previously used illness (to avoid immediate repetition)
let displayedSymptoms = 2 // Number of symptoms currently displayed (starts with 2)
let score = 0 // Player's score - New feature for tracking points

// Default illnesses to populate the library if it's empty - New feature
// This ensures the game has content when first loaded
const defaultIllnesses = [
  { name: "Common Cold", symptoms: "Cough, Runny Nose, Fatigue, Sore Throat, Sneezing" },
  { name: "Flu", symptoms: "Fever, Body Aches, Fatigue, Headache, Cough" },
  { name: "Allergies", symptoms: "Sneezing, Itchy Eyes, Runny Nose, Congestion, Wheezing" },
  { name: "Migraine", symptoms: "Severe Headache, Nausea, Light Sensitivity, Sound Sensitivity, Vision Changes" },
  { name: "Food Poisoning", symptoms: "Nausea, Vomiting, Diarrhea, Abdominal Pain, Fever" },
]

/**
 * Loads diseases from localStorage or initializes with defaults if none exist
 * Also loads the saved score if it exists
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

  // Load saved score if it exists - New feature for score persistence
  const savedScore = localStorage.getItem("medicleScore")
  if (savedScore) {
    score = Number.parseInt(savedScore)
    updateScoreDisplay()
  }
}

/**
 * Saves the current diseases array to localStorage
 */
function saveDiseases() {
  localStorage.setItem("diseases", JSON.stringify(diseases))
}

/**
 * Saves the current score to localStorage - New feature
 */
function saveScore() {
  localStorage.setItem("medicleScore", score.toString())
}

/**
 * Updates the score display in the UI - New feature
 */
function updateScoreDisplay() {
  document.getElementById("score").textContent = score
}

/**
 * Selects a random disease from the library, avoiding immediate repetition
 * @returns {Object} A randomly selected disease
 */
function getRandomDisease() {
  if (diseases.length === 0) {
    return null
  }

  // Select a random disease, but avoid repeating the previous one if possible
  let newDisease
  do {
    newDisease = diseases[Math.floor(Math.random() * diseases.length)]
  } while (newDisease === previousDisease && diseases.length > 1)

  previousDisease = newDisease
  return newDisease
}

/**
 * Starts a new game with a randomly selected disease
 */
function startGame() {
  if (diseases.length === 0) {
    document.getElementById("message").textContent = "Please add some diseases to the library first."
    return
  }

  // Select a random disease and reset the game state
  currentDisease = getRandomDisease()
  displayedSymptoms = 2 // Always start with 2 symptoms
  updateSymptoms()
  resetUI()
}

/**
 * Updates the symptoms displayed in the UI based on the current game state
 */
function updateSymptoms() {
  const symptomsContainer = document.getElementById("symptoms-container")
  symptomsContainer.innerHTML = ""

  // Parse the symptoms string into an array
  const symptoms = currentDisease.symptoms.split(",").map((s) => s.trim())

  // Display the appropriate number of symptoms
  for (let i = 0; i < Math.min(displayedSymptoms, symptoms.length); i++) {
    const symptomElement = document.createElement("div")
    symptomElement.classList.add("symptom")
    symptomElement.textContent = symptoms[i]
    symptomsContainer.appendChild(symptomElement)
  }
}

/**
 * Resets the UI elements for a new game
 */
function resetUI() {
  document.getElementById("guess-input").value = ""
  document.getElementById("message").textContent = ""
  document.getElementById("submit-btn").disabled = false
  document.getElementById("restart-btn").style.display = "none"
}

/**
 * Checks the player's guess against the current disease
 * Handles correct/incorrect guesses and updates the game state accordingly
 */
function checkGuess() {
  const guessInput = document.getElementById("guess-input")
  const message = document.getElementById("message")
  const submitBtn = document.getElementById("submit-btn")
  const restartBtn = document.getElementById("restart-btn")

  // Check if the guess is correct
  if (guessInput.value.toLowerCase() === currentDisease.name.toLowerCase()) {
    // Calculate points based on how many symptoms were shown - New scoring feature
    const symptoms = currentDisease.symptoms.split(",").map((s) => s.trim())
    const totalSymptoms = symptoms.length
    const pointsEarned = Math.max(1, totalSymptoms - (displayedSymptoms - 2))

    // Update and save score - New feature
    score += pointsEarned
    updateScoreDisplay()
    saveScore()

    // Display success message with points earned
    message.textContent = `Correct! You've diagnosed the illness! +${pointsEarned} points`
    message.style.color = "green"
    submitBtn.disabled = true
    restartBtn.style.display = "block"
  } else {
    // Incorrect guess - show another symptom
    displayedSymptoms++
    const symptoms = currentDisease.symptoms.split(",").map((s) => s.trim())

    // Fixed bug: Check if we've shown all symptoms - improved game logic
    if (displayedSymptoms > symptoms.length) {
      message.textContent = `Game Over! The correct illness was ${currentDisease.name}.`
      message.style.color = "red"
      submitBtn.disabled = true
      restartBtn.style.display = "block"
    } else {
      message.textContent = "Incorrect. Try again!"
      message.style.color = "red"
      updateSymptoms()
    }
  }

  // Clear the input field
  guessInput.value = ""
}

// Event listeners for user interactions
document.getElementById("submit-btn").addEventListener("click", checkGuess)
document.getElementById("guess-input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkGuess()
  }
})
document.getElementById("restart-btn").addEventListener("click", startGame)

// Initialize the game when the page loads
loadDiseases()
updateScoreDisplay()
startGame()


let programRatings = {};
let currentProgram = null;
let currentQuestionIndex = 0;
function redirectToDashboard() {
    window.location.href = "dashboard.html";
}

function redirectToAboutPage() {
    window.location.href = "about.html";
}

const categories = {
    "Resources/Reputation": [
        "Rate the resources and opportunities provided for professional growth and development:",
        "How would you rate the reputation of this residency program in terms of its alignment with your career interests?",
        "How stable do you perceive both the program and department to be?",
    ],
    "Mentorship and Support": [
        "How would you rate the level of support and collaboration among faculty and peers?",
        "Considering the mentorship and supervision available, how effective do you perceive this program to be in helping you achieve your professional goals?",
        "Considering interdisciplinary collaboration, how would you rate the potential for networking and collaboration?"
    ],
    "Resident Wellness": [
        "How would you rate the emphasis on resident well-being and work-life balance?",
        "How important do you perceive the availability of support services like counseling or wellness programs within this program?",
        "How satisfied do you perceive current residents and faculty to be with their experience?"
    ],
    "Lifestyle and Values": [
        "How well do the values of this residency program align with your own personal values and beliefs?",
        "How well does the geographic location suit your lifestyle preferences and personal interests?",
        "How well did you perceive the interview experience in reflecting the culture and values of this program?"
    ],
    "Overall Fit": [
        "How would you rate the overall fit of this residency program based on the factors mentioned, including location, resources, reputation, size, and interview experience?",
        "Based on size and structure, how do you rate the suitability for your learning style and preferences?",
        "How would you rate the fellowship and job placement opportunities offered to graduates?"
    ]
};

const programQuestions = [].concat(...Object.values(categories));

// Function to update the displayed rating value
document.getElementById("rating").addEventListener("input", function() {
    document.getElementById("ratingValue").textContent = "Rating: " + this.value;
});

function submitRating() {
    const programName = document.getElementById("programName").value;
    const rating = parseInt(document.getElementById("rating").value);

    if (programName === "") {
        alert("Please enter a valid program name.");
        return;
    }

    if (isNaN(rating) || rating < 1 || rating > 10) {
        alert("Please enter a valid rating between 1 and 10.");
        return;
    }

    if (!programRatings[programName]) {
        programRatings[programName] = {};
        // Initialize rating storage for each category
        for (const category in categories) {
            programRatings[programName][category] = [];
        }
    }

    // Push rating to the corresponding category
    const currentCategory = Object.keys(categories)[Math.floor(currentQuestionIndex / 3)];
    programRatings[programName][currentCategory].push(rating);

    if (currentQuestionIndex < programQuestions.length - 1) {
        currentQuestionIndex++;
        showNextQuestion();
    } else {
        resetForm();
        updateRankList();
    }
}

function skipRating() {
    const programName = document.getElementById("programName").value;
    if (!programRatings[programName]) {
        programRatings[programName] = {};
        // Initialize rating storage for each category
        for (const category in categories) {
            programRatings[programName][category] = [];
        }
    }

    // Push null (skipped) to the corresponding category
    const currentCategory = Object.keys(categories)[Math.floor(currentQuestionIndex / 3)];
    programRatings[programName][currentCategory].push(null);

    if (currentQuestionIndex < programQuestions.length - 1) {
        currentQuestionIndex++;
        showNextQuestion();
    } else {
        resetForm();
        updateRankList();
    }
}

function showNextQuestion() {
    const questionContainer = document.getElementById("questionContainer");
    const currentCategoryIndex = Math.floor(currentQuestionIndex / 3);
    const currentCategory = Object.keys(categories)[currentCategoryIndex];
    const questionIndexInCategory = currentQuestionIndex % 3;
    const question = categories[currentCategory][questionIndexInCategory];
    questionContainer.innerHTML = `
    <div class="question">
      <p>${question}</p>
    </div>
  `;
}

function resetForm() {
    document.getElementById("programName").value = "";
    document.getElementById("rating").value = 5; // Reset rating field
    document.getElementById("ratingValue").textContent = "Rating: 5"; // Reset displayed rating value
    currentQuestionIndex = 0;
}

function updateRankList() {
    const rankedList = document.getElementById("rankedList");
    rankedList.innerHTML = ""; // Clear previous list
    const categoryScores = document.getElementById("categoryScores");
    categoryScores.innerHTML = ""; // Clear previous category scores

    const rankedPrograms = [];

    for (const program in programRatings) {
        if (programRatings.hasOwnProperty(program)) {
            const programScores = {};
            let totalScore = 0;
            let totalQuestions = 0;
            for (const category in categories) {
                if (categories.hasOwnProperty(category)) {
                    const ratings = programRatings[program][category].filter(rating => rating !== null);
                    if (ratings.length > 0) {
                        const averageRating = ratings.reduce((total, rating) => total + rating, 0) / ratings.length;
                        programScores[category] = averageRating;
                        totalScore += averageRating;
                        totalQuestions++;
                    }
                }
            }
            rankedPrograms.push({ name: program, scores: programScores, total: totalScore / totalQuestions });
        }
    }

    // Sort programs by overall score in descending order
    rankedPrograms.sort((a, b) => b.total - a.total);

    // Display the sorted programs in the rank list
    for (const program of rankedPrograms) {
        const listItem = document.createElement("li");
        let programScoreText = `${program.name}: `;
        for (const category in program.scores) {
            if (program.scores.hasOwnProperty(category)) {
                programScoreText += `${category} - ${program.scores[category].toFixed(2)}, `;
            }
        }
        programScoreText += `Overall: ${program.total.toFixed(2)}`; // Add overall score
        listItem.textContent = programScoreText;
        rankedList.appendChild(listItem);
    }
}

document.getElementById("programName").addEventListener("change", function() {
    const programName = this.value;
    if (programQuestions.length > 0) {
        currentProgram = programName;
        showNextQuestion();
    }
});

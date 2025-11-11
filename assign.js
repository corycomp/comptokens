// Load common functions
const script = document.createElement('script');
script.src = 'common.js';
document.head.appendChild(script);

let currentUser = null;

// Wait for common.js to load
script.onload = function() {
    // Check authentication
    currentUser = checkAuth();
    if (!currentUser) return;

    // Load assignment history
    loadAssignmentHistory();
};

// Modal handlers
const assignModal = document.getElementById('assignModal');
const successModal = document.getElementById('successModal');
const assignTokenBtn = document.getElementById('assignTokenBtn');
const closeModalBtn = document.getElementById('closeModal');
const closeSuccessBtn = document.getElementById('closeSuccess');
const assignForm = document.getElementById('assignForm');
const successSound = document.getElementById('successSound');

// Open assign modal
assignTokenBtn.addEventListener('click', () => {
    assignModal.classList.remove('hidden');
    assignForm.reset();
});

// Close assign modal
closeModalBtn.addEventListener('click', () => {
    assignModal.classList.add('hidden');
});

// Close success modal
closeSuccessBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
});

// Close modals when clicking outside
assignModal.addEventListener('click', (e) => {
    if (e.target === assignModal) {
        assignModal.classList.add('hidden');
    }
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.add('hidden');
    }
});

// Handle form submission
assignForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const house = document.getElementById('houseSelect').value;
    const categoryInput = document.querySelector('input[name="category"]:checked');
    
    if (!house || !categoryInput) {
        alert('Please select both a house and a category');
        return;
    }
    
    const categoryValue = categoryInput.value;
    const [categoryName, tokenStr] = categoryValue.split(':').map(s => s.trim());
    const tokens = parseInt(tokenStr);
    
    // Save assignment
    saveAssignment(house, categoryName, tokens);
    
    // Close assign modal
    assignModal.classList.add('hidden');
    
    // Show success modal
    showSuccessModal(house, tokens);
    
    // Play success sound
    successSound.play().catch(e => console.log('Audio play failed:', e));
    
    // Reload history
    loadAssignmentHistory();
});

function saveAssignment(house, category, tokens) {
    const data = getTokenData();
    
    // Add tokens to house
    data.houses[house] += tokens;
    
    // Add assignment to history
    const assignment = {
        house: house,
        category: category,
        tokens: tokens,
        assignedBy: currentUser.name,
        timestamp: new Date().toISOString()
    };
    
    data.assignments.push(assignment);
    
    // Save data
    saveTokenData(data);
}

function showSuccessModal(house, tokens) {
    const message = document.getElementById('successMessage');
    message.textContent = `You have assigned ${tokens} token${tokens !== 1 ? 's' : ''} to ${house}, ${currentUser.name}!`;
    successModal.classList.remove('hidden');
}

function loadAssignmentHistory() {
    const historyContainer = document.getElementById('assignmentHistory');
    const userAssignments = getUserAssignments(currentUser.name);
    
    if (userAssignments.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">No assignments yet</p>';
        return;
    }
    
    // Sort by timestamp (most recent first)
    const sortedAssignments = userAssignments
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    historyContainer.innerHTML = sortedAssignments.map(assignment => {
        const isRemoval = assignment.tokens < 0;
        const displayTokens = Math.abs(assignment.tokens);
        const action = isRemoval ? 'Removed' : 'Assigned';
        const itemClass = isRemoval ? 'removal' : '';
        
        return `
            <div class="history-item ${itemClass}">
                <div class="history-info">
                    <div class="history-house">${assignment.house}: ${action} ${displayTokens} token${displayTokens !== 1 ? 's' : ''}</div>
                    <div class="history-category">${assignment.category}</div>
                </div>
                <div class="history-time">
                    <div>${formatDate(assignment.timestamp)}</div>
                    <div>${formatTime(assignment.timestamp)}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Check if user is logged in
function checkAuth() {
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

// Initialize data storage
function initializeStorage() {
    if (!localStorage.getItem('tokenData')) {
        const initialData = {
            houses: {
                'Ide': 0,
                'Bride': 0,
                'Seanan': 0,
                'Conaire': 0,
                'Padraig': 0,
                'Tola': 0
            },
            assignments: []
        };
        localStorage.setItem('tokenData', JSON.stringify(initialData));
    }
}

// Get token data
function getTokenData() {
    return JSON.parse(localStorage.getItem('tokenData'));
}

// Save token data
function saveTokenData(data) {
    localStorage.setItem('tokenData', JSON.stringify(data));
}

// Get greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
}

// Format date and time
function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleString('en-IE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format date only
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format time only
function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-IE', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get user's assignments
function getUserAssignments(userName) {
    const data = getTokenData();
    return data.assignments.filter(a => a.assignedBy === userName);
}

// Get user's total tokens assigned (including removals)
function getUserTotalTokens(userName) {
    const assignments = getUserAssignments(userName);
    return assignments.reduce((total, a) => total + a.tokens, 0);
}

// Get user's tokens added (positive only)
function getUserTokensAdded(userName) {
    const assignments = getUserAssignments(userName);
    return assignments.filter(a => a.tokens > 0).reduce((total, a) => total + a.tokens, 0);
}

// Get user's tokens removed (negative only)
function getUserTokensRemoved(userName) {
    const assignments = getUserAssignments(userName);
    return Math.abs(assignments.filter(a => a.tokens < 0).reduce((total, a) => total + a.tokens, 0));
}

// Logout handler
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    // Show goodbye screen
    const goodbyeScreen = document.getElementById('goodbyeScreen');
    if (goodbyeScreen) {
        goodbyeScreen.classList.remove('hidden');
        
        // Wait 2.5 seconds then redirect
        setTimeout(() => {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }, 2500);
    } else {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
});

// Clear Everything handler
document.getElementById('clearAllBtn')?.addEventListener('click', function() {
    const code = prompt('Enter the code to clear all data:');
    
    if (code === '111120251966') {
        const confirm = window.confirm('Are you ABSOLUTELY sure? This will delete ALL token data and cannot be undone!');
        
        if (confirm) {
            // Clear all data
            localStorage.clear();
            
            // Reinitialize storage
            initializeStorage();
            
            alert('All data has been cleared successfully!');
            
            // Reload the page
            window.location.reload();
        }
    } else if (code !== null) {
        alert('Incorrect code. Access denied.');
    }
});

// Initialize storage on load
initializeStorage();

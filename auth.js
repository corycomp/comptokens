// Sample users database - Easy to copy and paste format
const users = [
    // Format: { name: "Name", id: "123456" }
    { name: "Jamie Kirby", id: "154122" },
    { name: "Mary Johnson", id: "100002" },
    { name: "David Brown", id: "100003" },
    { name: "Sarah Wilson", id: "100004" },
    { name: "Michael Davis", id: "100005" },
    // Add more users here following the same format
];

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const userId = document.getElementById('userId').value.trim();
    
    // Find user in database
    const user = users.find(u => u.name === username && u.id === userId);
    
    if (user) {
        // Store user session with login timestamp
        const userSession = {
            ...user,
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));
        
        // Show loading screen
        document.getElementById('loadingScreen').classList.remove('hidden');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        alert('Invalid credentials. Please check your name and ID.');
    }
});

// Admin History Button Handler
document.getElementById('adminHistoryBtn').addEventListener('click', function() {
    const code = prompt('Enter admin code:');
    
    if (code === '111120251966') {
        showAdminHistory();
    } else if (code !== null) {
        alert('Incorrect code. Access denied.');
    }
});

// Close admin modal
document.getElementById('closeAdminModal').addEventListener('click', function() {
    document.getElementById('adminHistoryModal').classList.add('hidden');
});

document.getElementById('adminHistoryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
    }
});

function showAdminHistory() {
    const modal = document.getElementById('adminHistoryModal');
    const content = document.getElementById('adminHistoryContent');
    
    // Get token data
    const tokenData = JSON.parse(localStorage.getItem('tokenData'));
    
    if (!tokenData || tokenData.assignments.length === 0) {
        content.innerHTML = '<p class="no-history">No assignments recorded yet</p>';
    } else {
        // Sort assignments by timestamp (newest first)
        const sortedAssignments = tokenData.assignments.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        // Calculate running total
        let runningTotals = {};
        Object.keys(tokenData.houses).forEach(house => runningTotals[house] = 0);
        
        // Build history HTML
        content.innerHTML = sortedAssignments.map((assignment, index) => {
            // Calculate total at this point in time (going backwards)
            const assignmentsUpToNow = tokenData.assignments
                .filter(a => new Date(a.timestamp) <= new Date(assignment.timestamp))
                .reduce((totals, a) => {
                    if (!totals[a.house]) totals[a.house] = 0;
                    totals[a.house] += a.tokens;
                    return totals;
                }, {});
            
            const date = new Date(assignment.timestamp);
            const formattedDate = date.toLocaleString('en-IE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="admin-history-item">
                    <div class="admin-field">
                        <span class="admin-label">House</span>
                        <span class="admin-value">${assignment.house}</span>
                    </div>
                    <div class="admin-field">
                        <span class="admin-label">Assigned By</span>
                        <span class="admin-value">${assignment.assignedBy}</span>
                    </div>
                    <div class="admin-field">
                        <span class="admin-label">Date & Time</span>
                        <span class="admin-value">${formattedDate}</span>
                    </div>
                    <div class="admin-field">
                        <span class="admin-label">Tokens</span>
                        <span class="admin-value">+${assignment.tokens}</span>
                    </div>
                    <div class="admin-field">
                        <span class="admin-label">Total After</span>
                        <span class="admin-total">${assignmentsUpToNow[assignment.house] || 0}</span>
                    </div>
                    <div class="admin-field">
                        <span class="admin-label">Category</span>
                        <span class="admin-value">${assignment.category}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    modal.classList.remove('hidden');
}

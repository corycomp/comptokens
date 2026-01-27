// Custom password prompt function
function promptPassword(message) {
    // Create modal HTML
    const modalHTML = `
        <div id="passwordModal" class="modal" style="display: flex;">
            <div class="modal-content password-modal animate-scale-in">
                <div class="modal-header">
                    <h3>${message}</h3>
                </div>
                <div class="modal-body">
                    <input type="password" id="passwordInput" class="password-input" placeholder="Enter code" maxlength="12" autocomplete="off">
                    <div class="modal-buttons">
                        <button id="passwordOk" class="btn btn-primary">OK</button>
                        <button id="passwordCancel" class="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('passwordModal');
    const input = document.getElementById('passwordInput');
    const okBtn = document.getElementById('passwordOk');
    const cancelBtn = document.getElementById('passwordCancel');
    
    // Focus input
    setTimeout(() => input.focus(), 100);
    
    return new Promise((resolve) => {
        okBtn.onclick = () => {
            const value = input.value;
            modal.remove();
            resolve(value);
        };
        
        cancelBtn.onclick = () => {
            modal.remove();
            resolve(null);
        };
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                okBtn.click();
            } else if (e.key === 'Escape') {
                cancelBtn.click();
            }
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                cancelBtn.click();
            }
        };
    });
}

// Sample users database - Easy to copy and paste format
const users = [
    // Format: { name: "Name" }
    { name: "Jamie Kirby" },
    { name: "Cory Kilmartin" },
    { name: "David Brown" },
    { name: "Sarah Wilson" },
    { name: "Michael Davis" },
    // Add more users here following the same format
];

// Universal PIN
const UNIVERSAL_PIN = "1966";

// Login form handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const pin = document.getElementById('pin').value.trim();
    
    // Find user in database
    const user = users.find(u => u.name === username);
    
    if (user && pin === UNIVERSAL_PIN) {
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
        alert('Invalid credentials. Please check your name and PIN.');
    }
});

// Admin History Button Handler
document.getElementById('adminHistoryBtn').addEventListener('click', async function() {
    const code = await promptPassword('Enter admin code:');
    
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

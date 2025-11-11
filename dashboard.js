// Load common functions
const script = document.createElement('script');
script.src = 'common.js';
document.head.appendChild(script);

// Wait for common.js to load
script.onload = function() {
    // Check authentication
    const user = checkAuth();
    if (!user) return;

    // Set greeting
    const greeting = getGreeting();
    document.getElementById('greetingText').textContent = `${greeting}, ${user.name}`;
    document.getElementById('userInfo').textContent = `ID: ${user.id}`;
    
    // Display login time
    if (user.loginTime) {
        const loginDate = new Date(user.loginTime);
        document.getElementById('loginInfo').textContent = `Logged in: ${formatDateTime(loginDate)}`;
    }

    // Load dashboard data
    loadDashboardData(user);
};

function loadDashboardData(user) {
    const data = getTokenData();
    const userAssignments = getUserAssignments(user.name);
    const totalTokens = getUserTotalTokens(user.name);

    // Update total tokens
    document.getElementById('totalTokens').textContent = totalTokens;

    // Update assignment count
    document.getElementById('assignmentCount').textContent = userAssignments.length;

    // Count today's assignments
    const today = new Date().toDateString();
    const todayCount = userAssignments.filter(a => 
        new Date(a.timestamp).toDateString() === today
    ).length;
    document.getElementById('todayCount').textContent = todayCount;

    // Display recent activity (last 5)
    displayRecentActivity(userAssignments);
}

function displayRecentActivity(assignments) {
    const activityContainer = document.getElementById('recentActivity');
    
    if (assignments.length === 0) {
        activityContainer.innerHTML = '<p class="no-activity">No recent activity</p>';
        return;
    }

    // Sort by timestamp (most recent first) and take last 5
    const recentAssignments = assignments
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    activityContainer.innerHTML = recentAssignments.map(assignment => {
        const isRemoval = assignment.tokens < 0;
        const tokenClass = isRemoval ? 'activity-tokens-negative' : 'activity-tokens';
        const displayTokens = Math.abs(assignment.tokens);
        const action = isRemoval ? 'removed' : 'assigned';
        
        return `
            <div class="activity-item ${isRemoval ? 'removal' : ''}">
                <div>
                    <span class="activity-house">${assignment.house}</span>
                    <span> - </span>
                    <span class="${tokenClass}">${action} ${displayTokens} token${displayTokens !== 1 ? 's' : ''}</span>
                </div>
                <span class="activity-time">${formatDateTime(assignment.timestamp)}</span>
            </div>
        `;
    }).join('');
}

// Animate numbers on load
function animateNumber(element, target) {
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stat numbers when page loads
setTimeout(() => {
    const totalTokensElement = document.getElementById('totalTokens');
    const assignmentCountElement = document.getElementById('assignmentCount');
    const todayCountElement = document.getElementById('todayCount');
    
    const totalTokens = parseInt(totalTokensElement.textContent);
    const assignmentCount = parseInt(assignmentCountElement.textContent);
    const todayCount = parseInt(todayCountElement.textContent);
    
    totalTokensElement.textContent = '0';
    assignmentCountElement.textContent = '0';
    todayCountElement.textContent = '0';
    
    animateNumber(totalTokensElement, totalTokens);
    animateNumber(assignmentCountElement, assignmentCount);
    animateNumber(todayCountElement, todayCount);
}, 100);

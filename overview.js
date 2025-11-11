// Load common functions
const script = document.createElement('script');
script.src = 'common.js';
document.head.appendChild(script);

// Wait for common.js to load
script.onload = function() {
    // Check authentication
    const user = checkAuth();
    if (!user) return;

    // Load overview data
    loadOverviewData();
};

function loadOverviewData() {
    const data = getTokenData();
    
    // Create bar chart
    createBarChart(data.houses);
    
    // Create summary table
    createSummaryTable(data.houses);
}

function createBarChart(houses) {
    const chartBars = document.getElementById('chartBars');
    const chartYAxis = document.getElementById('chartYAxis');
    const maxValue = 500;
    
    // Generate Y-axis labels (500, 495, 490, ..., 5, 0)
    const yAxisLabels = [];
    for (let i = maxValue; i >= 0; i -= 5) {
        yAxisLabels.push(i);
    }
    
    // Show only every 10th label to avoid clutter (500, 450, 400, etc.)
    const displayedLabels = yAxisLabels.filter(val => val % 50 === 0);
    
    chartYAxis.innerHTML = displayedLabels.map(val => `<span>${val}</span>`).join('');
    
    const houseArray = [
        { name: 'Ide', tokens: houses.Ide, class: 'ide' },
        { name: 'Bride', tokens: houses.Bride, class: 'bride' },
        { name: 'Seanan', tokens: houses.Seanan, class: 'seanan' },
        { name: 'Conaire', tokens: houses.Conaire, class: 'conaire' },
        { name: 'Padraig', tokens: houses.Padraig, class: 'padraig' },
        { name: 'Tola', tokens: houses.Tola, class: 'tola' }
    ];
    
    chartBars.innerHTML = houseArray.map((house, index) => {
        // Calculate exact height in pixels (350px chart height)
        const heightPixels = (house.tokens / maxValue) * 350;
        
        return `
            <div class="chart-bar" style="animation-delay: ${index * 0.1}s;">
                <div class="bar-wrapper">
                    <div class="bar ${house.class}" style="height: ${heightPixels}px;">
                        <span class="bar-value">${house.tokens}</span>
                    </div>
                </div>
                <span class="bar-label">${house.name}</span>
            </div>
        `;
    }).join('');
}

function createSummaryTable(houses) {
    const tableBody = document.getElementById('houseTableBody');
    
    const houseArray = [
        { name: 'Ide', tokens: houses.Ide, class: 'ide' },
        { name: 'Bride', tokens: houses.Bride, class: 'bride' },
        { name: 'Seanan', tokens: houses.Seanan, class: 'seanan' },
        { name: 'Conaire', tokens: houses.Conaire, class: 'conaire' },
        { name: 'Padraig', tokens: houses.Padraig, class: 'padraig' },
        { name: 'Tola', tokens: houses.Tola, class: 'tola' }
    ];
    
    // Sort by tokens (highest first)
    houseArray.sort((a, b) => b.tokens - a.tokens);
    
    tableBody.innerHTML = houseArray.map((house, index) => `
        <tr>
            <td>
                <div class="house-name">
                    <span class="house-badge ${house.class}"></span>
                    ${house.name}
                </div>
            </td>
            <td><span class="token-count">${house.tokens}</span></td>
            <td>
                <button class="btn-remove-token" data-house="${house.name}" title="Remove tokens from ${house.name}">
                    ➖ Remove
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.btn-remove-token').forEach(btn => {
        btn.addEventListener('click', handleRemoveToken);
    });
}

function handleRemoveToken(event) {
    const house = event.currentTarget.getAttribute('data-house');
    const user = checkAuth();
    if (!user) return;
    
    const tokensToRemove = prompt(`How many tokens do you want to remove from ${house}?`);
    
    if (tokensToRemove === null) return; // User cancelled
    
    const amount = parseInt(tokensToRemove);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid positive number.');
        return;
    }
    
    const data = getTokenData();
    
    if (data.houses[house] < amount) {
        alert(`${house} only has ${data.houses[house]} tokens. Cannot remove ${amount} tokens.`);
        return;
    }
    
    // Remove tokens from house
    data.houses[house] -= amount;
    
    // Add to assignment history as removal
    const assignment = {
        house: house,
        category: 'Token Removal',
        tokens: -amount, // Negative to indicate removal
        assignedBy: user.name,
        timestamp: new Date().toISOString()
    };
    
    data.assignments.push(assignment);
    
    // Save data
    saveTokenData(data);
    
    // Show success message
    alert(`Successfully removed ${amount} token${amount !== 1 ? 's' : ''} from ${house}!`);
    
    // Reload data
    loadOverviewData();
}

// Refresh data every 5 seconds
setInterval(() => {
    loadOverviewData();
}, 5000);

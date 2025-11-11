# 🏆 St Patrick's Comprehensive Token System

A bright, animated web application for tracking and assigning tokens to school houses.

## Features

✨ **Beautiful UI** - Bright colors, smooth animations, and fun design perfect for a school environment
🔐 **User Authentication** - Secure login with name and 6-digit ID
📊 **Dashboard** - Personalized greeting, activity tracking, and statistics
📈 **Overview** - Visual bar chart and summary table of all house tokens
➕ **Token Assignment** - Easy interface to assign tokens with multiple categories
🎵 **Success Feedback** - Visual and audio confirmation when tokens are assigned
💾 **Persistent Data** - All data saved in browser localStorage

## Houses

The system tracks tokens for 6 houses:
- **Ide** (Red)
- **Bride** (Teal)
- **Seanan** (Yellow)
- **Conaire** (Green)
- **Padraig** (Blue)
- **Tola** (Pink)

## Token Categories

- General: 1 token
- General: 5 tokens
- General: 10 tokens
- General: 20 tokens
- Club Participation: 5 tokens
- Sports Participation: 5 tokens
- School Challenge Win: 10 tokens
- Personal Challenge/Achievement: 10 tokens
- National Champion: 20 tokens
- World Champion: 25 tokens

## Getting Started

### 1. Add Users

Edit the `auth.js` file to add users. Simply copy and paste the format:

```javascript
const users = [
    { name: "John Smith", id: "100001" },
    { name: "Mary Johnson", id: "100002" },
    // Add more users here
];
```

### 2. Open the Website

Simply open `index.html` in a web browser. The website will work offline as all data is stored locally.

### 3. Login

- Enter your name (must match exactly as entered in auth.js)
- Enter your 6-digit ID
- Click "Sign In"
- You'll see a loading screen, then be redirected to your dashboard

### 4. Navigate

Use the sidebar menu to switch between:
- **Dashboard** - View your personal statistics
- **Overview** - See all house token totals
- **Assign Token(s)** - Award tokens to houses

### 5. Assign Tokens

1. Click the "Assign Token(s)" button
2. Select a house
3. Choose a category (only one can be selected)
4. Click "Submit"
5. Enjoy the success animation and sound!

## File Structure

```
comptokens/
├── index.html          # Landing/login page
├── dashboard.html      # User dashboard
├── overview.html       # House overview with charts
├── assign.html         # Token assignment page
├── styles.css          # All styling and animations
├── auth.js             # User authentication
├── common.js           # Shared functions and data management
├── dashboard.js        # Dashboard functionality
├── overview.js         # Overview page logic
├── assign.js           # Token assignment logic
└── README.md           # This file
```

## Data Storage

All data is stored in the browser's localStorage:
- **tokenData** - Contains house totals and assignment history
- **currentUser** - Session storage for logged-in user

To reset all data, open browser console and run:
```javascript
localStorage.clear();
sessionStorage.clear();
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## Customization

### Adding More Users

Edit `auth.js` and add entries to the `users` array:
```javascript
{ name: "Student Name", id: "123456" }
```

### Changing Colors

Edit the CSS variables in `styles.css`:
```css
:root {
    --ide-color: #FF6B6B;
    --bride-color: #4ECDC4;
    /* etc... */
}
```

### Adjusting Token Categories

Edit the form in `assign.html` to add/remove/modify categories.

## Tips

- **Time-based Greetings**: The system automatically shows "Good Morning", "Good Afternoon", or "Good Evening" based on the current time
- **Live Updates**: The overview page automatically refreshes every 5 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Animations**: All page transitions and interactions include smooth animations

## Support

Created by Cory Kilmartin for St Patrick's Comprehensive School.

For questions or issues, contact the system administrator.

---

**Enjoy using the Comp Token System! 🎉**
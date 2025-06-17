# Court Coder - Basketball Playbook Animator

Court Coder is an AI-powered web application that allows basketball coaches at any level to easily create, animate, and share basketball plays using a simple drag-and-drop interface.

## 🏀 Overview

Basketball plays are traditionally drawn on whiteboards or in static diagrams. Court Coder transforms this process by providing:

1. An intuitive drag-and-drop interface for positioning players and drawing movement paths
2. AI-powered animation enhancements to make plays look realistic and fluid
3. The ability to generate text descriptions of plays based on user input
4. Easy sharing and export options for coaches to distribute to their teams

## ✨ Key Features

- **Interactive Court Designer**: Drag-and-drop interface for positioning players and drawing movement paths
- **AI Animation Enhancement**: Automatic adjustment of player speeds and timing for realistic-looking plays
- **Natural Language Input**: Describe what you want in plain English (e.g., "Make this a fast-break play resulting in a corner three-point shot")
- **Play Library**: Save, organize, and categorize plays by type, situation, or outcome
- **Export Options**: Download animations as videos or GIFs to share with players
- **Responsive Design**: Works on desktops, tablets, and mobile devices for on-the-go coaching

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript with Vue.js framework
- **Animation**: Canvas API for drawing and animation
- **AI Integration**: TensorFlow.js for path optimization and timing adjustments
- **Hosting**: GitHub Pages for static site hosting

## 📋 Project Structure

```
/
├── assets/            # Static assets (images, icons)
│   ├── court.svg      # Basketball court template
│   └── players/       # Player icons and markers
├── css/               # Stylesheets
│   ├── main.css       # Main stylesheet
│   └── animations.css # Animation-specific styles
├── js/                # JavaScript files
│   ├── app.js         # Main application logic
│   ├── court.js       # Court rendering and interaction
│   ├── players.js     # Player positioning and movement
│   ├── animation.js   # Animation controller
│   └── ai.js          # AI enhancement functionality
├── index.html         # Main application page
├── about.html         # About page
└── docs/              # Documentation
    ├── architecture.md # Architecture overview
    └── user-guide.md   # User instructions
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server-side dependencies required for basic usage

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dxaginfo/court-coder-basketball-playbook.git
   cd court-coder-basketball-playbook
   ```

2. Open `index.html` in your browser or use a local development server:
   ```bash
   # Using Python's built-in server
   python -m http.server
   
   # Or with Node.js
   npx serve
   ```

3. Access the application at `http://localhost:8000` or the URL provided by your development server

## 🎮 How to Use

1. **Create a New Play**: Click "New Play" to start with a blank court
2. **Add Players**: Drag player markers onto the court
3. **Draw Movements**: Click and drag from players to create movement paths
4. **Add Ball Movement**: Use the ball icon to indicate passes and shots
5. **Enhance with AI**: Enter a text description of the play (e.g., "Pick and roll with center screening for point guard")
6. **Animate**: Click "Play" to see your animation in action
7. **Save & Export**: Save to your library or export as a video file

## 📝 Roadmap

- **Phase 1**: Basic drag-and-drop interface with simple animations
- **Phase 2**: AI enhancement for realistic player movements
- **Phase 3**: Play library with categorization and search
- **Phase 4**: Team management and sharing features
- **Phase 5**: Advanced analytics and play effectiveness tracking

## 👥 Target Users

- Youth basketball coaches
- High school and college coaches
- Basketball enthusiasts and players
- Sports analysts and content creators

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Resources

- [Basketball Coaching Resources](https://www.basketballforcoaches.com/)
- [NBA Official Rules](https://official.nba.com/rulebook/)
- [Basketball Play Diagramming Standards](https://www.breakthroughbasketball.com/plays/playbook.html)
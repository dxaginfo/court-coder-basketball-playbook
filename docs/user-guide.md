# Court Coder User Guide

Welcome to Court Coder, your AI-assisted basketball playbook animator! This guide will help you get started with creating, editing, and sharing basketball plays.

## Table of Contents

- [Getting Started](#getting-started)
- [Creating Your First Play](#creating-your-first-play)
- [Player Management](#player-management)
- [Drawing Movements](#drawing-movements)
- [Ball Movement](#ball-movement)
- [AI Enhancement](#ai-enhancement)
- [Animation Controls](#animation-controls)
- [Saving and Organizing](#saving-and-organizing)
- [Exporting and Sharing](#exporting-and-sharing)
- [Tips and Best Practices](#tips-and-best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### System Requirements

Court Coder works on any modern browser (Chrome, Firefox, Safari, Edge) and requires:
- JavaScript enabled
- HTML5 Canvas support
- A device with at least 4GB of RAM (for optimal AI features)

### Accessing the Application

Court Coder is a web application that can be accessed directly in your browser:

1. Visit [https://dxaginfo.github.io/court-coder-basketball-playbook](https://dxaginfo.github.io/court-coder-basketball-playbook)
2. The application will load in your browser, no installation required
3. For offline use, you can "Install" it as a Progressive Web App from your browser's menu

## Creating Your First Play

### Starting a New Play

1. When you first open Court Coder, you'll see a blank basketball court
2. Click the "New Play" button in the top menu to start with a clean court
3. Give your play a name by clicking on "Untitled Play" at the top of the screen

### Setting Up the Court

1. By default, a full basketball court is displayed
2. Use the "Court Type" dropdown to switch between full court, half court, or zone views
3. Optional: Toggle offensive/defensive markers using the "Display" options

## Player Management

### Adding Players

1. Find the player toolbar on the left side of the screen
2. Drag player markers (labeled 1-5 for offense, X1-X5 for defense) onto the court
3. Position them at their starting locations

### Customizing Players

1. Click on a player marker to select it
2. Use the properties panel to:
   - Change player number/label
   - Adjust player color
   - Add player name
   - Select player role (PG, SG, SF, PF, C)

### Grouping Players

1. Hold SHIFT and click multiple players to select them as a group
2. Use the "Group" button to create a player group
3. Grouped players can be moved together and assigned coordinated movements

## Drawing Movements

### Basic Movement Paths

1. Select a player on the court
2. Click the "Draw Path" tool in the toolbar
3. Click on the court to create waypoints for the player's movement
4. End the path by double-clicking or pressing ESC

### Editing Paths

1. Click on an existing path to select it
2. Drag waypoints to adjust the path
3. Right-click on a waypoint to delete it
4. Add new waypoints by clicking on a segment while holding ALT

### Movement Types

1. With a path selected, use the properties panel to specify:
   - Movement speed (walk, jog, run, sprint)
   - Movement type (cut, screen, roll, pop)
   - Timing (when the movement should start in the sequence)

## Ball Movement

### Adding the Ball

1. Find the ball icon in the toolbar
2. Drag it onto the court to place it with a specific player

### Creating Passes

1. With the ball selected, click the "Pass" button
2. Click on the player who should receive the pass
3. The system will automatically create a passing arc

### Shots

1. With the ball selected, click the "Shot" button
2. Click on the location where the shot should go
3. Use the properties panel to specify:
   - Shot type (jump shot, layup, dunk, etc.)
   - Shot outcome (make/miss)

## AI Enhancement

### Natural Language Instructions

1. Click the "AI Enhance" button in the top toolbar
2. Enter a description of what you want, such as:
   - "Make this a pick and roll with the center screening for the point guard"
   - "Create a fast break that results in a corner three"
3. Click "Apply" to have the AI adjust the animation

### Understanding AI Suggestions

1. The AI will analyze your play and may suggest improvements
2. Review the suggestions in the "AI Recommendations" panel
3. Click "Accept" to apply all changes or selectively apply individual suggestions

### Refining AI Results

1. After applying AI enhancements, you can still manually edit any aspect
2. Use the "Revert" button to undo AI changes if needed
3. Try different phrasings if you're not getting the desired result

## Animation Controls

### Playing the Animation

1. Use the playback controls at the bottom of the screen:
   - Play/Pause button to start or stop the animation
   - Slider to scrub through the timeline
   - Speed controls to adjust playback speed (0.5x to 2x)

### Adjusting Timing

1. Select any player or ball movement
2. Use the timeline editor to adjust when actions occur
3. Drag the start or end handles to change the duration of movements

### Adding Annotations

1. Click the "Text" tool in the toolbar
2. Click on the court where you want to add a note
3. Type your annotation
4. Use the properties panel to format the text

## Saving and Organizing

### Saving Plays

1. Click the "Save" button in the top menu
2. Your play will be saved to your local library
3. For first-time saves, you'll be prompted to name the play and add tags

### Organizing Your Library

1. Access your play library by clicking "Library" in the main menu
2. Use folders to organize plays by:
   - Play type (offensive sets, out-of-bounds, etc.)
   - Situation (end of game, zone offense, etc.)
   - Team or season

### Tagging and Searching

1. Add tags to your plays to make them easier to find
2. Use the search function to quickly locate plays by:
   - Name
   - Tags
   - Date created or modified

## Exporting and Sharing

### Export Formats

1. Click "Export" in the top menu
2. Choose from available formats:
   - Video (MP4)
   - Animated GIF
   - Image sequence (PNG)
   - JSON (for importing into Court Coder later)

### Sharing Options

1. After exporting, you can:
   - Download the file to your device
   - Generate a shareable link (requires optional account)
   - Send directly to team members (requires optional account)

## Tips and Best Practices

### For Better Animations

- Keep movements realistic in terms of timing and speed
- Use the AI enhancement for natural-looking player movements
- Add a slight delay between consecutive actions for clarity

### For Team Instruction

- Use annotations to highlight key teaching points
- Consider creating variations of the same play to show different defensive responses
- Keep plays simple enough to be understood quickly

### For Performance

- Close other browser tabs when using AI features
- Limit the number of players and complex movements for smoother animations
- Consider using half-court view for detailed plays

## Troubleshooting

### Common Issues

- **Slow Animation**: Reduce the number of players or simplify movements
- **AI Not Working**: Ensure your browser supports WebGL and try refreshing
- **Movements Look Unrealistic**: Try using the AI enhancement or adjust player speeds
- **Changes Not Saving**: Check your browser's storage permissions

### Getting Help

- Click the "Help" button in the application
- Visit our [GitHub Issues](https://github.com/dxaginfo/court-coder-basketball-playbook/issues) page
- Check the [FAQ](https://github.com/dxaginfo/court-coder-basketball-playbook/wiki/FAQ) for common questions
/**
 * Court Coder - Basketball Playbook Animator
 * Main Application JavaScript
 * 
 * This file initializes the Vue application and coordinates the various components
 */

// Create a new Vue application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Vue application
    const app = new Vue({
        el: '#app',
        data: {
            // Application state
            currentPlay: {
                id: null,
                title: 'Untitled Play',
                courtType: 'half', // 'full', 'half', 'zone'
                players: [],
                paths: [],
                ball: null,
                annotations: []
            },
            // UI state
            ui: {
                selectedTool: 'select', // 'select', 'path', 'pass', 'screen', 'text', 'ball'
                selectedObject: null,
                isPlaying: false,
                playbackSpeed: 1,
                currentTime: 0,
                maxTime: 10000, // 10 seconds in ms
                showWelcomeScreen: true,
                showAIModal: false,
                isDragging: false,
                zoomLevel: 1
            },
            // Library of saved plays
            library: [],
            // User preferences
            preferences: {
                autoSave: true,
                showHints: true,
                snapToGrid: true,
                defaultCourtType: 'half'
            }
        },
        computed: {
            // Calculate if the current play has been modified
            isModified() {
                // Implementation would compare current state with saved state
                return true;
            },
            
            // Calculate if the play can be played (has content)
            canPlay() {
                return this.currentPlay.players.length > 0;
            },
            
            // Format current time for display
            formattedTime() {
                const seconds = Math.floor(this.ui.currentTime / 1000);
                const ms = Math.floor((this.ui.currentTime % 1000) / 10);
                return `${seconds}.${ms.toString().padStart(2, '0')}`;
            }
        },
        methods: {
            // ===== Play Management =====
            
            // Create a new empty play
            newPlay() {
                if (this.isModified) {
                    // Ask to save current play
                    if (confirm('Do you want to save the current play before creating a new one?')) {
                        this.savePlay();
                    }
                }
                
                // Reset to default play
                this.currentPlay = {
                    id: null,
                    title: 'Untitled Play',
                    courtType: this.preferences.defaultCourtType,
                    players: [],
                    paths: [],
                    ball: null,
                    annotations: []
                };
                
                // Reset UI state
                this.ui.selectedObject = null;
                this.ui.currentTime = 0;
                this.ui.isPlaying = false;
                
                // Redraw the court
                this.$nextTick(() => {
                    courtManager.drawCourt(this.currentPlay.courtType);
                });
            },
            
            // Save the current play
            savePlay() {
                // If new play, generate ID
                if (!this.currentPlay.id) {
                    this.currentPlay.id = 'play_' + Date.now();
                }
                
                // Add timestamp
                const playToSave = {
                    ...this.currentPlay,
                    lastModified: Date.now()
                };
                
                // Save to library
                const existingIndex = this.library.findIndex(p => p.id === playToSave.id);
                if (existingIndex >= 0) {
                    this.library[existingIndex] = playToSave;
                } else {
                    this.library.push(playToSave);
                }
                
                // Save to localStorage
                this.saveToLocalStorage();
                
                // Show confirmation
                this.showNotification('Play saved successfully!');
            },
            
            // Load a play from the library
            loadPlay(playId) {
                if (this.isModified) {
                    // Ask to save current play
                    if (confirm('Do you want to save the current play before loading another one?')) {
                        this.savePlay();
                    }
                }
                
                // Find the play in the library
                const playToLoad = this.library.find(p => p.id === playId);
                if (playToLoad) {
                    this.currentPlay = JSON.parse(JSON.stringify(playToLoad)); // Deep copy
                    
                    // Reset UI state
                    this.ui.selectedObject = null;
                    this.ui.currentTime = 0;
                    this.ui.isPlaying = false;
                    
                    // Redraw the court
                    this.$nextTick(() => {
                        courtManager.drawCourt(this.currentPlay.courtType);
                        playerManager.renderPlayers(this.currentPlay.players);
                        pathManager.renderPaths(this.currentPlay.paths);
                        if (this.currentPlay.ball) {
                            ballManager.renderBall(this.currentPlay.ball);
                        }
                    });
                    
                    this.showNotification('Play loaded successfully!');
                }
            },
            
            // Export the current play
            exportPlay(format) {
                // Implementation depends on the export format
                switch (format) {
                    case 'video':
                        // Export as video - would require canvas recording API
                        alert('Video export not implemented yet');
                        break;
                    case 'gif':
                        // Export as GIF - would require a GIF library
                        alert('GIF export not implemented yet');
                        break;
                    case 'json':
                        // Export as JSON for sharing/importing
                        this.exportAsJson();
                        break;
                    default:
                        alert('Unknown export format');
                }
            },
            
            // Export play as JSON
            exportAsJson() {
                const json = JSON.stringify(this.currentPlay);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                // Create download link
                const a = document.createElement('a');
                a.href = url;
                a.download = `${this.currentPlay.title}.json`;
                document.body.appendChild(a);
                a.click();
                
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 0);
            },
            
            // ===== UI Interaction =====
            
            // Change the selected tool
            selectTool(toolName) {
                this.ui.selectedTool = toolName;
                // Update cursor style based on tool
                document.getElementById('court-canvas').className = `tool-${toolName}`;
            },
            
            // Toggle play/pause
            togglePlayback() {
                if (this.ui.isPlaying) {
                    this.pauseAnimation();
                } else {
                    this.playAnimation();
                }
            },
            
            // Start animation playback
            playAnimation() {
                if (!this.canPlay) return;
                
                this.ui.isPlaying = true;
                animationManager.play(this.ui.playbackSpeed);
            },
            
            // Pause animation playback
            pauseAnimation() {
                this.ui.isPlaying = false;
                animationManager.pause();
            },
            
            // Seek to a specific time in the animation
            seekTo(timeMs) {
                this.ui.currentTime = timeMs;
                animationManager.seekTo(timeMs);
            },
            
            // Change playback speed
            setPlaybackSpeed(speed) {
                this.ui.playbackSpeed = speed;
                if (this.ui.isPlaying) {
                    animationManager.setSpeed(speed);
                }
            },
            
            // Show a notification to the user
            showNotification(message, type = 'success') {
                // Simple implementation - could be enhanced with a toast library
                alert(message);
            },
            
            // ===== AI Enhancement =====
            
            // Open the AI enhancement modal
            openAIModal() {
                this.ui.showAIModal = true;
            },
            
            // Process AI enhancement request
            applyAIEnhancement(prompt) {
                // This would connect to the AI system
                // For demo purposes, we'll simulate an AI response
                this.ui.showAIModal = false;
                
                // Show loading indicator
                this.showNotification('Processing AI enhancement...', 'info');
                
                // Simulate AI processing delay
                setTimeout(() => {
                    // Here we would actually process the AI request
                    // For now, just show a confirmation
                    this.showNotification('AI enhancement applied!');
                    
                    // In a real implementation, the AI would return enhanced paths
                    // and we would update the current play with those
                }, 1500);
            },
            
            // ===== Data Persistence =====
            
            // Save application state to localStorage
            saveToLocalStorage() {
                try {
                    localStorage.setItem('courtCoder.library', JSON.stringify(this.library));
                    localStorage.setItem('courtCoder.preferences', JSON.stringify(this.preferences));
                } catch (error) {
                    console.error('Failed to save to localStorage:', error);
                }
            },
            
            // Load application state from localStorage
            loadFromLocalStorage() {
                try {
                    const savedLibrary = localStorage.getItem('courtCoder.library');
                    if (savedLibrary) {
                        this.library = JSON.parse(savedLibrary);
                    }
                    
                    const savedPreferences = localStorage.getItem('courtCoder.preferences');
                    if (savedPreferences) {
                        this.preferences = JSON.parse(savedPreferences);
                    }
                    
                    // Check if this is the first time using the app
                    const firstVisit = localStorage.getItem('courtCoder.firstVisit');
                    if (!firstVisit) {
                        this.ui.showWelcomeScreen = true;
                        localStorage.setItem('courtCoder.firstVisit', 'false');
                    } else {
                        this.ui.showWelcomeScreen = false;
                    }
                } catch (error) {
                    console.error('Failed to load from localStorage:', error);
                }
            },
            
            // ===== Lifecycle Hooks =====
            
            // Initialize the application
            initialize() {
                // Load saved data
                this.loadFromLocalStorage();
                
                // Initialize canvas managers
                courtManager.initialize('court-canvas');
                playerManager.initialize(this);
                pathManager.initialize(this);
                ballManager.initialize(this);
                animationManager.initialize(this);
                
                // Draw initial court
                courtManager.drawCourt(this.currentPlay.courtType);
                
                // Set up event listeners for window events
                window.addEventListener('beforeunload', (event) => {
                    if (this.isModified && this.preferences.autoSave) {
                        this.savePlay();
                    }
                });
                
                // Dismiss welcome screen handler
                document.querySelector('.welcome-screen button').addEventListener('click', () => {
                    this.ui.showWelcomeScreen = false;
                });
            }
        },
        // When Vue is mounted
        mounted() {
            this.initialize();
        }
    });
    
    // Expose the app instance globally for debugging
    window.courtCoderApp = app;
});

// Placeholder for the court manager module
// In a production app, this would be a separate file
const courtManager = {
    canvas: null,
    ctx: null,
    
    initialize(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found:', canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
    },
    
    drawCourt(courtType) {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set up court colors
        this.ctx.fillStyle = '#ffdfc4'; // Court color
        this.ctx.strokeStyle = '#8b4513'; // Court lines
        this.ctx.lineWidth = 2;
        
        // Fill court background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw court based on type
        switch (courtType) {
            case 'full':
                this.drawFullCourt();
                break;
            case 'half':
                this.drawHalfCourt();
                break;
            case 'zone':
                this.drawZoneView();
                break;
            default:
                this.drawHalfCourt();
        }
    },
    
    drawFullCourt() {
        // This would contain the full implementation
        // For brevity, just drawing a placeholder
        this.ctx.strokeRect(50, 50, this.canvas.width - 100, this.canvas.height - 100);
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 60, 0, Math.PI * 2);
        this.ctx.stroke();
    },
    
    drawHalfCourt() {
        // This would contain the full implementation
        // For brevity, just drawing a placeholder
        this.ctx.strokeRect(50, 50, this.canvas.width - 100, (this.canvas.height - 100) / 2);
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 4 + 50, 60, 0, Math.PI * 2);
        this.ctx.stroke();
    },
    
    drawZoneView() {
        // This would contain the full implementation
        // For brevity, just drawing a placeholder
        this.ctx.strokeRect(150, 50, this.canvas.width - 300, (this.canvas.height - 100) / 2);
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 4 + 50, 40, 0, Math.PI * 2);
        this.ctx.stroke();
    }
};

// Placeholder declarations for other managers
// These would be defined in separate files in a production app
const playerManager = {
    initialize(app) {},
    renderPlayers(players) {}
};

const pathManager = {
    initialize(app) {},
    renderPaths(paths) {}
};

const ballManager = {
    initialize(app) {},
    renderBall(ball) {}
};

const animationManager = {
    initialize(app) {},
    play(speed) {},
    pause() {},
    seekTo(timeMs) {},
    setSpeed(speed) {}
};
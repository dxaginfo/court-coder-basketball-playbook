/**
 * Court Coder - Basketball Playbook Animator
 * AI Enhancement JavaScript
 * 
 * This file handles AI-driven enhancements to basketball plays
 */

// AI Manager Module
const aiManager = (function() {
    // Private variables
    let app = null;
    
    // Strategy patterns for different play types
    const playStrategies = {
        pickAndRoll: {
            name: 'Pick and Roll',
            description: 'A screen followed by a roll to the basket',
            requiredPlayers: 2,
            generatePlay: function(players, court) {
                // This would generate a basic pick and roll play
                // For demo purposes, we'll return pre-defined paths
                
                // Find ballhandler (usually guard) and screener (usually big)
                let ballHandler, screener;
                
                if (players.length >= 2) {
                    // Simple assignment based on roles if available
                    ballHandler = players.find(p => ['PG', 'SG'].includes(p.role));
                    screener = players.find(p => ['C', 'PF'].includes(p.role));
                    
                    // Fallback if roles not set
                    if (!ballHandler) ballHandler = players[0];
                    if (!screener || screener.id === ballHandler.id) {
                        screener = players.find(p => p.id !== ballHandler.id);
                    }
                    
                    // Create paths for players
                    return [
                        // Ball handler path
                        {
                            playerId: ballHandler.id,
                            points: [
                                { x: ballHandler.x, y: ballHandler.y, t: 0 },
                                { x: ballHandler.x + 30, y: ballHandler.y, t: 1000 },
                                { x: ballHandler.x + 50, y: ballHandler.y - 20, t: 2000 },
                                { x: ballHandler.x + 70, y: ballHandler.y - 10, t: 3000 }
                            ],
                            type: 'dribble',
                            speed: 'normal'
                        },
                        // Screener path
                        {
                            playerId: screener.id,
                            points: [
                                { x: screener.x, y: screener.y, t: 0 },
                                { x: ballHandler.x + 25, y: ballHandler.y + 5, t: 1000 }, // Set screen
                                { x: ballHandler.x + 40, y: ballHandler.y - 30, t: 2000 }, // Roll to basket
                                { x: ballHandler.x + 50, y: ballHandler.y - 40, t: 3000 }
                            ],
                            type: 'cut',
                            speed: 'normal'
                        },
                        // Ball path (pass to screener at the end)
                        {
                            type: 'ball',
                            points: [
                                { x: ballHandler.x, y: ballHandler.y, t: 0, playerId: ballHandler.id },
                                { x: ballHandler.x + 30, y: ballHandler.y, t: 1000, playerId: ballHandler.id },
                                { x: ballHandler.x + 50, y: ballHandler.y - 20, t: 2000, playerId: ballHandler.id },
                                { x: ballHandler.x + 55, y: ballHandler.y - 25, t: 2500, playerId: null }, // Ball in air
                                { x: ballHandler.x + 50, y: ballHandler.y - 40, t: 3000, playerId: screener.id }
                            ]
                        }
                    ];
                }
                
                return [];
            }
        },
        
        fastBreak: {
            name: 'Fast Break',
            description: 'Quick transition offense',
            requiredPlayers: 3,
            generatePlay: function(players, court) {
                // This would generate a basic fast break play
                // For demo purposes, we'll return pre-defined paths
                
                if (players.length >= 3) {
                    // Sort players by role/position
                    const pointGuard = players.find(p => p.role === 'PG') || players[0];
                    const remainingPlayers = players.filter(p => p.id !== pointGuard.id);
                    
                    // Create paths for a simple fast break
                    const paths = [
                        // Point guard dribbling up court
                        {
                            playerId: pointGuard.id,
                            points: [
                                { x: pointGuard.x, y: pointGuard.y, t: 0 },
                                { x: pointGuard.x + 50, y: pointGuard.y, t: 1000 },
                                { x: pointGuard.x + 100, y: pointGuard.y, t: 2000 }
                            ],
                            type: 'dribble',
                            speed: 'fast'
                        }
                    ];
                    
                    // Add wing players running the lanes
                    if (remainingPlayers.length >= 2) {
                        // Left wing
                        paths.push({
                            playerId: remainingPlayers[0].id,
                            points: [
                                { x: remainingPlayers[0].x, y: remainingPlayers[0].y, t: 0 },
                                { x: pointGuard.x + 70, y: pointGuard.y - 40, t: 1500 },
                                { x: pointGuard.x + 120, y: pointGuard.y - 50, t: 2500 }
                            ],
                            type: 'cut',
                            speed: 'fast'
                        });
                        
                        // Right wing
                        paths.push({
                            playerId: remainingPlayers[1].id,
                            points: [
                                { x: remainingPlayers[1].x, y: remainingPlayers[1].y, t: 0 },
                                { x: pointGuard.x + 60, y: pointGuard.y + 30, t: 1500 },
                                { x: pointGuard.x + 110, y: pointGuard.y + 45, t: 2500 }
                            ],
                            type: 'cut',
                            speed: 'fast'
                        });
                        
                        // Add ball path with a pass to the left wing
                        paths.push({
                            type: 'ball',
                            points: [
                                { x: pointGuard.x, y: pointGuard.y, t: 0, playerId: pointGuard.id },
                                { x: pointGuard.x + 50, y: pointGuard.y, t: 1000, playerId: pointGuard.id },
                                { x: pointGuard.x + 90, y: pointGuard.y - 20, t: 2000, playerId: pointGuard.id },
                                { x: pointGuard.x + 105, y: pointGuard.y - 35, t: 2250, playerId: null }, // Ball in air
                                { x: pointGuard.x + 120, y: pointGuard.y - 50, t: 2500, playerId: remainingPlayers[0].id }
                            ]
                        });
                    }
                    
                    return paths;
                }
                
                return [];
            }
        },
        
        motionOffense: {
            name: 'Motion Offense',
            description: 'Continuous movement and screening',
            requiredPlayers: 5,
            generatePlay: function(players, court) {
                // This would generate a complex motion offense
                // This is just a placeholder for a more complex implementation
                
                // For a real implementation, this would use an algorithm to generate
                // realistic player movements based on spacing principles, etc.
                
                return []; // Placeholder
            }
        }
    };
    
    // Dictionary of basketball terms to detect in user prompts
    const basketballTerms = {
        'pick and roll': playStrategies.pickAndRoll,
        'ball screen': playStrategies.pickAndRoll,
        'screen and roll': playStrategies.pickAndRoll,
        'pick and pop': playStrategies.pickAndRoll, // Variation
        'fast break': playStrategies.fastBreak,
        'transition': playStrategies.fastBreak,
        'motion offense': playStrategies.motionOffense,
        'ball movement': playStrategies.motionOffense,
        'flex offense': playStrategies.motionOffense,
        'screen away': playStrategies.motionOffense,
        // More terms could be added
    };
    
    // Public methods
    return {
        // Initialize the AI manager
        initialize: function(appInstance) {
            app = appInstance;
            
            // Set up event listeners for AI enhancement
            const aiEnhanceBtn = document.querySelector('.btn.highlight[title="Use AI to enhance your play"]');
            if (aiEnhanceBtn) {
                aiEnhanceBtn.addEventListener('click', this.openAIModal.bind(this));
            }
            
            // Setup modal dialog listeners
            const modal = document.getElementById('ai-modal');
            const closeBtn = modal.querySelector('.close-btn');
            const cancelBtn = modal.querySelector('.modal-footer .btn:not(.highlight)');
            const applyBtn = modal.querySelector('.modal-footer .btn.highlight');
            
            closeBtn.addEventListener('click', this.closeAIModal.bind(this));
            cancelBtn.addEventListener('click', this.closeAIModal.bind(this));
            applyBtn.addEventListener('click', this.applyAIEnhancement.bind(this));
        },
        
        // Open the AI enhancement modal
        openAIModal: function() {
            const modal = document.getElementById('ai-modal');
            modal.style.display = 'flex';
            
            // Focus the textarea
            setTimeout(() => {
                modal.querySelector('textarea').focus();
            }, 100);
        },
        
        // Close the AI enhancement modal
        closeAIModal: function() {
            const modal = document.getElementById('ai-modal');
            modal.style.display = 'none';
        },
        
        // Apply AI enhancement based on user input
        applyAIEnhancement: function() {
            const modal = document.getElementById('ai-modal');
            const prompt = modal.querySelector('textarea').value.trim();
            
            if (!prompt) {
                alert('Please enter a description of the play you want to create.');
                return;
            }
            
            // Close the modal
            this.closeAIModal();
            
            // Show loading indicator
            this.showLoadingIndicator();
            
            // Process the prompt (in a real implementation, this might be an API call)
            setTimeout(() => {
                this.processPrompt(prompt);
            }, 1000);
        },
        
        // Show loading indicator
        showLoadingIndicator: function() {
            // Create a loading overlay
            const overlay = document.createElement('div');
            overlay.classList.add('loading-overlay');
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Analyzing play and generating enhancements...</p>
            `;
            
            // Apply styles
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.color = 'white';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '1000';
            
            document.body.appendChild(overlay);
            
            // Store reference to remove later
            this.loadingOverlay = overlay;
        },
        
        // Hide loading indicator
        hideLoadingIndicator: function() {
            if (this.loadingOverlay) {
                document.body.removeChild(this.loadingOverlay);
                this.loadingOverlay = null;
            }
        },
        
        // Process the user's prompt
        processPrompt: function(prompt) {
            console.log('Processing prompt:', prompt);
            
            // Extract play type and details from the prompt
            const playType = this.identifyPlayType(prompt);
            
            if (playType) {
                // Generate paths based on the identified play type
                const currentPlayers = app.currentPlay.players;
                
                if (currentPlayers.length < playType.requiredPlayers) {
                    this.hideLoadingIndicator();
                    alert(`This play requires at least ${playType.requiredPlayers} players. Please add more players to the court.`);
                    return;
                }
                
                // Generate paths for the play
                const generatedPaths = playType.generatePlay(currentPlayers, {
                    type: app.currentPlay.courtType,
                    // Additional court info could be provided here
                });
                
                // Apply the paths to the current play
                if (generatedPaths.length > 0) {
                    // Clear existing paths
                    app.currentPlay.paths = [];
                    
                    // Add new paths
                    app.currentPlay.paths = generatedPaths.filter(p => p.type !== 'ball');
                    
                    // Handle ball path separately
                    const ballPath = generatedPaths.find(p => p.type === 'ball');
                    if (ballPath) {
                        app.currentPlay.ball = {
                            path: ballPath.points,
                            visible: true
                        };
                    }
                    
                    // Update UI
                    app.ui.currentTime = 0;
                    
                    // Notify the path manager to redraw
                    if (window.pathManager) {
                        pathManager.renderPaths(app.currentPlay.paths);
                    }
                    
                    // Notify the ball manager to redraw
                    if (window.ballManager && app.currentPlay.ball) {
                        ballManager.renderBall(app.currentPlay.ball);
                    }
                    
                    // Show success message
                    this.hideLoadingIndicator();
                    this.showAIResults(playType.name, prompt);
                } else {
                    // No paths generated
                    this.hideLoadingIndicator();
                    alert('Could not generate a play from your description. Please try a different prompt.');
                }
            } else {
                // No play type identified
                this.hideLoadingIndicator();
                alert('Could not identify a specific play type. Please try a more specific basketball-related prompt.');
            }
        },
        
        // Identify the play type from the prompt
        identifyPlayType: function(prompt) {
            // Convert prompt to lowercase for case-insensitive matching
            const lowerPrompt = prompt.toLowerCase();
            
            // Check for each basketball term
            for (const term in basketballTerms) {
                if (lowerPrompt.includes(term)) {
                    return basketballTerms[term];
                }
            }
            
            // If no specific term is found, try to infer from context
            if (lowerPrompt.includes('screen') || lowerPrompt.includes('pick')) {
                return playStrategies.pickAndRoll;
            }
            
            if (lowerPrompt.includes('fast') || lowerPrompt.includes('break') || 
                lowerPrompt.includes('quick') || lowerPrompt.includes('transition')) {
                return playStrategies.fastBreak;
            }
            
            if (lowerPrompt.includes('motion') || lowerPrompt.includes('movement') || 
                lowerPrompt.includes('passing') || lowerPrompt.includes('offense')) {
                return playStrategies.motionOffense;
            }
            
            // Default to null if no match
            return null;
        },
        
        // Show AI results
        showAIResults: function(playName, prompt) {
            // Create a results overlay
            const overlay = document.createElement('div');
            overlay.classList.add('ai-results-overlay');
            overlay.innerHTML = `
                <div class="ai-results-content">
                    <h2>AI Play Enhancement</h2>
                    <div class="success-icon">✓</div>
                    <p>Successfully created a <strong>${playName}</strong> play based on your description:</p>
                    <blockquote>"${prompt}"</blockquote>
                    <p>The animation has been updated with coordinated player movements and ball handling.</p>
                    <div class="ai-results-actions">
                        <button class="btn highlight">OK</button>
                    </div>
                </div>
            `;
            
            // Apply styles
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.display = 'flex';
            overlay.style.alignItems = 'center';
            overlay.style.justifyContent = 'center';
            overlay.style.zIndex = '1000';
            
            const content = overlay.querySelector('.ai-results-content');
            content.style.backgroundColor = 'white';
            content.style.borderRadius = '8px';
            content.style.padding = '2rem';
            content.style.maxWidth = '500px';
            content.style.textAlign = 'center';
            
            const successIcon = overlay.querySelector('.success-icon');
            successIcon.style.fontSize = '4rem';
            successIcon.style.color = '#4CAF50';
            successIcon.style.margin = '1rem 0';
            
            const blockquote = overlay.querySelector('blockquote');
            blockquote.style.fontStyle = 'italic';
            blockquote.style.color = '#666';
            blockquote.style.margin = '1rem 0';
            blockquote.style.padding = '0.5rem 1rem';
            blockquote.style.borderLeft = '4px solid #ccc';
            
            document.body.appendChild(overlay);
            
            // Add click handler to OK button
            overlay.querySelector('.btn').addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        },
        
        // Suggest improvements for an existing play
        suggestImprovements: function() {
            // This would analyze the current play and suggest improvements
            // For a real implementation, this would use more sophisticated analysis
            
            const suggestions = [];
            
            // Example checks
            const currentPlayers = app.currentPlay.players;
            const currentPaths = app.currentPlay.paths;
            
            // Check for player spacing
            if (currentPlayers.length >= 3) {
                // Check if players are too close together
                for (let i = 0; i < currentPlayers.length; i++) {
                    for (let j = i + 1; j < currentPlayers.length; j++) {
                        const dx = currentPlayers[i].x - currentPlayers[j].x;
                        const dy = currentPlayers[i].y - currentPlayers[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < 20) {
                            suggestions.push({
                                type: 'spacing',
                                message: `Players ${currentPlayers[i].number} and ${currentPlayers[j].number} are too close together. Consider improving spacing.`,
                                players: [currentPlayers[i].id, currentPlayers[j].id]
                            });
                            break;
                        }
                    }
                }
            }
            
            // Check if players have paths
            const playersWithoutPaths = currentPlayers.filter(p => 
                !currentPaths.some(path => path.playerId === p.id)
            );
            
            if (playersWithoutPaths.length > 0) {
                suggestions.push({
                    type: 'movement',
                    message: `${playersWithoutPaths.length} player(s) have no movement. Add paths for all players to create more dynamic plays.`,
                    players: playersWithoutPaths.map(p => p.id)
                });
            }
            
            return suggestions;
        }
    };
})();
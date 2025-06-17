/**
 * Court Coder - Basketball Playbook Animator
 * Player Management JavaScript
 * 
 * This file handles player creation, positioning, and movement
 */

// Player Manager Module
const playerManager = (function() {
    // Private variables
    let app = null;
    let canvas = null;
    let ctx = null;
    let selectedPlayer = null;
    let hoveredPlayer = null;
    let players = [];
    let isDragging = false;
    let isCreating = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    // Player constants
    const PLAYER_RADIUS = 20;
    const OFFENSE_COLOR = '#e63946';
    const DEFENSE_COLOR = '#1d3557';
    const SELECTED_COLOR = '#4CAF50';
    const HOVERED_COLOR = '#FFC107';
    
    // Helper functions
    function distanceBetween(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    function isPointInPlayer(x, y, player) {
        const canvasPoint = courtManager.courtToCanvas(player.x, player.y);
        return distanceBetween(x, y, canvasPoint.x, canvasPoint.y) <= PLAYER_RADIUS;
    }
    
    // Create a new player object
    function createPlayer(type, number, x, y) {
        return {
            id: 'player_' + Date.now() + Math.floor(Math.random() * 1000),
            type: type, // 'offense' or 'defense'
            number: number,
            x: x,
            y: y,
            role: '', // 'PG', 'SG', 'SF', 'PF', 'C'
            name: '',
            color: type === 'offense' ? OFFENSE_COLOR : DEFENSE_COLOR,
            paths: [] // References to associated paths
        };
    }
    
    // Public methods
    return {
        // Initialize the player manager
        initialize: function(appInstance) {
            app = appInstance;
            canvas = document.getElementById('court-canvas');
            if (!canvas) {
                console.error('Canvas element not found');
                return;
            }
            ctx = canvas.getContext('2d');
            
            // Set up event listeners
            canvas.addEventListener('courtClick', this.handleCourtClick.bind(this));
            canvas.addEventListener('courtDrag', this.handleCourtDrag.bind(this));
            canvas.addEventListener('courtMove', this.handleCourtMove.bind(this));
            canvas.addEventListener('courtRelease', this.handleCourtRelease.bind(this));
            
            // Listen for drag events from the player markers in the toolbar
            const playerMarkers = document.querySelectorAll('.player-marker');
            playerMarkers.forEach(marker => {
                marker.addEventListener('dragstart', this.handleDragStart.bind(this));
                marker.addEventListener('dragend', this.handleDragEnd.bind(this));
            });
            
            // Allow dropping on the canvas
            canvas.addEventListener('dragover', this.handleDragOver.bind(this));
            canvas.addEventListener('drop', this.handleDrop.bind(this));
        },
        
        // Get all players
        getPlayers: function() {
            return players;
        },
        
        // Set players from external source (like loading a play)
        setPlayers: function(newPlayers) {
            players = JSON.parse(JSON.stringify(newPlayers)); // Deep copy
            this.renderPlayers();
        },
        
        // Get a player by ID
        getPlayerById: function(id) {
            return players.find(p => p.id === id);
        },
        
        // Add a new player to the court
        addPlayer: function(type, number, x, y) {
            const player = createPlayer(type, number, x, y);
            players.push(player);
            
            // Update app state
            app.currentPlay.players = players;
            
            return player;
        },
        
        // Remove a player from the court
        removePlayer: function(playerId) {
            const index = players.findIndex(p => p.id === playerId);
            if (index !== -1) {
                // Remove associated paths first (would be handled by pathManager)
                if (window.pathManager) {
                    players[index].paths.forEach(pathId => {
                        pathManager.removePath(pathId);
                    });
                }
                
                players.splice(index, 1);
                
                // Update app state
                app.currentPlay.players = players;
                
                // If we're removing the selected player, clear selection
                if (selectedPlayer && selectedPlayer.id === playerId) {
                    selectedPlayer = null;
                    app.ui.selectedObject = null;
                }
                
                return true;
            }
            return false;
        },
        
        // Select a player
        selectPlayer: function(playerId) {
            const player = this.getPlayerById(playerId);
            if (player) {
                selectedPlayer = player;
                app.ui.selectedObject = {
                    type: 'player',
                    id: player.id
                };
                this.renderPlayers();
                return true;
            }
            return false;
        },
        
        // Deselect the current player
        deselectPlayer: function() {
            selectedPlayer = null;
            app.ui.selectedObject = null;
            this.renderPlayers();
        },
        
        // Update a player's properties
        updatePlayer: function(playerId, properties) {
            const player = this.getPlayerById(playerId);
            if (player) {
                Object.assign(player, properties);
                
                // Update the selected player if it's the one being modified
                if (selectedPlayer && selectedPlayer.id === playerId) {
                    selectedPlayer = player;
                }
                
                // Update app state
                app.currentPlay.players = players;
                
                this.renderPlayers();
                return true;
            }
            return false;
        },
        
        // Move a player to a new position
        movePlayer: function(playerId, x, y) {
            const player = this.getPlayerById(playerId);
            if (player) {
                player.x = x;
                player.y = y;
                
                // Update the selected player if it's the one being moved
                if (selectedPlayer && selectedPlayer.id === playerId) {
                    selectedPlayer = player;
                }
                
                // Update app state
                app.currentPlay.players = players;
                
                this.renderPlayers();
                return true;
            }
            return false;
        },
        
        // Render all players on the court
        renderPlayers: function() {
            // Players should be rendered by the main draw loop
            // This function might be called externally to trigger a redraw
            this.drawPlayers();
        },
        
        // Draw all players on the canvas
        drawPlayers: function() {
            if (!ctx) return;
            
            players.forEach(player => {
                const canvasPoint = courtManager.courtToCanvas(player.x, player.y);
                
                // Draw player circle
                ctx.beginPath();
                ctx.arc(canvasPoint.x, canvasPoint.y, PLAYER_RADIUS, 0, Math.PI * 2);
                
                // Determine fill color based on selection/hover state
                if (selectedPlayer && player.id === selectedPlayer.id) {
                    ctx.fillStyle = SELECTED_COLOR;
                } else if (hoveredPlayer && player.id === hoveredPlayer.id) {
                    ctx.fillStyle = HOVERED_COLOR;
                } else {
                    ctx.fillStyle = player.color;
                }
                
                ctx.fill();
                
                // Draw player border
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'white';
                ctx.stroke();
                
                // Draw player number
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(player.number, canvasPoint.x, canvasPoint.y);
                
                // Draw player role if set
                if (player.role) {
                    ctx.font = 'bold 10px Arial';
                    ctx.fillText(player.role, canvasPoint.x, canvasPoint.y + PLAYER_RADIUS + 10);
                }
                
                // Draw selection indicator if selected
                if (selectedPlayer && player.id === selectedPlayer.id) {
                    ctx.beginPath();
                    ctx.arc(canvasPoint.x, canvasPoint.y, PLAYER_RADIUS + 5, 0, Math.PI * 2);
                    ctx.strokeStyle = SELECTED_COLOR;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 3]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            });
        },
        
        // Find the player at the given coordinates
        findPlayerAt: function(x, y) {
            // Check from last to first (top to bottom in rendering order)
            for (let i = players.length - 1; i >= 0; i--) {
                if (isPointInPlayer(x, y, players[i])) {
                    return players[i];
                }
            }
            return null;
        },
        
        // Event handlers
        handleCourtClick: function(e) {
            const { canvasX, canvasY, originalEvent } = e.detail;
            
            // Check if we're clicking on a player
            const clickedPlayer = this.findPlayerAt(canvasX, canvasY);
            
            if (clickedPlayer) {
                // Select the player
                this.selectPlayer(clickedPlayer.id);
                
                // If using delete tool and not right-click
                if (app.ui.selectedTool === 'delete' && originalEvent.button !== 2) {
                    this.removePlayer(clickedPlayer.id);
                } else {
                    // Start dragging if using select tool
                    if (app.ui.selectedTool === 'select') {
                        isDragging = true;
                        const canvasPoint = courtManager.courtToCanvas(clickedPlayer.x, clickedPlayer.y);
                        dragOffsetX = canvasX - canvasPoint.x;
                        dragOffsetY = canvasY - canvasPoint.y;
                    }
                }
            } else {
                // If clicking on empty space
                if (app.ui.selectedTool === 'select') {
                    // Deselect current player
                    this.deselectPlayer();
                } else if (app.ui.selectedTool === 'player' && !isCreating) {
                    // Create a new player if using the player tool
                    isCreating = true;
                    const courtPoint = courtManager.canvasToCourt(canvasX, canvasY);
                    
                    // Determine next available number
                    const offensePlayers = players.filter(p => p.type === 'offense');
                    const defensePlayers = players.filter(p => p.type === 'defense');
                    
                    let nextNumber;
                    let type;
                    
                    if (originalEvent.shiftKey) {
                        // Create defense player with Shift key
                        type = 'defense';
                        nextNumber = defensePlayers.length > 0 ? 
                            Math.max(...defensePlayers.map(p => parseInt(p.number.replace('X', '')))) + 1 : 1;
                        nextNumber = 'X' + nextNumber;
                    } else {
                        // Create offense player by default
                        type = 'offense';
                        nextNumber = offensePlayers.length > 0 ? 
                            Math.max(...offensePlayers.map(p => parseInt(p.number))) + 1 : 1;
                    }
                    
                    const newPlayer = this.addPlayer(type, nextNumber, courtPoint.x, courtPoint.y);
                    this.selectPlayer(newPlayer.id);
                    this.renderPlayers();
                    
                    // Reset creation flag after a short delay
                    setTimeout(() => {
                        isCreating = false;
                    }, 200);
                }
            }
        },
        
        handleCourtDrag: function(e) {
            const { canvasX, canvasY } = e.detail;
            
            // If dragging a player
            if (isDragging && selectedPlayer) {
                const courtPoint = courtManager.canvasToCourt(canvasX - dragOffsetX, canvasY - dragOffsetY);
                this.movePlayer(selectedPlayer.id, courtPoint.x, courtPoint.y);
                
                // If paths are attached to this player, update them (would be handled by pathManager)
                if (window.pathManager) {
                    pathManager.updatePathsForPlayer(selectedPlayer.id);
                }
            }
        },
        
        handleCourtMove: function(e) {
            const { canvasX, canvasY } = e.detail;
            
            // Check for hover state
            const hoverPlayer = this.findPlayerAt(canvasX, canvasY);
            
            if (hoverPlayer !== hoveredPlayer) {
                hoveredPlayer = hoverPlayer;
                this.renderPlayers();
                
                // Update cursor
                if (hoveredPlayer) {
                    canvas.style.cursor = app.ui.selectedTool === 'delete' ? 'no-drop' : 'pointer';
                } else {
                    canvas.style.cursor = 'default';
                }
            }
        },
        
        handleCourtRelease: function(e) {
            isDragging = false;
            dragOffsetX = 0;
            dragOffsetY = 0;
        },
        
        // Drag and drop handlers for player creation
        handleDragStart: function(e) {
            // Store the player type and number in the drag data
            const playerType = e.target.classList.contains('offense') ? 'offense' : 'defense';
            const playerNumber = e.target.dataset.player;
            
            e.dataTransfer.setData('text/plain', JSON.stringify({
                type: playerType,
                number: playerNumber
            }));
            
            // Set drag image (could be customized further)
            e.dataTransfer.setDragImage(e.target, 10, 10);
        },
        
        handleDragEnd: function(e) {
            // Clean up any drag-related state
        },
        
        handleDragOver: function(e) {
            // Allow drop
            e.preventDefault();
        },
        
        handleDrop: function(e) {
            e.preventDefault();
            
            // Get the drop position in canvas coordinates
            const canvasPoint = courtManager.windowToCanvas(e.clientX, e.clientY);
            const courtPoint = courtManager.canvasToCourt(canvasPoint.x, canvasPoint.y);
            
            // Get the player data from the drag event
            try {
                const playerData = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (playerData.type && playerData.number) {
                    const newPlayer = this.addPlayer(playerData.type, playerData.number, courtPoint.x, courtPoint.y);
                    this.selectPlayer(newPlayer.id);
                    this.renderPlayers();
                }
            } catch (error) {
                console.error('Error processing dropped player:', error);
            }
        }
    };
})();
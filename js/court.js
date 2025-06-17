/**
 * Court Coder - Basketball Playbook Animator
 * Court Management JavaScript
 * 
 * This file handles the rendering and interaction with the basketball court
 */

// Court Manager Module
const courtManager = (function() {
    // Private variables
    let canvas = null;
    let ctx = null;
    let courtType = 'half'; // 'full', 'half', 'zone'
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    
    // Court dimensions (in feet, NBA regulation)
    const COURT_LENGTH = 94;
    const COURT_WIDTH = 50;
    const THREE_POINT_RADIUS = 23.75;
    const HOOP_RADIUS = 0.75;
    const FREE_THROW_LINE_DISTANCE = 15;
    const KEY_WIDTH = 16;
    const KEY_HEIGHT = 19;
    const CENTER_CIRCLE_RADIUS = 6;
    const BACKBOARD_WIDTH = 6;
    const BACKBOARD_DISTANCE = 4;
    
    // Colors
    const COURT_COLOR = '#ffdfc4';
    const LINE_COLOR = '#8b4513';
    const KEY_COLOR = '#ffebcd';
    const THREE_POINT_COLOR = '#8b4513';
    const CENTER_CIRCLE_COLOR = '#8b4513';
    const OUT_OF_BOUNDS_COLOR = '#d3d3d3';
    
    // Public methods
    return {
        // Initialize the court manager
        initialize: function(canvasId) {
            canvas = document.getElementById(canvasId);
            if (!canvas) {
                console.error('Canvas element not found:', canvasId);
                return;
            }
            
            ctx = canvas.getContext('2d');
            
            // Set up event listeners for court interaction
            canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
            canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
            canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
            canvas.addEventListener('wheel', this.handleMouseWheel.bind(this));
            
            // Touch events for mobile
            canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
            canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
            canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            // Handle window resize
            window.addEventListener('resize', this.handleResize.bind(this));
            
            // Initial drawing
            this.drawCourt(courtType);
        },
        
        // Handle window resize
        handleResize: function() {
            // Adjust canvas size based on container
            const container = canvas.parentElement;
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            
            // Redraw court with new dimensions
            this.drawCourt(courtType);
        },
        
        // Set the court type and redraw
        setCourtType: function(type) {
            if (['full', 'half', 'zone'].includes(type)) {
                courtType = type;
                this.drawCourt(courtType);
                return true;
            }
            return false;
        },
        
        // Convert court feet to canvas pixels
        feetToPixels: function(feet) {
            // Calculate the scale factor based on court size and canvas size
            let pixelsPerFoot = 0;
            
            if (courtType === 'full') {
                pixelsPerFoot = Math.min(
                    (canvas.width - 40) / COURT_LENGTH,
                    (canvas.height - 40) / COURT_WIDTH
                );
            } else if (courtType === 'half') {
                pixelsPerFoot = Math.min(
                    (canvas.width - 40) / COURT_WIDTH,
                    (canvas.height - 40) / (COURT_LENGTH / 2)
                );
            } else { // zone view
                pixelsPerFoot = Math.min(
                    (canvas.width - 40) / KEY_WIDTH * 1.5,
                    (canvas.height - 40) / KEY_HEIGHT * 1.5
                );
            }
            
            return feet * pixelsPerFoot * scale;
        },
        
        // Convert canvas pixels to court feet
        pixelsToFeet: function(pixels) {
            // Inverse of feetToPixels
            let pixelsPerFoot = 0;
            
            if (courtType === 'full') {
                pixelsPerFoot = Math.min(
                    (canvas.width - 40) / COURT_LENGTH,
                    (canvas.height - 40) / COURT_WIDTH
                );
            } else if (courtType === 'half') {
                pixelsPerFoot = Math.min(
                    (canvas.width - 40) / COURT_WIDTH,
                    (canvas.height - 40) / (COURT_LENGTH / 2)
                );
            } else { // zone view
                pixelsPerFoot = Math.min(
                    (canvas.width - 40) / KEY_WIDTH * 1.5,
                    (canvas.height - 40) / KEY_HEIGHT * 1.5
                );
            }
            
            return pixels / (pixelsPerFoot * scale);
        },
        
        // Main drawing function
        drawCourt: function(type) {
            if (!ctx || !canvas) return;
            
            // Update court type
            courtType = type || courtType;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Apply transformations
            ctx.save();
            ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
            ctx.scale(scale, scale);
            
            // Draw appropriate court
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
            
            // Restore canvas state
            ctx.restore();
        },
        
        // Draw a full basketball court
        drawFullCourt: function() {
            const courtLengthPx = this.feetToPixels(COURT_LENGTH);
            const courtWidthPx = this.feetToPixels(COURT_WIDTH);
            const centerX = 0;
            const centerY = 0;
            
            // Out of bounds area
            ctx.fillStyle = OUT_OF_BOUNDS_COLOR;
            ctx.fillRect(
                centerX - courtLengthPx / 2 - this.feetToPixels(2),
                centerY - courtWidthPx / 2 - this.feetToPixels(2),
                courtLengthPx + this.feetToPixels(4),
                courtWidthPx + this.feetToPixels(4)
            );
            
            // Court background
            ctx.fillStyle = COURT_COLOR;
            ctx.fillRect(
                centerX - courtLengthPx / 2,
                centerY - courtWidthPx / 2,
                courtLengthPx,
                courtWidthPx
            );
            
            // Court border
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = this.feetToPixels(0.2);
            ctx.strokeRect(
                centerX - courtLengthPx / 2,
                centerY - courtWidthPx / 2,
                courtLengthPx,
                courtWidthPx
            );
            
            // Center circle
            ctx.beginPath();
            ctx.arc(
                centerX,
                centerY,
                this.feetToPixels(CENTER_CIRCLE_RADIUS),
                0,
                Math.PI * 2
            );
            ctx.stroke();
            
            // Center line
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - courtWidthPx / 2);
            ctx.lineTo(centerX, centerY + courtWidthPx / 2);
            ctx.stroke();
            
            // Draw both halves of the court
            this.drawCourtHalf(centerX - courtLengthPx / 4, centerY, true);
            this.drawCourtHalf(centerX + courtLengthPx / 4, centerY, false);
        },
        
        // Draw a half court
        drawHalfCourt: function() {
            const courtLengthPx = this.feetToPixels(COURT_LENGTH / 2);
            const courtWidthPx = this.feetToPixels(COURT_WIDTH);
            const centerX = 0;
            const centerY = 0;
            
            // Out of bounds area
            ctx.fillStyle = OUT_OF_BOUNDS_COLOR;
            ctx.fillRect(
                centerX - courtLengthPx - this.feetToPixels(2),
                centerY - courtWidthPx / 2 - this.feetToPixels(2),
                courtLengthPx + this.feetToPixels(4),
                courtWidthPx + this.feetToPixels(4)
            );
            
            // Court background
            ctx.fillStyle = COURT_COLOR;
            ctx.fillRect(
                centerX - courtLengthPx,
                centerY - courtWidthPx / 2,
                courtLengthPx,
                courtWidthPx
            );
            
            // Court border
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = this.feetToPixels(0.2);
            ctx.strokeRect(
                centerX - courtLengthPx,
                centerY - courtWidthPx / 2,
                courtLengthPx,
                courtWidthPx
            );
            
            // Draw half court details
            this.drawCourtHalf(centerX - courtLengthPx / 2, centerY, true);
        },
        
        // Draw a zoomed-in view of the key area
        drawZoneView: function() {
            const keyWidthPx = this.feetToPixels(KEY_WIDTH);
            const keyHeightPx = this.feetToPixels(KEY_HEIGHT);
            const centerX = 0;
            const centerY = 0;
            
            // Calculate extended view area (1.5x the key size)
            const viewWidth = keyWidthPx * 1.5;
            const viewHeight = keyHeightPx * 1.5;
            
            // Out of bounds area
            ctx.fillStyle = OUT_OF_BOUNDS_COLOR;
            ctx.fillRect(
                centerX - viewWidth / 2 - this.feetToPixels(1),
                centerY - viewHeight / 2 - this.feetToPixels(1),
                viewWidth + this.feetToPixels(2),
                viewHeight + this.feetToPixels(2)
            );
            
            // Court background
            ctx.fillStyle = COURT_COLOR;
            ctx.fillRect(
                centerX - viewWidth / 2,
                centerY - viewHeight / 2,
                viewWidth,
                viewHeight
            );
            
            // Court border
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = this.feetToPixels(0.1);
            ctx.strokeRect(
                centerX - viewWidth / 2,
                centerY - viewHeight / 2,
                viewWidth,
                viewHeight
            );
            
            // Draw key (adjusted for center)
            this.drawKey(centerX, centerY - viewHeight / 4);
        },
        
        // Draw one half of the court with all details
        drawCourtHalf: function(centerX, centerY, isLeft) {
            const direction = isLeft ? 1 : -1;
            const courtWidthPx = this.feetToPixels(COURT_WIDTH);
            const keyWidthPx = this.feetToPixels(KEY_WIDTH);
            const keyHeightPx = this.feetToPixels(KEY_HEIGHT);
            const ftLineDistancePx = this.feetToPixels(FREE_THROW_LINE_DISTANCE);
            const threePointRadiusPx = this.feetToPixels(THREE_POINT_RADIUS);
            
            // Key (paint) area
            ctx.fillStyle = KEY_COLOR;
            ctx.fillRect(
                centerX - direction * (ftLineDistancePx - keyHeightPx),
                centerY - keyWidthPx / 2,
                keyHeightPx,
                keyWidthPx
            );
            ctx.strokeStyle = LINE_COLOR;
            ctx.strokeRect(
                centerX - direction * (ftLineDistancePx - keyHeightPx),
                centerY - keyWidthPx / 2,
                keyHeightPx,
                keyWidthPx
            );
            
            // Free throw line
            ctx.beginPath();
            ctx.moveTo(
                centerX - direction * (ftLineDistancePx - keyHeightPx),
                centerY - keyWidthPx / 2
            );
            ctx.lineTo(
                centerX - direction * (ftLineDistancePx - keyHeightPx),
                centerY + keyWidthPx / 2
            );
            ctx.stroke();
            
            // Free throw semi-circle
            ctx.beginPath();
            ctx.arc(
                centerX - direction * (ftLineDistancePx - keyHeightPx),
                centerY,
                this.feetToPixels(6),
                direction * Math.PI * 0.5,
                direction * Math.PI * 1.5,
                !isLeft
            );
            ctx.stroke();
            
            // Hoop and backboard
            ctx.beginPath();
            ctx.arc(
                centerX,
                centerY,
                this.feetToPixels(HOOP_RADIUS),
                0,
                Math.PI * 2
            );
            ctx.stroke();
            
            // Backboard
            ctx.beginPath();
            ctx.moveTo(
                centerX - this.feetToPixels(BACKBOARD_WIDTH / 2),
                centerY + this.feetToPixels(BACKBOARD_DISTANCE)
            );
            ctx.lineTo(
                centerX + this.feetToPixels(BACKBOARD_WIDTH / 2),
                centerY + this.feetToPixels(BACKBOARD_DISTANCE)
            );
            ctx.lineWidth = this.feetToPixels(0.3);
            ctx.stroke();
            ctx.lineWidth = this.feetToPixels(0.2);
            
            // Three-point line
            ctx.beginPath();
            ctx.arc(
                centerX,
                centerY,
                threePointRadiusPx,
                direction * Math.PI * 0.3,
                direction * Math.PI * 0.7,
                !isLeft
            );
            ctx.stroke();
            
            // Three-point line straight segments
            const threePointY = Math.sin(Math.PI * 0.3) * threePointRadiusPx;
            
            ctx.beginPath();
            ctx.moveTo(
                centerX - direction * Math.cos(Math.PI * 0.3) * threePointRadiusPx,
                centerY - threePointY
            );
            ctx.lineTo(
                centerX - direction * (this.feetToPixels(COURT_LENGTH / 2) - 3),
                centerY - threePointY
            );
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(
                centerX - direction * Math.cos(Math.PI * 0.3) * threePointRadiusPx,
                centerY + threePointY
            );
            ctx.lineTo(
                centerX - direction * (this.feetToPixels(COURT_LENGTH / 2) - 3),
                centerY + threePointY
            );
            ctx.stroke();
        },
        
        // Draw the key (paint) area
        drawKey: function(centerX, centerY) {
            const keyWidthPx = this.feetToPixels(KEY_WIDTH);
            const keyHeightPx = this.feetToPixels(KEY_HEIGHT);
            const ftLineDistancePx = this.feetToPixels(FREE_THROW_LINE_DISTANCE);
            
            // Key (paint) area
            ctx.fillStyle = KEY_COLOR;
            ctx.fillRect(
                centerX - keyHeightPx,
                centerY - keyWidthPx / 2,
                keyHeightPx,
                keyWidthPx
            );
            ctx.strokeStyle = LINE_COLOR;
            ctx.strokeRect(
                centerX - keyHeightPx,
                centerY - keyWidthPx / 2,
                keyHeightPx,
                keyWidthPx
            );
            
            // Free throw line
            ctx.beginPath();
            ctx.moveTo(
                centerX - keyHeightPx,
                centerY - keyWidthPx / 2
            );
            ctx.lineTo(
                centerX - keyHeightPx,
                centerY + keyWidthPx / 2
            );
            ctx.stroke();
            
            // Free throw semi-circle
            ctx.beginPath();
            ctx.arc(
                centerX - keyHeightPx,
                centerY,
                this.feetToPixels(6),
                Math.PI * 0.5,
                Math.PI * 1.5,
                false
            );
            ctx.stroke();
            
            // Hoop and backboard
            ctx.beginPath();
            ctx.arc(
                centerX,
                centerY,
                this.feetToPixels(HOOP_RADIUS),
                0,
                Math.PI * 2
            );
            ctx.stroke();
            
            // Backboard
            ctx.beginPath();
            ctx.moveTo(
                centerX - this.feetToPixels(BACKBOARD_WIDTH / 2),
                centerY + this.feetToPixels(BACKBOARD_DISTANCE)
            );
            ctx.lineTo(
                centerX + this.feetToPixels(BACKBOARD_WIDTH / 2),
                centerY + this.feetToPixels(BACKBOARD_DISTANCE)
            );
            ctx.lineWidth = this.feetToPixels(0.3);
            ctx.stroke();
            ctx.lineWidth = this.feetToPixels(0.2);
            
            // Lane markings (hash marks)
            for (let i = 1; i < 4; i++) {
                // Bottom lane markings
                ctx.beginPath();
                ctx.moveTo(
                    centerX - keyHeightPx + i * keyHeightPx / 4,
                    centerY - keyWidthPx / 2
                );
                ctx.lineTo(
                    centerX - keyHeightPx + i * keyHeightPx / 4,
                    centerY - keyWidthPx / 2 + this.feetToPixels(1)
                );
                ctx.stroke();
                
                // Top lane markings
                ctx.beginPath();
                ctx.moveTo(
                    centerX - keyHeightPx + i * keyHeightPx / 4,
                    centerY + keyWidthPx / 2
                );
                ctx.lineTo(
                    centerX - keyHeightPx + i * keyHeightPx / 4,
                    centerY + keyWidthPx / 2 - this.feetToPixels(1)
                );
                ctx.stroke();
            }
        },
        
        // Convert window coordinates to canvas coordinates
        windowToCanvas: function(x, y) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (x - rect.left) * (canvas.width / rect.width),
                y: (y - rect.top) * (canvas.height / rect.height)
            };
        },
        
        // Convert canvas coordinates to court coordinates
        canvasToCourt: function(x, y) {
            // Adjust for pan and zoom
            const courtX = (x - canvas.width / 2 - offsetX) / scale;
            const courtY = (y - canvas.height / 2 - offsetY) / scale;
            return { x: courtX, y: courtY };
        },
        
        // Convert court coordinates to canvas coordinates
        courtToCanvas: function(x, y) {
            // Adjust for pan and zoom
            const canvasX = x * scale + canvas.width / 2 + offsetX;
            const canvasY = y * scale + canvas.height / 2 + offsetY;
            return { x: canvasX, y: canvasY };
        },
        
        // Reset the view to default
        resetView: function() {
            scale = 1;
            offsetX = 0;
            offsetY = 0;
            this.drawCourt(courtType);
        },
        
        // Zoom to a specific level centered on a point
        zoomTo: function(newScale, centerX, centerY) {
            // Limit zoom level
            newScale = Math.max(0.5, Math.min(3, newScale));
            
            // Calculate how much the coordinates will change
            const dx = (centerX - canvas.width / 2) - (centerX - canvas.width / 2) * (newScale / scale);
            const dy = (centerY - canvas.height / 2) - (centerY - canvas.height / 2) * (newScale / scale);
            
            // Update scale and offset
            scale = newScale;
            offsetX += dx;
            offsetY += dy;
            
            // Redraw the court
            this.drawCourt(courtType);
        },
        
        // Event Handlers
        handleMouseDown: function(e) {
            const canvasPoint = this.windowToCanvas(e.clientX, e.clientY);
            lastX = canvasPoint.x;
            lastY = canvasPoint.y;
            isDragging = true;
            
            // Dispatch an event for other modules to handle
            const courtPoint = this.canvasToCourt(canvasPoint.x, canvasPoint.y);
            const customEvent = new CustomEvent('courtClick', {
                detail: {
                    x: courtPoint.x,
                    y: courtPoint.y,
                    canvasX: canvasPoint.x,
                    canvasY: canvasPoint.y,
                    originalEvent: e
                }
            });
            canvas.dispatchEvent(customEvent);
        },
        
        handleMouseMove: function(e) {
            const canvasPoint = this.windowToCanvas(e.clientX, e.clientY);
            
            if (isDragging) {
                // Pan the court if in pan mode or holding the spacebar
                if (e.shiftKey) {
                    const dx = canvasPoint.x - lastX;
                    const dy = canvasPoint.y - lastY;
                    offsetX += dx;
                    offsetY += dy;
                    this.drawCourt(courtType);
                }
                
                // Dispatch a drag event
                const courtPoint = this.canvasToCourt(canvasPoint.x, canvasPoint.y);
                const customEvent = new CustomEvent('courtDrag', {
                    detail: {
                        x: courtPoint.x,
                        y: courtPoint.y,
                        canvasX: canvasPoint.x,
                        canvasY: canvasPoint.y,
                        dx: canvasPoint.x - lastX,
                        dy: canvasPoint.y - lastY,
                        originalEvent: e
                    }
                });
                canvas.dispatchEvent(customEvent);
            }
            
            // Dispatch a move event
            const courtPoint = this.canvasToCourt(canvasPoint.x, canvasPoint.y);
            const customEvent = new CustomEvent('courtMove', {
                detail: {
                    x: courtPoint.x,
                    y: courtPoint.y,
                    canvasX: canvasPoint.x,
                    canvasY: canvasPoint.y,
                    originalEvent: e
                }
            });
            canvas.dispatchEvent(customEvent);
            
            lastX = canvasPoint.x;
            lastY = canvasPoint.y;
        },
        
        handleMouseUp: function(e) {
            isDragging = false;
            
            // Dispatch an event
            const canvasPoint = this.windowToCanvas(e.clientX, e.clientY);
            const courtPoint = this.canvasToCourt(canvasPoint.x, canvasPoint.y);
            const customEvent = new CustomEvent('courtRelease', {
                detail: {
                    x: courtPoint.x,
                    y: courtPoint.y,
                    canvasX: canvasPoint.x,
                    canvasY: canvasPoint.y,
                    originalEvent: e
                }
            });
            canvas.dispatchEvent(customEvent);
        },
        
        handleMouseWheel: function(e) {
            e.preventDefault();
            
            const canvasPoint = this.windowToCanvas(e.clientX, e.clientY);
            
            // Calculate new scale
            const zoomIntensity = 0.1;
            const delta = e.deltaY < 0 ? 1 : -1;
            const newScale = scale * (1 + delta * zoomIntensity);
            
            // Zoom centered on mouse position
            this.zoomTo(newScale, canvasPoint.x, canvasPoint.y);
        },
        
        // Touch event handlers
        handleTouchStart: function(e) {
            if (e.touches.length === 1) {
                e.preventDefault();
                const touch = e.touches[0];
                const canvasPoint = this.windowToCanvas(touch.clientX, touch.clientY);
                lastX = canvasPoint.x;
                lastY = canvasPoint.y;
                isDragging = true;
                
                // Dispatch an event
                const courtPoint = this.canvasToCourt(canvasPoint.x, canvasPoint.y);
                const customEvent = new CustomEvent('courtClick', {
                    detail: {
                        x: courtPoint.x,
                        y: courtPoint.y,
                        canvasX: canvasPoint.x,
                        canvasY: canvasPoint.y,
                        originalEvent: e
                    }
                });
                canvas.dispatchEvent(customEvent);
            }
        },
        
        handleTouchMove: function(e) {
            if (e.touches.length === 1 && isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                const canvasPoint = this.windowToCanvas(touch.clientX, touch.clientY);
                
                // Pan the court
                const dx = canvasPoint.x - lastX;
                const dy = canvasPoint.y - lastY;
                offsetX += dx;
                offsetY += dy;
                this.drawCourt(courtType);
                
                // Dispatch an event
                const courtPoint = this.canvasToCourt(canvasPoint.x, canvasPoint.y);
                const customEvent = new CustomEvent('courtDrag', {
                    detail: {
                        x: courtPoint.x,
                        y: courtPoint.y,
                        canvasX: canvasPoint.x,
                        canvasY: canvasPoint.y,
                        dx: canvasPoint.x - lastX,
                        dy: canvasPoint.y - lastY,
                        originalEvent: e
                    }
                });
                canvas.dispatchEvent(customEvent);
                
                lastX = canvasPoint.x;
                lastY = canvasPoint.y;
            }
        },
        
        handleTouchEnd: function(e) {
            isDragging = false;
            
            // Dispatch an event
            const customEvent = new CustomEvent('courtRelease', {
                detail: {
                    originalEvent: e
                }
            });
            canvas.dispatchEvent(customEvent);
        }
    };
})();
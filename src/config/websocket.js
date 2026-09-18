// src/config/websocket.js
// Manages WebSocket "rooms" keyed by applicationId for real-time comment broadcasting

class WebSocketPool {
  constructor() {
    // Map<applicationId, Set<WebSocket>>
    this.rooms = new Map();
  }

  /**
   * Add a client socket to an application room
   * @param {string} applicationId
   * @param {WebSocket} socket
   */
  join(applicationId, socket) {
    if (!this.rooms.has(applicationId)) {
      this.rooms.set(applicationId, new Set());
    }
    this.rooms.get(applicationId).add(socket);
  }

  /**
   * Remove a client socket from an application room
   * @param {string} applicationId
   * @param {WebSocket} socket
   */
  leave(applicationId, socket) {
    const room = this.rooms.get(applicationId);
    if (room) {
      room.delete(socket);
      if (room.size === 0) {
        this.rooms.delete(applicationId);
      }
    }
  }

  /**
   * Broadcast a message to all clients in a room except the sender
   * @param {string} applicationId
   * @param {object} data - JSON-serializable payload
   * @param {WebSocket} excludeSocket - Sender socket to exclude
   */
  broadcast(applicationId, data, excludeSocket = null) {
    const room = this.rooms.get(applicationId);
    if (!room) return;

    const message = JSON.stringify(data);
    for (const client of room) {
      if (client !== excludeSocket && client.readyState === 1) {
        client.send(message);
      }
    }
  }

  /**
   * Get count of connected clients in a room
   * @param {string} applicationId
   * @returns {number}
   */
  getRoomSize(applicationId) {
    const room = this.rooms.get(applicationId);
    return room ? room.size : 0;
  }
}

// Singleton instance
const wsPool = new WebSocketPool();

module.exports = wsPool;

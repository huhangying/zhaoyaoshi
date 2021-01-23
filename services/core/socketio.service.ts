import io from 'socket.io-client';
import { Chat } from '../../models/io/chat.model';
import Constants from 'expo-constants';
import { UserFeedback } from '../../models/io/user-feedback.model';
import { Consult } from '../../models/consult/consult.model';

export class SocketioService {
  socket: any;

  constructor(room?: string) {
    if (room) {
      this.connect(room);
    }
  }

  connect(room: string) {
    if (!this.socket) {
      this.socket = io(Constants.manifest.extra.socketUrl);
      this.socket?.emit('joinRoom', room);

      this.socket?.on('disconnect', (reason: string) => {
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          this.socket.connect();
        }
        // else the socket will automatically try to reconnect
      });
    
      // this.socket?.on('connect_error', (reason: string) => {
      //     // console.log('connect_error ==> ' + reason);
      //     this.socket.connect();
      // });
      // this.socket?.on('error', (reason: string) => {
      //     // console.log('error ==> ' + reason);
      //     this.socket.connect();
      // });
    }
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  joinRoom(room: string) {
    this.socket?.emit('joinRoom', room);
  }

  leaveRoom(room: string) {
    this.socket?.emit('leaveRoom', room);
  }

  // Chat
  onChat(next: any) {
    this.socket.on('chat', next);
  }

  sendChat(room: string, chat: Chat) {
    this.socket.emit('chat', room, {
      ...chat,
      created: new Date()
    });
  }

  // Feedback
  onFeedback(next: any) {
    this.socket.on('feedback', next);
  }

  sendFeedback(room: string, feedback: UserFeedback) {
    this.socket.emit('feedback', room, feedback);
  }

  // Consult Chat
  onConsult(next: any) {
    this.socket.on('consult', next);
  }

  sendConsult(room: string, consult: Consult) {
    this.socket.emit('consult', room, consult);
  }

  // Notifications
  onNotification(next: any) {
    this.socket.on('notification', next);
  }

}

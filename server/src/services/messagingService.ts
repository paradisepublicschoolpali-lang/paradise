import { db, DbMessage } from '../database';

export class MessagingService {
  static getMessages(conversationId: string) {
    return db.messages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  static getConversationsForUser(userId: string) {
    const userMessages = db.messages.filter(
      m => m.senderId === userId || m.receiverId === userId
    );

    const conversationsMap = new Map<string, DbMessage>();
    for (const msg of userMessages) {
      const existing = conversationsMap.get(msg.conversationId);
      if (!existing || new Date(msg.timestamp) > new Date(existing.timestamp)) {
        conversationsMap.set(msg.conversationId, msg);
      }
    }

    return Array.from(conversationsMap.values());
  }

  static sendMessage(data: Omit<DbMessage, 'id' | 'timestamp' | 'isRead'>) {
    const newMsg: DbMessage = {
      ...data,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    db.messages.push(newMsg);
    return newMsg;
  }
}

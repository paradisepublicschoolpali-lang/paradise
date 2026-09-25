import { db, DbAuditLog } from '../database';

export class AuditService {
  static log(
    userId: string,
    userName: string,
    userRole: string,
    action: string,
    targetModule: string,
    details: string,
    targetId?: string
  ) {
    const entry: DbAuditLog = {
      id: `aud-${Date.now()}`,
      userId,
      userName,
      userRole,
      action,
      targetModule,
      targetId,
      details,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(entry);
    return entry;
  }

  static getAll(limit = 100) {
    return db.auditLogs.slice(0, limit);
  }
}

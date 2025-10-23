import { useState, useEffect } from 'react';
import { Clock, User, Edit, Trash2, Shield, FileText } from 'lucide-react';

const AuditLog = ({ 
  propertyId, 
  showPropertySpecific = false,
  limit = 10 
}) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock audit log data
    const mockAuditLogs = [
      {
        id: 1,
        user_id: 1,
        action: 'create',
        resource_type: 'property',
        resource_id: propertyId || 1,
        old_values: null,
        new_values: {
          address: '123 Main St',
          city: 'San Francisco',
          state: 'CA'
        },
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        created_at: '2024-02-01T10:30:00Z',
        user: {
          first_name: 'John',
          last_name: 'Doe',
          role: 'homeowner'
        }
      },
      {
        id: 2,
        user_id: 2,
        action: 'update',
        resource_type: 'report',
        resource_id: 1,
        old_values: {
          status: 'pending'
        },
        new_values: {
          status: 'approved'
        },
        ip_address: '192.168.1.2',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        created_at: '2024-02-01T14:15:00Z',
        user: {
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'contractor'
        }
      },
      {
        id: 3,
        user_id: 4,
        action: 'approve',
        resource_type: 'renovation',
        resource_id: 1,
        old_values: {
          is_verified: false
        },
        new_values: {
          is_verified: true
        },
        ip_address: '192.168.1.3',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
        created_at: '2024-01-30T09:45:00Z',
        user: {
          first_name: 'Alice',
          last_name: 'Admin',
          role: 'admin'
        }
      },
      {
        id: 4,
        user_id: 1,
        action: 'upload',
        resource_type: 'document',
        resource_id: 1,
        old_values: null,
        new_values: {
          file_name: 'inspection_report.pdf',
          file_size: '2.5MB',
          file_type: 'application/pdf'
        },
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        created_at: '2024-01-29T16:20:00Z',
        user: {
          first_name: 'John',
          last_name: 'Doe',
          role: 'homeowner'
        }
      },
      {
        id: 5,
        user_id: 2,
        action: 'delete',
        resource_type: 'attachment',
        resource_id: 2,
        old_values: {
          file_name: 'old_photo.jpg',
          file_size: '1.2MB'
        },
        new_values: null,
        ip_address: '192.168.1.2',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        created_at: '2024-01-28T11:10:00Z',
        user: {
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'contractor'
        }
      }
    ];

    setTimeout(() => {
      setAuditLogs(mockAuditLogs.slice(0, limit));
      setLoading(false);
    }, 1000);
  }, [propertyId, limit]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'update':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'approve':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'upload':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'text-green-600 bg-green-100';
      case 'update':
        return 'text-blue-600 bg-blue-100';
      case 'delete':
        return 'text-red-600 bg-red-100';
      case 'approve':
        return 'text-green-600 bg-green-100';
      case 'upload':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'homeowner':
        return 'text-green-600 bg-green-100';
      case 'contractor':
        return 'text-blue-600 bg-blue-100';
      case 'admin':
        return 'text-purple-600 bg-purple-100';
      case 'buyer':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Log</h3>
      <p className="text-sm text-gray-600 mb-4">
        Every change is timestamped and attributed for complete transparency.
      </p>
      
      <div className="space-y-4">
        {auditLogs.map((log) => (
          <div key={log.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              {getActionIcon(log.action)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                  {log.action.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600">
                  {log.resource_type}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(log.user.role)}`}>
                  {log.user.role}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {log.user.first_name} {log.user.last_name}
                </span>
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {formatTimestamp(log.created_at)}
                </span>
              </div>
              
              {log.new_values && (
                <div className="text-sm text-gray-600">
                  {log.action === 'create' && (
                    <span>Created {log.resource_type} with data: {JSON.stringify(log.new_values)}</span>
                  )}
                  {log.action === 'update' && (
                    <span>Updated {log.resource_type} fields</span>
                  )}
                  {log.action === 'upload' && (
                    <span>Uploaded file: {log.new_values.file_name}</span>
                  )}
                </div>
              )}
              
              {log.old_values && log.new_values && (
                <div className="mt-2 text-xs text-gray-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Before:</span>
                      <pre className="mt-1 text-xs bg-gray-50 p-2 rounded">
                        {JSON.stringify(log.old_values, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <span className="font-medium">After:</span>
                      <pre className="mt-1 text-xs bg-gray-50 p-2 rounded">
                        {JSON.stringify(log.new_values, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-400">
                IP: {log.ip_address} • {log.user_agent?.substring(0, 50)}...
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {auditLogs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No audit logs found
        </div>
      )}
    </div>
  );
};

export default AuditLog;

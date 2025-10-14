// AssistantNotifications.tsx
import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, X, Filter } from 'lucide-react';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  titre: string;
  message: string;
  date: string;
  lu: boolean;
}

interface AssistantNotificationsProps {
  theme: string;
}

// ============= API CLIENT =============
const API_BASE = 'http://localhost:8000/api/notifications';

const apiClient = async (endpoint: string, options?: RequestInit) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });
  if (!response.ok) throw new Error('Erreur API');
  return response.json();
};

const AssistantNotifications: React.FC<AssistantNotificationsProps> = ({ theme }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await apiClient('/notifications');
      setNotifications(data.notifications || data || []);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await apiClient(`/notifications/${id}/read`, {
        method: 'POST'
      });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, lu: true } : n
      ));
    } catch (error) {
      console.error('Erreur marquage notification:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await apiClient(`/notifications/${id}`, {
        method: 'DELETE'
      });
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erreur suppression notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiClient('/notifications/mark-all-read', {
        method: 'POST'
      });
      setNotifications(notifications.map(n => ({ ...n, lu: true })));
    } catch (error) {
      console.error('Erreur marquage toutes comme lues:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />;
      case 'warning':
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#eab308', flexShrink: 0 }} />;
      case 'error':
        return <AlertCircle style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0 }} />;
      default:
        return <Bell style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0 }} />;
    }
  };

  const getBackgroundColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return theme === 'light' ? '#f9fafb' : '#374151';
    }
    
    if (theme === 'light') {
      switch (type) {
        case 'success': return '#f0fdf4';
        case 'warning': return '#fefce8';
        case 'error': return '#fef2f2';
        default: return '#eff6ff';
      }
    } else {
      switch (type) {
        case 'success': return 'rgba(16, 185, 129, 0.1)';
        case 'warning': return 'rgba(234, 179, 8, 0.1)';
        case 'error': return 'rgba(239, 68, 68, 0.1)';
        default: return 'rgba(59, 130, 246, 0.1)';
      }
    }
  };

  const getBorderColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return theme === 'light' ? '#e5e7eb' : '#4b5563';
    }
    
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#eab308';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.lu)
    : notifications;

  const unreadCount = notifications.filter(n => !n.lu).length;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: theme === 'light' ? '#6b7280' : '#9ca3af' }}>
        Chargement des notifications...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: theme === 'light' ? 'white' : '#1f2937',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: theme === 'light' ? '#111827' : '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: 0
        }}>
          <Bell style={{ width: '24px', height: '24px' }} />
          Notifications
          {unreadCount > 0 && (
            <span style={{
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              minWidth: '24px',
              textAlign: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Filtres */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
            borderRadius: '8px',
            padding: '0.25rem'
          }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filter === 'all' ? (theme === 'light' ? 'white' : '#1f2937') : 'transparent',
                color: theme === 'light' ? '#111827' : '#f9fafb',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: filter === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Toutes
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: filter === 'unread' ? (theme === 'light' ? 'white' : '#1f2937') : 'transparent',
                color: theme === 'light' ? '#111827' : '#f9fafb',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: filter === 'unread' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Non lues
            </button>
          </div>

          {/* Marquer toutes comme lues */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${theme === 'light' ? '#d1d5db' : '#4b5563'}`,
                backgroundColor: 'transparent',
                color: theme === 'light' ? '#374151' : '#d1d5db',
                fontWeight: 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: theme === 'light' ? '#6b7280' : '#9ca3af'
          }}>
            <Bell style={{ 
              width: '48px', 
              height: '48px', 
              margin: '0 auto 1rem', 
              opacity: 0.5 
            }} />
            <p style={{ margin: 0, fontSize: '1.125rem' }}>
              {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              style={{
                backgroundColor: getBackgroundColor(notification.type, notification.lu),
                borderRadius: '12px',
                padding: '1.25rem',
                border: `1px solid ${getBorderColor(notification.type, notification.lu)}`,
                opacity: notification.lu ? 0.7 : 1,
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {!notification.lu && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6'
                }} />
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                  {getIcon(notification.type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '0.5rem',
                    gap: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: theme === 'light' ? '#111827' : '#f9fafb',
                      margin: 0,
                      flex: 1
                    }}>
                      {notification.titre}
                    </h3>

                    <button
                      onClick={() => deleteNotification(notification.id)}
                      title="Supprimer"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: theme === 'light' ? '#6b7280' : '#9ca3af',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = theme === 'light' ? '#6b7280' : '#9ca3af';
                      }}
                    >
                      <X style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: theme === 'light' ? '#6b7280' : '#9ca3af',
                    marginBottom: '0.75rem',
                    lineHeight: 1.5,
                    margin: 0,
                   
                  }}>
                    {notification.message}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      color: theme === 'light' ? '#6b7280' : '#9ca3af'
                    }}>
                      <Clock style={{ width: '14px', height: '14px' }} />
                      {new Date(notification.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    {!notification.lu && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#3b82f6',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        Marquer comme lu
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistiques en bas */}
      {notifications.length > 0 && (
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: `1px solid ${theme === 'light' ? '#e5e7eb' : '#374151'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: theme === 'light' ? '#6b7280' : '#9ca3af'
        }}>
          <div>
            {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''} affichée{filteredNotifications.length > 1 ? 's' : ''}
          </div>
          {unreadCount > 0 && (
            <div>
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssistantNotifications;
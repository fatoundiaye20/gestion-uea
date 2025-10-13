import { useEffect, useState } from 'react';

type Notification = {
  id: number;
  type: 'UEA' | 'Séance' | 'Message';
  source: string;
  contenu: string;
  date: string;
};

const NotificationsView = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch('/api/notifications-chef')
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  return (
    <div>
      <h3>Notifications reçues</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Type</th><th>Source</th><th>Contenu</th><th>Date</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map(n => (
            <tr key={n.id}>
              <td>{n.type}</td><td>{n.source}</td><td>{n.contenu}</td><td>{n.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationsView;

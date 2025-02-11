import { FC, useState, useEffect } from 'react';

interface LogEntry {
  id: number;
  action: 'login' | 'logout';
  timestamp: string;
  user_email: string;
  user_timezone?: string;
}

const Logs: FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      timeZone: userTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-timezone': userTimezone
          }
        });
        
        if (!response.ok) {
          const text = await response.text();
          console.error('Server response:', text);
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || 'Failed to fetch logs');
          } catch (parseError) {
            throw new Error(`Server error: ${text || response.statusText}`);
          }
        }
        
        const data = await response.json();
        console.log('Received logs:', data);
        setLogs(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load logs';
        setError(errorMessage);
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLogs();
  }, [userTimezone]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Logs</h2>
      <p className="text-sm text-gray-600 mb-4">Timezone: {userTimezone}</p>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catatan Waktu
                </th>
                <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zona waktu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      log.action === 'login' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{log.user_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.user_timezone || userTimezone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Logs;
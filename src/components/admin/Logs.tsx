import { FC, useState, useEffect } from 'react';

interface LogEntry {
  id: number;
  action: 'login' | 'logout';
  timestamp: string;
  device_info: string;
  ip_address: string;
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
  const parseDeviceInfo = (deviceInfo: string) => {
    const [device, rest] = deviceInfo.split(' - ');
    const ipMatch = rest?.match(/IP: ([^\s]+)/);
    return {
      device: device || 'Unknown Device',
      details: rest?.split(' - IP:')[0] || '',
      ip: ipMatch ? ipMatch[1] : 'Unknown IP'
    };
  };

  const getDeviceColor = (deviceInfo: string): string => {
    const deviceLower = deviceInfo.toLowerCase();
    if (deviceLower.includes('mobile') || deviceLower.includes('android') || deviceLower.includes('iphone')) {
      return 'bg-blue-100 text-blue-800';
    } else if (deviceLower.includes('mac')) {
      return 'bg-gray-100 text-gray-800';
    } else if (deviceLower.includes('windows')) {
      return 'bg-indigo-100 text-indigo-800';
    } else if (deviceLower.includes('linux')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-purple-100 text-purple-800';
    }
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

  const loginLogs = logs.filter(log => log.action === 'login');
  const logoutLogs = logs.filter(log => log.action === 'logout');

  const LogTable: FC<{ logs: LogEntry[], title: string }> = ({ logs, title }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perangkat
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded text-sm ${getDeviceColor(log.device_info)}`}>
                    {log.device_info}
                  </span>
                </td>
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
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 mt-5 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Logs</h2>
      <p className="text-sm text-gray-600 mb-4">Timezone: {userTimezone}</p>
      {logs.length === 0 ? (
        <p className="text-gray-500">No logs found</p>
      ) : (
        <>
          <LogTable logs={loginLogs} title="Login Activity" />
          <LogTable logs={logoutLogs} title="Logout Activity" />
        </>
      )}
    </div>
  );
};
          
export default Logs;
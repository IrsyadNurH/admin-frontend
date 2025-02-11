import { FC } from 'react';
import LogsChart from './LogsChart';

const DashboardContent: FC = () => {
  return (
    <>
      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <LogsChart />
      </div>
    </>
  );
};

export default DashboardContent;
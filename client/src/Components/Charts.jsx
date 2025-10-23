import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Charts = ({ type, data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Process data based on chart type
    switch (type) {
      case 'neighborhood':
        setChartData(data.propertyValues || []);
        break;
      case 'admin':
        setChartData(data.userGrowth || []);
        break;
      case 'contractor':
        setChartData(data.projectTimeline || []);
        break;
      default:
        setChartData([]);
    }
  }, [type, data]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const renderNeighborhoodChart = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Values Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.propertyValues || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Property Value']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Renovation Activity</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.renovations || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAdminChart = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.userGrowth || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Verification Status</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.propertyVerification || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="verified" stackId="a" fill="#10b981" />
            <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderContractorChart = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.projectTimeline || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" stackId="a" fill="#10b981" />
            <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.revenue || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderDefaultChart = () => (
    <div className="text-center py-8">
      <p className="text-gray-500">No chart data available</p>
    </div>
  );

  const renderChart = () => {
    switch (type) {
      case 'neighborhood':
        return renderNeighborhoodChart();
      case 'admin':
        return renderAdminChart();
      case 'contractor':
        return renderContractorChart();
      default:
        return renderDefaultChart();
    }
  };

  return (
    <div className="w-full">
      {renderChart()}
    </div>
  );
};

export default Charts;

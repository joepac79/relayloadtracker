'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface LoadData {
  [key: string]: string;
}

interface StackedLoads {
  dayOfWeek: string;
  [date: string]: string | number;
}

interface RowData {
  dayDate: string;
  count: number;
  date: string;
  dayOfWeek: string;
}

export default function Dashboard({ data }: { data: LoadData[] }) {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const [totalLoads, setTotalLoads] = useState(0);
  const [totalCanceled, setTotalCanceled] = useState(0);

  useEffect(() => {
    if (data.length > 0) {
      const dateColumn = Object.keys(data[0]).find(
        (key) => key.trim().toLowerCase() === 'stop 1 planned arrival date'.toLowerCase()
      );
      const tripStageColumn = Object.keys(data[0]).find(
        (key) => key.trim().toLowerCase() === 'trip stage'
      );
      let canceledCount = 0;
      if (dateColumn) {
        const byDayDate: { [key: string]: RowData } = {};
        let total = 0;
        let minDate: Date | null = null;
        let maxDate: Date | null = null;
        data.forEach((row) => {
          if (tripStageColumn && row[tripStageColumn]?.trim().toLowerCase() === 'canceled') {
            canceledCount++;
            return;
          }
          const dateStr = row[dateColumn];
          if (!dateStr) return;
          const dateObj = new Date(dateStr);
          if (isNaN(dateObj.getTime())) return;
          if (!minDate || dateObj < minDate) minDate = dateObj;
          if (!maxDate || dateObj > maxDate) maxDate = dateObj;
          const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          const dateOnly = dateObj.toISOString().split('T')[0];
          const key = `${dayOfWeek} ${dateOnly}`;
          if (!byDayDate[key]) {
            byDayDate[key] = {
              dayDate: key,
              count: 0,
              date: dateOnly,
              dayOfWeek,
            };
          }
          byDayDate[key].count += 1;
          total += 1;
        });
        if (minDate && maxDate) {
          const currentDate = new Date(minDate);
          const endDate = new Date(maxDate);
          while (currentDate <= endDate) {
            const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
            const dateOnly = currentDate.toISOString().split('T')[0];
            const key = `${dayOfWeek} ${dateOnly}`;
            if (!byDayDate[key]) {
              byDayDate[key] = {
                dayDate: key,
                count: 0,
                date: dateOnly,
                dayOfWeek,
              };
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
        const rowDataArr = Object.values(byDayDate).sort((a, b) => a.date.localeCompare(b.date));
        setRowData(rowDataArr);
        setTotalLoads(total);
        setTotalCanceled(canceledCount);
      }
    }
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-1">Total Loads</h3>
          <p className="text-2xl font-bold text-blue-600">{totalLoads}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-1">Canceled Loads</h3>
          <p className="text-2xl font-bold text-red-600">{totalCanceled}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
        <h3 className="text-sm font-semibold mb-2">Loads by Day</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Day</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Load Count</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {rowData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{row.date}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{row.dayOfWeek}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-300">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
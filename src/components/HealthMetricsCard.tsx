import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import './HealthMetricsCard.css';
import { SeniorDetailResponseBody, SeniorStat } from '../types/api';

interface HealthMetricsCardProps {
  seniorDetail?: SeniorDetailResponseBody | null;
}

const INITIAL_POINTS = 10; // 초기 데이터 개수
const UPDATE_INTERVAL = 60000; // 1분 단위

const HealthMetricsCard: React.FC<HealthMetricsCardProps> = ({
  seniorDetail,
}) => {
  const [data, setData] = useState<SeniorStat[]>([]);

  // 초기 데이터 생성
  useEffect(() => {
    if (seniorDetail && seniorDetail.stats.length > 0) {
      // setData(seniorDetail.stats.slice(-10).reverse());
      setData(seniorDetail.stats);
      // console.log('초기 로딩된 시니어 상태 데이터:', data);
      return;
    }
    const initialData: SeniorStat[] = [];
    const now = new Date();
    for (let i = 0; i < INITIAL_POINTS; i++) {
      const time = new Date(now.getTime() - i * UPDATE_INTERVAL);
      initialData.push({
        uuid: i.toString(),
        timestamp: time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        heartRate: 60 + Math.floor(Math.random() * 40),
        temperature: parseFloat((36 + Math.random() * 1.5).toFixed(1)),
      });
    }
    // console.log('임시 시니어 상태 데이터 생성:', initialData);
    setData(initialData);
    // console.log('임시 시니어 상태 데이터:', data);
  }, [seniorDetail]);

  return (
    <div className="health-metrics-card">
      <div className="metrics-container">
        {/* ❤️ 심박수 */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">❤️</span>
            <span className="metric-title">
              심박수 {data.length ? data[0]?.heartRate : '--'} bpm
            </span>
          </div>
          <div className="metric-graph">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" hide axisLine={false} tick={false} />
                <YAxis
                  domain={[0, 180]}
                  label={{ value: 'BPM', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#ff4444"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🌡️ 체온 */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">🌡️</span>
            <span className="metric-title">
              체온 {data.length ? data[0]?.temperature.toFixed(1) : '--'} °C
            </span>
          </div>
          <div className="metric-graph">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" hide axisLine={false} tick={false} />
                <YAxis
                  domain={[35, 39]}
                  label={{ value: '°C', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff8844"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetricsCard;

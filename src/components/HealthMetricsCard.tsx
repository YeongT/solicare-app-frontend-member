import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./HealthMetricsCard.css";

const INITIAL_POINTS = 10;   // 초기 데이터 개수
const MAX_POINTS = 10;       // 그래프 최대 표시 포인트
const UPDATE_INTERVAL = 60000; // 1분 단위

interface HealthData {
  time: string;
  bpm: number;
  temp: number;
}

const HealthMetricsCard: React.FC = () => {
  const [data, setData] = useState<HealthData[]>([]);

  // 초기 데이터 생성
  useEffect(() => {
    const initialData: HealthData[] = [];
    const now = new Date();

    for (let i = 0; i < INITIAL_POINTS; i++) {
      const time = new Date(now.getTime() - i * UPDATE_INTERVAL);
      initialData.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        bpm: 60 + Math.floor(Math.random() * 40),
        temp: parseFloat((36 + Math.random() * 1.5).toFixed(1)),
      });
    }

    setData(initialData);
  }, []);


  // 1분마다 새 데이터 추가
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newPoint: HealthData = {
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        bpm: 60 + Math.floor(Math.random() * 40),
        temp: parseFloat((36 + Math.random() * 1.5).toFixed(1)),
      };

      setData(prev => [newPoint, ...prev].slice(0, MAX_POINTS));
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="health-metrics-card">
      <div className="metrics-container">

        {/* ❤️ 심박수 */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-icon">❤️</span>
            <span className="metric-title">
              심박수 {data.length ? data[0]?.bpm : "--"} bpm
            </span>
          </div>
          <div className="metric-graph">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide axisLine={false} tick={false} />
                <YAxis domain={[0, 180]} label={{ value: "BPM", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bpm"
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
              체온 {data.length ? data[0]?.temp.toFixed(1) : "--"} °C
            </span>
          </div>
          <div className="metric-graph">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide axisLine={false} tick={false} />
                <YAxis domain={[35, 39]} label={{ value: "°C", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
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

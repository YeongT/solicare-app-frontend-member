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

const MAX_POINTS = 60; // 10분 데이터 10초 단위
const INTERVAL = 10000; // 10초 단위

const HealthMetricsCard: React.FC = () => {
  const [heartData, setHeartData] = useState<{ time: string; bpm: number }[]>([]);
  const [tempData, setTempData] = useState<{ time: string; temp: number }[]>([]);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      const newHeart = { time: timeLabel, bpm: 60 + Math.floor(Math.random() * 40) };
      const newTemp = { time: timeLabel, temp: parseFloat((36 + Math.random() * 1.5).toFixed(1)) };

      // 새 데이터가 왼쪽, 최대 MAX_POINTS 유지
      setHeartData(prev => [newHeart, ...prev.slice(0, MAX_POINTS - 1)]);
      setTempData(prev => [newTemp, ...prev.slice(0, MAX_POINTS - 1)]);
      setCurrentTime(timeLabel);
    }, INTERVAL);  

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
              심박수 {heartData.length ? heartData[0]?.bpm : "--"} bpm
            </span>
          </div>
          <div className="metric-graph">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={heartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide={true} axisLine={false} tick={false} />
                <YAxis domain={[0, 180]} label={{ value: "BPM", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bpm"
                  stroke="#ff4444"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={0}
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
              체온 {tempData.length ? tempData[0]?.temp.toFixed(1) : "--"} °C
            </span>
          </div>
          <div className="metric-graph">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide /> {/* X축 숨김 */}
                <YAxis domain={[35, 39]} label={{ value: "°C", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="#ff8844"
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={true}
                  animationDuration={0}
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

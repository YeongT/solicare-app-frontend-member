import React from 'react';
import './InfoFrame.css';

export type InfoFrameProps = {
  name: string;
  age: number;
  gender: string;
  address: string;
  note?: string;
};

const InfoFrame = React.forwardRef<HTMLDivElement, InfoFrameProps>(
  ({ name, age, gender, address, note }, ref) => {
    return (
      <div ref={ref} className="info-frame">
        <div className="info-row">
          <span className="label">이름</span>
          <span className="value">{name}</span>
        </div>
        <div className="info-row">
          <span className="label">나이</span>
          <span className="value">{age}세</span>
        </div>
        <div className="info-row">
          <span className="label">성별</span>
          <span className="value">{gender}</span>
        </div>
        <div className="info-row">
          <span className="label">주소</span>
          <span className="value">{address}</span>
        </div>
        <div className="info-row">
          <span className="label">비고</span>
          <span className="value">{note}</span>
        </div>
      </div>
    );
  }
);

export default InfoFrame;

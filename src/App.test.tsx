import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App 랜딩 페이지', () => {
  test('Solicare 브랜드가 2번 이상 보인다', () => {
    render(<App />);
    expect(screen.getAllByText(/Solicare/i).length).toBeGreaterThanOrEqual(2);
  });

  test('메인 타이틀이 보인다', () => {
    render(<App />);
    expect(screen.getByText(/가정 내 어르신을 위한 안전 모니터링/)).toBeInTheDocument();
  });

  test('로그인, 회원가입 버튼이 보인다', () => {
    render(<App />);
    expect(screen.getAllByText(/로그인/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/회원가입/)[0]).toBeInTheDocument();
  });

  test('주요 기능 타이틀이 보인다', () => {
    render(<App />);
    expect(screen.getByText(/실시간 건강지표/)).toBeInTheDocument();
    expect(screen.getByText(/즉시 알림/)).toBeInTheDocument();
    expect(screen.getByText(/안전한 접근/)).toBeInTheDocument();
  });
});

import React from 'react';
import './UserInfoCard.css';
import InfoFrame from './userInfo/InfoFrame';

const UserInfoCard: React.FC = () => {
  const [imageError, setImageError] = React.useState(false);
  const infoRef = React.useRef<HTMLDivElement | null>(null);
  const [photoHeight, setPhotoHeight] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const updateHeight = () => {
      if (infoRef.current) {
        const h = infoRef.current.getBoundingClientRect().height;
        // 사진은 정사각형으로 유지하되, 최대 230px, 최소 90px로 제한
        const clamped = Math.max(90, Math.min(230, Math.round(h)));
        setPhotoHeight(clamped);
      }
    };

    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (infoRef.current) ro.observe(infoRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      if (infoRef.current) ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <section className="user-info-container">
      <header className="user-info-title">
        <h3>모니터링 대상 : 가가가 님</h3>
        <span className="dropdown-arrow">▼</span>
      </header>

      <div className="user-info-content">
        <div
          className="photo-frame"
          aria-label="사용자 사진"
          style={{ width: photoHeight ?? 100, height: photoHeight ?? 100 }}
        >
          {imageError ? (
            <div className="photo-fallback">
              <span className="photo-emoji" role="img" aria-label="grandma">👵</span>
            </div>
          ) : (
            <img
              className="photo-img"
              src="/images/user-photo.png"
              alt="프로필 사진"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        <InfoFrame
          ref={infoRef}
          name="가가가 님"
          age={65}
          gender="여성"
          address="서울특별시 동작구 신대방길 345, 101동 102호"
        />
      </div>
    </section>
  );
};

export default UserInfoCard;

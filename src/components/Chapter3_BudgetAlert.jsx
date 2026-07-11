import React from 'react';

const Chapter3_BudgetAlert = () => {
  const { useSprite, interpolate, Easing } = window.Animations;
  const time = useSprite();

  // Animation timeline (6 seconds total: 0-6)
  // 0.0-0.3: Card zoom in
  const cardScale = interpolate(time, [0, 0.3], [0.7, 1.0], Easing.expoOut);
  const cardOpacity = interpolate(time, [0, 0.2], [0, 1], Easing.expoOut);

  // 0.4-0.6: Spent amount increases
  const spentAmount = interpolate(time, [0.4, 0.6], [4200, 5320], Easing.expoOut);
  const progressPercent = Math.min((spentAmount / 5000) * 100, 106);
  const progressColor = progressPercent > 100 ? '#ef4444' : '#10b981';

  // 0.7-1.0: Alert badge appears with pulse
  const alertOpacity = time >= 0.7 ? interpolate(time, [0.7, 0.9], [0, 1], Easing.expoOut) : 0;
  const alertScale = time >= 0.7 ? interpolate(time, [0.7, 0.85, 1.0], [0.8, 1.1, 1.0], Easing.expoOut) : 0.8;

  // Continuous pulse for alert badge after it appears
  const pulseIntensity = time >= 1.0 ? Math.sin((time - 1.0) * Math.PI * 2) * 0.5 + 0.5 : 0;
  const alertGlowOpacity = alertOpacity * (0.6 + pulseIntensity * 0.4);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '480px',
          height: '280px',
          background: 'linear-gradient(135deg, #1a1f26 0%, #151a20 100%)',
          border: '1px solid #252b35',
          borderRadius: '12px',
          padding: '32px',
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Alert Badge */}
        {time >= 0.7 && (
          <div
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '6px',
              opacity: alertOpacity,
              transform: `scale(${alertScale})`,
              boxShadow: `0 0 24px rgba(220, 38, 38, ${alertGlowOpacity})`,
              transition: 'box-shadow 0.1s ease-out',
            }}
          >
            Budget Health Alert
          </div>
        )}

        {/* Category Icon */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '28px', color: '#ffffff', fontWeight: 700 }}>$</span>
        </div>

        {/* Category Name */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#f8fafc',
            marginBottom: '8px',
          }}
        >
          Marketing Budget
        </div>

        {/* Budget Amount */}
        <div
          style={{
            fontSize: '16px',
            color: '#cbd5e1',
            marginBottom: '24px',
          }}
        >
          $5,000.00 / month
        </div>

        {/* Spent Amount */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '12px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              fontWeight: 500,
            }}
          >
            Spent
          </span>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: progressPercent > 100 ? '#ef4444' : '#f8fafc',
              transition: 'color 0.3s ease',
            }}
          >
            ${spentAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </span>
        </div>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Progress Bar Fill */}
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: progressColor,
              borderRadius: '4px',
              transition: 'background-color 0.3s ease, width 0.1s ease-out',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          />
        </div>

        {/* Progress Percentage */}
        <div
          style={{
            marginTop: '8px',
            fontSize: '13px',
            color: progressPercent > 100 ? '#ef4444' : '#94a3b8',
            fontWeight: 500,
            textAlign: 'right',
            transition: 'color 0.3s ease',
          }}
        >
          {progressPercent.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export default Chapter3_BudgetAlert;

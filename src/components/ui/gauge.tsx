import React from 'react';

interface GaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showValue?: boolean;
}

const Gauge: React.FC<GaugeProps> = ({
  value,
  max = 100,
  size = 160,
  strokeWidth = 16,
  label,
  showValue = true,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;
  
  // Arc parameters - semicircle from left to right (bottom arc)
  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Calculate the arc path for a semicircle (180 degrees)
  const startAngle = 180; // Start from left
  const endAngle = 0; // End at right
  const arcLength = 180; // Total arc in degrees
  
  // Calculate where the indicator should point based on value
  const valueAngle = 180 - (percentage / 100) * 180;
  const valueRad = (valueAngle * Math.PI) / 180;
  
  // Create the background arc path (full semicircle)
  const getArcPath = (startDeg: number, endDeg: number) => {
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY - radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY - radius * Math.sin(endRad);
    
    const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };
  
  // Colored segments (red, orange, green)
  const redArc = getArcPath(180, 135); // 0-25%
  const orangeArc = getArcPath(135, 45); // 25-75%
  const greenArc = getArcPath(45, 0); // 75-100%
  
  // Needle position
  const needleLength = radius - 5;
  const needleX = centerX + needleLength * Math.cos(valueRad);
  const needleY = centerY - needleLength * Math.sin(valueRad);
  
  // Color based on value
  const getColor = (val: number) => {
    if (val >= 75) return 'hsl(142, 76%, 36%)'; // Green
    if (val >= 50) return 'hsl(38, 92%, 50%)'; // Orange
    return 'hsl(0, 84%, 60%)'; // Red
  };
  
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.65} viewBox={`0 0 ${size} ${size * 0.65}`}>
        {/* Background arcs - colored segments */}
        <path
          d={redArc}
          fill="none"
          stroke="hsl(0, 84%, 75%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={orangeArc}
          fill="none"
          stroke="hsl(38, 92%, 75%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d={greenArc}
          fill="none"
          stroke="hsl(142, 76%, 60%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Center decorative circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={strokeWidth * 1.2}
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        
        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="hsl(var(--foreground))"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Needle center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r={6}
          fill="hsl(var(--foreground))"
        />
        
        {/* Scale markers */}
        <text x={strokeWidth / 2} y={centerY + 20} fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="start">0</text>
        <text x={size - strokeWidth / 2} y={centerY + 20} fontSize="10" fill="hsl(var(--muted-foreground))" textAnchor="end">{max}</text>
      </svg>
      
      {showValue && (
        <div className="text-center -mt-2">
          <span className="text-3xl font-bold" style={{ color: getColor(percentage) }}>
            {Math.round(normalizedValue)}
          </span>
          <span className="text-lg text-muted-foreground">/{max}</span>
        </div>
      )}
      
      {label && (
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      )}
    </div>
  );
};

export default Gauge;
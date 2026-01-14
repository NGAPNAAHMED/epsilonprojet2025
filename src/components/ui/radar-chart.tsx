import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number; max: number }[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = (size - 40) / 2;
  const angleStep = (2 * Math.PI) / data.length;
  
  // Calculate points for the data polygon
  const dataPoints = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const normalizedValue = item.value / item.max;
    const r = radius * normalizedValue;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      label: item.label,
      value: item.value,
      angle,
    };
  });
  
  // Create polygon path for data
  const dataPath = dataPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';
  
  // Grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1];
  
  // Axis lines
  const axisLines = data.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x1: center,
      y1: center,
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });
  
  // Label positions
  const labelPositions = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = radius + 25;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      label: item.label,
      value: item.value,
    };
  });
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid circles */}
      {gridLevels.map((level, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius * level}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}
      
      {/* Axis lines */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
      ))}
      
      {/* Data polygon */}
      <path
        d={dataPath}
        fill="hsl(var(--primary) / 0.3)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />
      
      {/* Data points */}
      {dataPoints.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={4}
          fill="hsl(var(--primary))"
          stroke="hsl(var(--background))"
          strokeWidth="2"
        />
      ))}
      
      {/* Labels */}
      {labelPositions.map((pos, i) => (
        <text
          key={i}
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="hsl(var(--muted-foreground))"
        >
          {pos.label}
        </text>
      ))}
    </svg>
  );
};

export default RadarChart;
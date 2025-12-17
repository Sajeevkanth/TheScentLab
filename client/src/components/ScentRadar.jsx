import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import './ScentRadar.css';

/**
 * ScentRadar - Visual Scent Profile Component
 * Displays a radar/spider chart of fragrance notes
 */
const ScentRadar = ({ scentProfile, size = 'medium', showLegend = false, interactive = false }) => {
    // Format data for Recharts
    const data = [
        { accord: 'Citrus', value: scentProfile?.citrus || 0, fullMark: 100 },
        { accord: 'Fresh', value: scentProfile?.fresh || 0, fullMark: 100 },
        { accord: 'Floral', value: scentProfile?.floral || 0, fullMark: 100 },
        { accord: 'Sweet', value: scentProfile?.sweet || 0, fullMark: 100 },
        { accord: 'Oriental', value: scentProfile?.oriental || 0, fullMark: 100 },
        { accord: 'Spicy', value: scentProfile?.spicy || 0, fullMark: 100 },
        { accord: 'Woody', value: scentProfile?.woody || 0, fullMark: 100 },
        { accord: 'Musky', value: scentProfile?.musky || 0, fullMark: 100 },
    ];

    const sizeMap = {
        small: { width: 180, height: 180, outerRadius: 45 },
        medium: { width: 280, height: 280, outerRadius: 75 },
        large: { width: 400, height: 400, outerRadius: 110 }
    };

    const { width, height, outerRadius } = sizeMap[size] || sizeMap.medium;

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="scent-tooltip">
                    <span className="scent-tooltip-label">{payload[0].payload.accord}</span>
                    <span className="scent-tooltip-value">{payload[0].value}%</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`scent-radar scent-radar--${size}`}>
            <ResponsiveContainer width={width} height={height}>
                <RadarChart data={data} outerRadius={outerRadius}>
                    <PolarGrid
                        stroke="#e0e0e0"
                        strokeWidth={1}
                    />
                    <PolarAngleAxis
                        dataKey="accord"
                        tick={{
                            fill: '#333333',
                            fontSize: size === 'small' ? 10 : 12,
                            fontWeight: 600
                        }}
                        stroke="#cccccc"
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Scent Profile"
                        dataKey="value"
                        stroke="#000080"
                        strokeWidth={2}
                        fill="rgba(0, 0, 128, 0.2)"
                        fillOpacity={0.6}
                        animationDuration={1000}
                        animationEasing="ease-out"
                    />
                    {interactive && <Tooltip content={<CustomTooltip />} />}
                </RadarChart>
            </ResponsiveContainer>

            {showLegend && (
                <div className="scent-radar-legend">
                    {data.map((item) => (
                        <div key={item.accord} className="scent-legend-item">
                            <span className="scent-legend-dot" style={{
                                backgroundColor: item.value > 50 ? '#000080' : 'rgba(0, 0, 128, 0.3)'
                            }}></span>
                            <span className="scent-legend-label">{item.accord}</span>
                            <span className="scent-legend-value">{item.value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScentRadar;

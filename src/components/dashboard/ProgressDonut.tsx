import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ProgressDonutProps {
  data: Array<{ name: string; value: number; color: string }>;
  title: string;
  centerValue?: string;
}

export default function ProgressDonut({ data, title, centerValue }: ProgressDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = Math.round(total / data.length);

  return (
    <div className="chart-container">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="relative h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-primary">
            {centerValue || `${average}%`}
          </div>
          <div className="text-xs text-muted-foreground">Average</div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground">{item.name}</span>
            </div>
            <span className="font-medium text-primary">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
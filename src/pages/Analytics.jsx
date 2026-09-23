import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart2, PieChart, Clock, Users, IndianRupee, Zap, Lightbulb } from 'lucide-react';

const MOCK_MONTHLY = [
  { month: 'Apr', spend: 1200, shifts: 2, filled: 2 },
  { month: 'May', spend: 1800, shifts: 3, filled: 3 },
  { month: 'Jun', spend: 900,  shifts: 2, filled: 1 },
  { month: 'Jul', spend: 2400, shifts: 4, filled: 4 },
  { month: 'Aug', spend: 2100, shifts: 3, filled: 3 },
  { month: 'Sep', spend: 3200, shifts: 5, filled: 4 },
];

const MOCK_BY_CATEGORY = [
  { cat: 'Warehouse', shifts: 6, spend: 3600, color: '#007AFF' },
  { cat: 'Events',    shifts: 4, spend: 3200, color: '#AF52DE' },
  { cat: 'Retail',    shifts: 3, spend: 1500, color: '#FF9500' },
  { cat: 'Delivery',  shifts: 2, spend: 1400, color: '#34C759' },
];

const INSIGHTS = [
  { icon: '⚡', text: 'Shifts posted on Friday evenings fill 2× faster than Monday mornings.' },
  { icon: '📍', text: 'Your Gandhinagar shifts fill in avg 3.2 hrs vs 6 hrs for Nikol.' },
  { icon: '🌙', text: 'Evening shifts (5 PM–11 PM) attract 40% more applicants.' },
  { icon: '💰', text: 'Increasing pay by ₹50 reduces time-to-fill by 35% on average.' },
  { icon: '⭐', text: 'Workers with 4.8+ ratings have a 0% no-show rate for you.' },
];

const BarChart = ({ data, valueKey, label, color = 'var(--color-primary)' }) => {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
            {typeof d[valueKey] === 'number' && d[valueKey] > 0 ? (label === '₹' ? `₹${(d[valueKey]/1000).toFixed(1)}k` : d[valueKey]) : ''}
          </span>
          <div style={{ width: '100%', height: `${Math.max((d[valueKey] / max) * 100, 4)}%`, backgroundColor: color, borderRadius: '6px 6px 0 0', transition: 'height 0.6s ease' }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{d.month || d.cat?.slice(0, 4)}</span>
        </div>
      ))}
    </div>
  );
};

const MetricCard = ({ icon: Icon, iconBg, iconColor, label, value, change, up }) => (
  <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{ padding: '8px', backgroundColor: iconBg, borderRadius: '10px' }}>
        <Icon size={18} color={iconColor} />
      </div>
      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{label}</span>
    </div>
    <p style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 4px', letterSpacing: '-0.5px' }}>{value}</p>
    {change && (
      <span style={{ fontSize: '0.8rem', fontWeight: '600', color: up ? 'var(--color-success)' : 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '3px' }}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {change}
      </span>
    )}
  </div>
);

const Analytics = () => {
  const [period, setPeriod] = useState('30');

  return (
    <div className="fade-up visible" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>Analytics</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Understand your hiring patterns and optimise costs.</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['7', '7 days'], ['30', '30 days'], ['90', '90 days']].map(([v, l]) => (
            <button key={v} onClick={() => setPeriod(v)} style={{ padding: '7px 14px', borderRadius: '100px', border: `1px solid ${period === v ? 'var(--color-primary)' : 'var(--color-border)'}`, backgroundColor: period === v ? 'var(--color-primary)' : 'transparent', color: period === v ? '#fff' : 'var(--color-text-main)', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <MetricCard icon={BarChart2}   iconBg="#e5f1ff"               iconColor="var(--color-primary)" label="Shifts Posted"    value="18"    change="+3 vs last period" up={true}  />
        <MetricCard icon={Zap}         iconBg="rgba(52,199,89,0.1)"   iconColor="var(--color-success)" label="Fill Rate"       value="89%"   change="+5% vs last period" up={true}  />
        <MetricCard icon={Clock}       iconBg="rgba(255,184,0,0.1)"   iconColor="#FFB800"              label="Avg Time to Fill" value="4.2h"  change="-1.1h vs last period" up={true} />
        <MetricCard icon={IndianRupee} iconBg="rgba(175,82,222,0.1)"  iconColor="#AF52DE"              label="Total Spend"     value="₹11.6k" change="+₹2.1k vs last period" up={false} />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IndianRupee size={16} color="var(--color-primary)" /> Monthly Spend
          </h3>
          <BarChart data={MOCK_MONTHLY} valueKey="spend" label="₹" color="var(--color-primary)" />
        </div>
        <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={16} color="var(--color-success)" /> Shifts Posted vs Filled
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px' }}>
            {MOCK_MONTHLY.map((d, i) => {
              const max = 5;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: '2px', height: `${(d.shifts / max) * 100}%` }}>
                    <div style={{ flex: 1, backgroundColor: 'var(--color-primary)', borderRadius: '4px 4px 0 0', opacity: 0.35 }} />
                    <div style={{ flex: d.filled / d.shifts, backgroundColor: 'var(--color-success)', borderRadius: '4px 4px 0 0' }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{d.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-muted)' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--color-primary)', opacity: 0.35, display: 'inline-block' }} />Posted</span>
            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-muted)' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--color-success)', display: 'inline-block' }} />Filled</span>
          </div>
        </div>
      </div>

      {/* By Category */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '1rem' }}>Spend by Category</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MOCK_BY_CATEGORY.map(c => {
            const maxSpend = Math.max(...MOCK_BY_CATEGORY.map(x => x.spend));
            return (
              <div key={c.cat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '80px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-muted)', flexShrink: 0 }}>{c.cat}</span>
                <div style={{ flex: 1, height: '28px', backgroundColor: 'var(--color-bg)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ width: `${(c.spend / maxSpend) * 100}%`, height: '100%', backgroundColor: c.color, borderRadius: '100px', transition: 'width 0.6s ease' }} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', width: '60px', textAlign: 'right', flexShrink: 0 }}>₹{c.spend.toLocaleString('en-IN')}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} color="#FFB800" /> Smart Insights
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {INSIGHTS.map((ins, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{ins.icon}</span>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Shift Cost Table */}
      <div style={{ backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Shift Performance Summary</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-bg)' }}>
                {['Shift', 'Category', 'Location', 'Time to Fill', 'Cost', 'Rating', 'No-Shows'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Warehouse Packer', 'Warehouse', 'Nikol', '3.5 hrs', '₹550', '5.0 ★', '0'],
                ['Event Helper',     'Events',    'Gandhinagar', '2.1 hrs', '₹850', '4.8 ★', '0'],
                ['Retail Staff',     'Retail',    'SG Highway', '6.2 hrs', '₹550', '4.5 ★', '1'],
                ['Delivery Runner',  'Delivery',  'Satellite', '4.8 hrs', '₹750', '4.9 ★', '0'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '12px 16px', color: j === 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)', fontWeight: j === 0 ? '600' : '400' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

import type { CSSProperties } from 'react';
interface SliderProps {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  start: string;
  end: string;
  onChange: (value: number) => void;
}
export function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  start,
  end,
  onChange,
}: SliderProps) {
  return (
    <label className="slider-control">
      <span className="control-heading">
        <span>{label}</span>
        <output>{display}</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={
          {
            '--progress': `${((value - min) / (max - min)) * 100}%`,
          } as CSSProperties
        }
      />
      <span className="range-labels">
        <span>{start}</span>
        <span>{end}</span>
      </span>
    </label>
  );
}

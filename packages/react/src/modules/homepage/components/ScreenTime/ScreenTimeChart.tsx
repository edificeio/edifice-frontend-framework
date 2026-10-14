import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
  type LinearScaleOptions,
} from 'chart.js';
import { useEffect, useRef } from 'react';
import { ScreenTimeChartBar } from './types';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

export interface ScreenTimeChartProps {
  bars: ScreenTimeChartBar[];
  axisMax: number;
  axisStep: number;
  labelStep: number;
  axisTitle: string;
  ariaLabel: string;
}

export default function ScreenTimeChart({
  bars,
  axisMax,
  axisStep,
  labelStep,
  axisTitle,
  ariaLabel,
}: ScreenTimeChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<'bar'>>();

  // Kept in sync with the chart's current dataset (updated in the data-only
  // effect below) so the tooltip callback (registered once, on mount) always
  // reads bars matching what's actually rendered.
  const barsRef = useRef(bars);

  // Mount-only effect: create the Chart.js instance once. Recreating it on
  // every render would destroy it and replay the grow animation from 0.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const style = getComputedStyle(canvas);
    const barColor = style.getPropertyValue('--primitive-blue-900').trim();
    const gridColor = style.getPropertyValue('--primitive-grey-300').trim();
    const textColor = style.getPropertyValue('--primitive-grey-900').trim();
    const fontFamily = style.getPropertyValue('--font-family-body').trim();

    const initialBars = barsRef.current;

    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: initialBars.map((bar) => bar.label),
        datasets: [
          {
            data: initialBars.map((bar) => bar.value),
            backgroundColor: barColor,
            borderRadius: 0,
            categoryPercentage: 48 / 72,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => barsRef.current[ctx.dataIndex]?.tooltip ?? '',
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: axisMax,
            ticks: {
              stepSize: axisStep,
              color: textColor,
              font: { family: fontFamily, size: 16 },
              callback: (value) =>
                Number(value) % labelStep === 0 ? String(value) : '',
            },
            title: {
              display: true,
              text: axisTitle,
              color: textColor,
              font: { family: fontFamily, size: 16 },
            },
            grid: { color: gridColor },
            border: { color: gridColor },
          },
          x: {
            grid: { offset: true, color: gridColor },
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              color: textColor,
              font: { family: fontFamily, size: 16 },
            },
            border: { color: gridColor },
          },
        },
      },
    });

    chartRef.current = chart;

    return () => {
      chart.destroy();
      chartRef.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data-only effect: update the existing chart instance in place whenever
  // the bars/axis props change, instead of recreating the chart.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    barsRef.current = bars;
    chart.data.labels = bars.map((bar) => bar.label);
    chart.data.datasets[0].data = bars.map((bar) => bar.value);

    const yScale = chart.options.scales?.y as
      | Partial<LinearScaleOptions>
      | undefined;
    if (yScale) {
      yScale.max = axisMax;
      if (yScale.ticks) {
        yScale.ticks.stepSize = axisStep;
        yScale.ticks.callback = (value) =>
          Number(value) % labelStep === 0 ? String(value) : '';
      }
      if (yScale.title && typeof yScale.title !== 'boolean') {
        yScale.title.text = axisTitle;
      }
    }

    chart.update();
  }, [bars, axisMax, axisStep, labelStep, axisTitle]);

  return (
    <>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={ariaLabel}
        className="screen-time-modal__canvas"
      />
      <ul className="visually-hidden">
        {bars.map((bar, index) => (
          <li key={index}>
            {bar.srLabel}: {bar.tooltip}
          </li>
        ))}
      </ul>
    </>
  );
}

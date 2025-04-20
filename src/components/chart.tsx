import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

// Destroy the chart before creating a new one
const destroyChart = (ref: React.RefObject<HTMLCanvasElement | null>) => {
  const el = ref.current;
  if (el) {
    const chart = Chart.getChart(el);
    if (chart) {
      chart.destroy();
    }
  }
};

interface ClinicalEntry {
  days_to_consent: number;
  disease_type: string;
  primary_site: string;
}

interface ClinicalChartsProps {
  data: ClinicalEntry[];
}

export const ClinicalCharts: React.FC<ClinicalChartsProps> = ({ data }) => {
  const consentRef = useRef<HTMLCanvasElement>(null);
  const diseaseTypeRef = useRef<HTMLCanvasElement>(null);
  const primarySiteRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const clinicalEntries = data;

    // ===================== Consent Timing Histogram =====================
    const consentDays = clinicalEntries
      .map(e => e.days_to_consent)
      .filter((d): d is number => typeof d === 'number');

    const bins = Array.from({ length: 7 }, (_, i) => -15 + i * 10);
    const histogram = bins.map(bin => ({
      bin: `${bin}-${bin + 10}`,
      count: consentDays.filter(d => d >= bin && d < bin + 10).length,
    }));

    destroyChart(consentRef);
    new Chart(consentRef.current!, {
      type: 'bar',
      data: {
        labels: histogram.map(b => b.bin),
        datasets: [{
          label: 'Number of Cases',
          data: histogram.map(b => b.count),
          backgroundColor: '#4ecdc4',
        }],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Days Between Diagnosis and Consent' },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} cases`,
            },
          },
        },
        scales: {
          y: { title: { display: true, text: 'Number of Cases' }, beginAtZero: true },
          x: { title: { display: true, text: 'Days Range' }, grid: { display: false } },
        },
      },
    });

    // ===================== Disease Type Pie Chart =====================
    const diseaseCount: Record<string, number> = {};
    clinicalEntries.forEach(e => {
      const disease = e.disease_type || "Unknown";
      diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
    });

    destroyChart(diseaseTypeRef);
    new Chart(diseaseTypeRef.current!, {
      type: 'pie',
      data: {
        labels: Object.keys(diseaseCount),
        datasets: [{
          label: 'Disease Type',
          data: Object.values(diseaseCount),
          backgroundColor: ['#ff6b6b', '#ffcc5c', '#88d8b0', '#a29bfe', '#fd79a8'],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Disease Type Distribution' },
          legend: { position: 'bottom' },
        },
      },
    });

    // ===================== Primary Site Bar Chart =====================
    const siteCount: Record<string, number> = {};
    clinicalEntries.forEach(e => {
      const site = e.primary_site || "Unknown";
      siteCount[site] = (siteCount[site] || 0) + 1;
    });

    destroyChart(primarySiteRef);
    new Chart(primarySiteRef.current!, {
      type: 'bar',
      data: {
        labels: Object.keys(siteCount),
        datasets: [{
          label: 'Cases per Site',
          data: Object.values(siteCount),
          backgroundColor: '#45b7d1',
        }],
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Primary Site Breakdown' },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} cases`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Number of Cases' } },
          x: { title: { display: true, text: 'Primary Site' }, grid: { display: false } },
        },
      },
    });

  }, [data]); // Re-run the effect when `data` changes

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '1200px', margin: '30px auto' }}>
      <div style={{ flex: 1, marginRight: '10px' }}>
        <canvas ref={consentRef} style={{ width: '100%' }} />
      </div>
      <div style={{ flex: 1 }}>
        <canvas ref={primarySiteRef} style={{ width: '100%' }} />
      </div>
      <div style={{ flex: 1, marginRight: '10px' }}>
        <canvas ref={diseaseTypeRef} style={{ width: '100%' }} />
      </div>
    </div>
  );
};
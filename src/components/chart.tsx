import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { motion } from "framer-motion";

const destroyChart = (ref: React.RefObject<HTMLCanvasElement | null>) => {
  const el = ref.current;
  if (el) {
    const chart = Chart.getChart(el);
    if (chart) chart.destroy();
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
  const radarRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const consentDays = data
      .map(e => e.days_to_consent)
      .filter((d): d is number => typeof d === "number");

    // Auto-bin around data min and max for Days to Consent
    const min = Math.min(...consentDays, -30);
    const max = Math.max(...consentDays, 60);
    const binSize = 10;
    const bins = [];
    for (let i = min; i <= max; i += binSize) {
      bins.push(i);
    }
    const histogram = bins.map(bin => ({
      bin: `${bin}–${bin + binSize}`,
      count: consentDays.filter(d => d >= bin && d < bin + binSize).length,
    }));

    // Destroy and re-create the charts
    destroyChart(consentRef);
    new Chart(consentRef.current!, {
      type: "bar",
      data: {
        labels: histogram.map(b => b.bin),
        datasets: [
          {
            label: "Cases",
            data: histogram.map(b => b.count),
            backgroundColor: "#4ecdc4",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 700 },
        plugins: {
          title: { display: true, text: "Days Between Diagnosis and Consent" },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.raw}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Cases" } },
          x: { title: { display: true, text: "Day Range" }, grid: { display: false } },
        },
      },
    });

    // Disease Type Pie Chart
    const diseaseCount: Record<string, number> = {};
    data.forEach(e => {
      const disease = e.disease_type || "Unknown";
      diseaseCount[disease] = (diseaseCount[disease] || 0) + 1;
    });

    destroyChart(diseaseTypeRef);
    new Chart(diseaseTypeRef.current!, {
      type: "pie",
      data: {
        labels: Object.keys(diseaseCount),
        datasets: [
          {
            label: "Disease Type",
            data: Object.values(diseaseCount),
            backgroundColor: [
              "#ff6b6b", "#ffcc5c", "#88d8b0", "#a29bfe", "#fd79a8", "#55efc4", "#ffeaa7",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 500 },
        plugins: {
          title: { display: true, text: "Disease Type Distribution" },
          legend: { position: "bottom" },
        },
      },
    });

    // Primary Site Bar Chart
    const siteCount: Record<string, number> = {};
    data.forEach(e => {
      const site = e.primary_site || "Unknown";
      siteCount[site] = (siteCount[site] || 0) + 1;
    });

    destroyChart(primarySiteRef);
    new Chart(primarySiteRef.current!, {
      type: "bar",
      data: {
        labels: Object.keys(siteCount),
        datasets: [
          {
            label: "Cases per Site",
            data: Object.values(siteCount),
            backgroundColor: "#45b7d1",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        animation: { duration: 500 },
        plugins: {
          title: { display: true, text: "Primary Site Breakdown" },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.raw}`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Cases" } },
          x: { title: { display: true, text: "Site" }, grid: { display: false } },
        },
      },
    });

    // Radar Chart (Interactive)
    const diseaseSiteData: Record<string, Record<string, number>> = {};
    data.forEach(e => {
      const site = e.primary_site || "Unknown";
      const disease = e.disease_type || "Unknown";
      if (!diseaseSiteData[disease]) diseaseSiteData[disease] = {};
      diseaseSiteData[disease][site] = (diseaseSiteData[disease][site] || 0) + 1;
    });

    const radarData = {
      labels: Object.keys(diseaseSiteData),
      datasets: Object.keys(siteCount).map(site => ({
        label: site,
        data: Object.keys(diseaseSiteData).map(disease => diseaseSiteData[disease][site] || 0),
        borderColor: getColorForSite(site),
        backgroundColor: getColorForSite(site, 0.2),
        fill: true,
        pointBackgroundColor: getColorForSite(site),
      })),
    };

    destroyChart(radarRef);
    new Chart(radarRef.current!, {
      type: "radar",
      data: radarData,
      options: {
        responsive: true,
        animation: { duration: 700 },
        plugins: {
          title: { display: true, text: "Disease Distribution Across Primary Sites" },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.raw}`,
            },
          },
        },
        scales: {
          r: {
            min: 0,
            max: Math.max(...Object.values(siteCount)),
            ticks: {
              stepSize: 1,
              backdropColor: "transparent",
              color: "black",
            },
            angleLines: { display: false },
          },
        },
      },
    });
  }, [data]);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
      {/* First Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-base-100 p-6 rounded-2xl shadow-lg"
      >
        <canvas ref={consentRef} className="w-full h-[300px]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-base-100 p-6 rounded-2xl shadow-lg"
      >
        <canvas ref={primarySiteRef} className="w-full h-[300px]" />
      </motion.div>

      {/* Second Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-base-100 p-6 rounded-2xl shadow-lg"
      >
        <canvas ref={diseaseTypeRef} className="w-full h-[300px]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="bg-base-100 p-6 rounded-2xl shadow-lg"
      >
        <canvas ref={radarRef} className="w-full h-[300px]" />
      </motion.div>
    </div>
  );
};

// Helper function for getting colors for primary sites
function getColorForSite(site: string, alpha: number = 1): string {
  const colors: Record<string, string> = {
    "Unknown": "rgba(128, 128, 128, 1)",
    "Breast Cancer": "rgba(255, 105, 180, 1)",
    "Lung Cancer": "rgba(255, 165, 0, 1)",
    "Prostate Cancer": "rgba(70, 130, 180, 1)",
    // Add more site colors as needed
  };
  return colors[site] || `rgba(255, 99, 132, ${alpha})`;
}
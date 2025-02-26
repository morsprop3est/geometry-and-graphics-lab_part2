"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import styles from "./page.module.scss";

Chart.register(...registerables);

const xValues = [-0.6, -0.546, -0.492, -0.438, -0.385, -0.331, -0.277, -0.223, -0.169, -0.115, -0.062, -0.008, 0.046, 0.1];
const ySin2x = [-0.932, -0.888, -0.833, -0.769, -0.696, -0.614, -0.526, -0.431, -0.332, -0.229, -0.123, -0.015, 0.092, 0.199];
const yCos2x3 = [-0.227, -0.331, -0.430, -0.525, -0.613, -0.694, -0.768, -0.832, -0.887, -0.931, -0.965, -0.988, -0.999, -0.998];

function linearRegression(x, y) {
  const n = x.length;
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumXX = x.reduce((acc, val) => acc + val * val, 0);

  const a1 = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const a0 = (sumY - a1 * sumX) / n;
  return x.map(val => a0 + a1 * val);
}

function quadraticRegression(x, y) {
  const n = x.length;
  const sumX = x.reduce((acc, val) => acc + val, 0);
  const sumY = y.reduce((acc, val) => acc + val, 0);
  const sumXX = x.reduce((acc, val) => acc + val * val, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumXXX = x.reduce((acc, val) => acc + val * val * val, 0);
  const sumXXXX = x.reduce((acc, val) => acc + val * val * val * val, 0);
  const sumXYY = x.reduce((acc, val, i) => acc + val * val * y[i], 0);

  const denominator = n * (sumXX * sumXXXX - sumXXX * sumXXX) - sumX * (sumX * sumXXXX - sumXX * sumXXX) + sumXX * (sumX * sumXXX - sumXX * sumXX);
  const a0 = (sumY * (sumXX * sumXXXX - sumXXX * sumXXX) - sumX * (sumXY * sumXXXX - sumXYY * sumXXX) + sumXX * (sumXY * sumXXX - sumXYY * sumXX)) / denominator;
  const a1 = (n * (sumXY * sumXXXX - sumXYY * sumXXX) - sumY * (sumX * sumXXXX - sumXX * sumXXX) + sumXX * (sumY * sumXXX - sumXY * sumXX)) / denominator;
  const a2 = (n * (sumXX * sumXYY - sumXY * sumXXX) - sumX * (sumX * sumXYY - sumXY * sumXX) + sumY * (sumX * sumXXX - sumXX * sumXX)) / denominator;

  return x.map(val => a0 + a1 * val + a2 * val * val);
}

const ySin2xLinear = linearRegression(xValues, ySin2x);
const ySin2xQuadratic = quadraticRegression(xValues, ySin2x);
const yCos2x3Linear = linearRegression(xValues, yCos2x3);
const yCos2x3Quadratic = quadraticRegression(xValues, yCos2x3);

export default function Home() {
  const [showLinear, setShowLinear] = useState(false);
  const [showQuadratic, setShowQuadratic] = useState(false);

  const data = {
    labels: xValues,
    datasets: [
      { label: "y = sin(2x)", data: ySin2x, borderColor: "green", fill: false },
      { label: "y = cos(2x + 3)", data: yCos2x3, borderColor: "blue", fill: false },
      showLinear && { label: "Пряма (sin(2x))", data: ySin2xLinear, borderColor: "red", borderDash: [5, 5], fill: false },
      showLinear && { label: "Пряма (cos(2x + 3))", data: yCos2x3Linear, borderColor: "orange", borderDash: [5, 5], fill: false },
      showQuadratic && { label: "Парабола (sin(2x))", data: ySin2xQuadratic, borderColor: "purple", borderDash: [5, 5], fill: false },
      showQuadratic && { label: "Парабола (cos(2x + 3))", data: yCos2x3Quadratic, borderColor: "brown", borderDash: [5, 5], fill: false },
    ].filter(Boolean),
  };

  return (
      <div className={styles.container}>
        <h1>Графіки функцій</h1>
        <Line data={data} />
        <div className={styles.checkboxGroup}>
          <label>
            <input type="checkbox" checked={showLinear} onChange={() => setShowLinear(!showLinear)} />
            Показати прямі МНК
          </label>
          <label>
            <input type="checkbox" checked={showQuadratic} onChange={() => setShowQuadratic(!showQuadratic)} />
            Показати параболи МНК
          </label>
        </div>
      </div>
  );
}

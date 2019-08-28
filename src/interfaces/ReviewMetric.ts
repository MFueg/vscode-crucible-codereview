export interface ReviewMetricQuery {
  metricsData: Metrics[];
}

export interface Metrics {
  type: string;
  configVersion: number;
  label: string;
  defaultValue: Value;
  values: Value[];
}

export interface Value {
  name: string;
  value: number;
}

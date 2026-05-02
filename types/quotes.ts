import { Currency, MetricSystem } from "./shared";


export interface Quote {
    id: string
    metricSystem: MetricSystem
    currency: Currency
    taxPercentage: number

    createdAt: string;
    updatedAt: string;
}

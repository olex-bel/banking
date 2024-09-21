
import { ClientOnly } from "remix-utils/client-only";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ accounts }: DoughnutChartProps) {
    const accountNames = accounts.map((a) => a.name);
    const balances = accounts.map((a) => a.currentBalance)
    const data = {
        datasets: [
            {
              label: 'Banks',
              data: balances,
              backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'] 
            }
        ],
        labels: accountNames
    };
    const options = {
        cutout: "60%",
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <ClientOnly>
            {() => <Doughnut data={data} options={options} />}
        </ClientOnly>
    )
}
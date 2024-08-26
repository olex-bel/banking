
import { ClientOnly } from "remix-utils/client-only";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart() {
    const data = {
        datasets: [
            {
                label: "Banks",
                data: [1250, 2500, 3750],
                backgroundColor: ["#0747b5", "#2265d8", "#2f91fa"],
            }
        ],
        labels: ["Bank 1", "Bank 2", "Bank 3"],
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
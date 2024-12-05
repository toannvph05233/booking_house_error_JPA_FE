import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

var token = localStorage.getItem("token");

const AdminDoanhThu = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [viewMode, setViewMode] = useState("year"); // "year", "quarter", or "month"
    const [chartData, setChartData] = useState([]);
    const [chartLabel, setChartLabel] = useState("");

    useEffect(() => {
        loadChartData(selectedYear, viewMode);
    }, [selectedYear, viewMode]);

    // Fetch data based on year and viewMode
    async function loadChartData(year, mode) {
        let url = "";
        if (mode === "year") {
            url = `http://localhost:8080/api/statistic/admin/revenue-year?year=${year}`;
            setChartLabel(`Doanh thu theo tháng trong năm ${year}`);
        } else if (mode === "quarter") {
            url = `http://localhost:8080/api/statistic/admin/revenue-quarter?year=${year}`;
            setChartLabel(`Doanh thu theo quý trong năm ${year}`);
        }

        const response = await fetch(url, {
            method: "GET",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
            }),
        });
        const data = await response.json();
        setChartData(data);
        renderChart(data, mode, year);
    }

    // Render chart based on the data and mode
    function renderChart(data, mode, year) {
        const ctx = document.getElementById("chart").getContext("2d");
        let chartStatus = Chart.getChart("chart");
        if (chartStatus) {
            chartStatus.destroy();
        }

        const labels =
            mode === "year"
                ? ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
                : ["Quý 1", "Quý 2", "Quý 3", "Quý 4"];

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: chartLabel,
                        backgroundColor: "rgba(75, 192, 192, 0.5)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        data: data,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        ticks: {
                            callback: function (value) {
                                return formatMoney(value);
                            },
                        },
                    },
                },
            },
        });
    }

    // Format money to VND
    const VND = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    function formatMoney(money) {
        return VND.format(money);
    }

    // Handle year change
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <div>
            <div className="row mb-4">
                <div className="col-md-3">
                    <label className="form-label">Chọn năm cần xem</label>
                    <select className="form-select" value={selectedYear} onChange={handleYearChange}>
                        {[...Array(10)].map((_, index) => {
                            const year = new Date().getFullYear() - index;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="col-md-9 d-flex align-items-end">
                    <button className="btn btn-primary me-2" onClick={() => setViewMode("year")}>
                        Doanh thu theo tháng
                    </button>
                    <button className="btn btn-secondary me-2" onClick={() => setViewMode("quarter")}>
                        Doanh thu theo quý
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <canvas id="chart"></canvas>
                </div>
            </div>
        </div>
    );
};

export default AdminDoanhThu;

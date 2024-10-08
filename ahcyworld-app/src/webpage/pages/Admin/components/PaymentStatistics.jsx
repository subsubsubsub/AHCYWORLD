import React, { useEffect, useState } from "react";
import { getPaymentList } from "../../../../apis/auth";
import { Line, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import DataLabelsPlugin from "chartjs-plugin-datalabels"; // DataLabels 플러그인 import

Chart.register(DataLabelsPlugin); // DataLabels 플러그인 등록

const PaymentStatistics = () => {
    const [payments, setPayments] = useState([]);
    const [paymentSum, setPaymentSum] = useState({});
    const [highestMonthIndex, setHighestMonthIndex] = useState(null);

    const fetchPayments = async () => {
        try {
            const response = await getPaymentList();

            setPayments(response.data);
        } catch (error) {
            console.error("getPaymentList Error: ", error);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        if (payments.length > 0) {
            const sums = {};
            payments.forEach((payment) => {
                const date = new Date(payment.createAt);
                const month = date.getMonth() + 1; // 1월은 0부터 시작하므로 +1
                const year = date.getFullYear();
                const key = `${year}-${month}`;

                sums[key] = (sums[key] || 0) + payment.payment;
            });
            setPaymentSum(sums);

            const maxMonth = Object.keys(sums).reduce((a, b) => (sums[a] > sums[b] ? a : b));
            const maxMonthIndex = new Date(maxMonth).getMonth();
            setHighestMonthIndex(maxMonthIndex);
        }
    }, [payments]);

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Monthly Payment History",
                data: labels.map((_, i) => paymentSum[`2024-${i + 1}`] || 0), // 월별 데이터 추출
                backgroundColor: labels.map((_, i) => (i === highestMonthIndex ? "#FF6384" : "#9bdbf8")),
                borderColor: "#5a5a5a",
                borderWidth: 1,
                datalabels: {
                    color: "#444",
                    display: true,
                    align: "end",
                    anchor: "end",
                    formatter: (value) => {
                        return new Intl.NumberFormat("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                        }).format(value);
                    },
                    font: {
                        weight: "bold",
                    },
                },
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const month = labels[tooltipItem.dataIndex];
                        const amount = tooltipItem.raw;
                        return `${month}: ${new Intl.NumberFormat("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                        }).format(amount)}`;
                    },
                },
            },
            datalabels: {
                color: "#444",
                display: true,
                align: "top",
                anchor: "end",
                formatter: (value) => {
                    // 숫자를 원화 포맷으로 변환
                    return new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                    }).format(value);
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Month",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Amount",
                },
                ticks: {
                    callback: function (value) {
                        return new Intl.NumberFormat("ko-KR", {
                            style: "currency",
                            currency: "KRW",
                        }).format(value);
                    },
                },
            },
        },
    };

    return (
        <>
            <div className='payment-chart-container'>
                <h2>결제현황</h2>
                <div className='payment-line-chart'>
                    <Line data={data} options={options} />
                </div>
            </div>
        </>
    );
};

export default PaymentStatistics;

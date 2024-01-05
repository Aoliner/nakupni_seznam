import React, { useContext } from 'react'
import { Doughnut } from "react-chartjs-2"
import { ThemeContext } from '../App'
import { useTranslation } from "react-i18next"
import Chart from 'chart.js/auto';
export default function PieChart({ items }) {
    const { theme } = useContext(ThemeContext)
    const resolvedCount = items?.filter(item => item.isDone).length || 0
    const unresolvedCount = items?.filter(item => !item.isDone).length || 0
    const { t } = useTranslation(["list"])
    function changeColors(color1, color2) {
        return theme === 'dark' ? color1 : color2
    }
    const data = {
        labels: [t("Resolved"), t("Unresolved")],
        datasets: [
            {
                data: [resolvedCount, unresolvedCount],
                backgroundColor: [changeColors('#EEF5FF', '#38419D'), changeColors('#86B6F6', '#3887BE')],
                borderColor: changeColors("grey", "black"),
                borderWidth: 0.8
            },
        ],
    }
    return <div className="doughnut"><Doughnut
        options={{
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            plugins: {
                title: {
                    display: true,
                    text: t("Items' Statistics"),
                    color: changeColors("white", "black"),
                    font: function (context) {
                        var width = context.chart.width
                        var size = Math.round(width / 16)
                        return {
                            size: size,
                            weight: 600
                        }

                    }
                },
                legend: {
                    labels: {
                        color: changeColors("white", "black"),
                        font: function (context) {
                            var width = context.chart.width
                            var size = Math.round(width / 16)
                            return {
                                size: size,
                            }

                        }
                    },
                },
            },
        }}
        data={data} /></div>
}
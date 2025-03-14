import pintoTokenVanilla from "@/assets/tokens/PINTO_VANILLA.png";
import FrameAnimator from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { useAllMarket } from "@/state/market/useAllMarket";
import { useHarvestableIndex } from "@/state/useFieldData";
import { formatter } from "@/utils/format";
import {
    Chart,
    Legend,
    LinearScale,
    PointElement,
    ScatterController,
    Title,
    Tooltip,
} from "chart.js";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

Chart.register(ScatterController, PointElement, LinearScale, Title, Tooltip, Legend);

export interface MarketActivityScatterChartProps {
    readonly marketData: ReturnType<typeof useAllMarket>;
    readonly titleText: string;
}

export function MarketActivityScatterChart({
    marketData,
    titleText,
}: Readonly<MarketActivityScatterChartProps>) {
    const harvestableIndex = useHarvestableIndex();
    const { data, isLoaded, isFetching } = marketData;
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);
    const hasInitializedRef = useRef(false);
    const navigate = useNavigate();

    // Refs to track the selected data point for crosshair and pulsing effect.
    const selectedPointRef = useRef<any>(null);
    const isPointSelectedRef = useRef(false);

    const navigateTo = useCallback(
        (event) => {
            if (event.status === "ACTIVE") {
                if (event.type === "LISTING") {
                    navigate(`/market/pods/buy/${event.index}`);
                } else {
                    navigate(`/market/pods/sell/${event.id}`);
                }
            }
        },
        [navigate]
    );

    useEffect(() => {
        if (!isLoaded || !data || !data.length || hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        const processedData = data
            .map((event) => {
                let placeInLine = null;
                let price = null;
                let amount = null;
                let status = "";
                const originalEvent = event;
                const eventId = event.id;
                const eventType = event.type;
                let eventIndex = null;

                if (event.type === "LISTING") {
                    const evt = event;
                    amount = evt.originalAmount.toNumber();
                    price = evt.pricePerPod.toNumber();
                    const fillPct = evt.filled.div(evt.originalAmount).mul(100);
                    status =
                        fillPct.gt(99)
                            ? "FILLED"
                            : evt.status === "CANCELLED_PARTIAL"
                                ? "CANCELLED"
                                : evt.status;
                    placeInLine =
                        status === "ACTIVE"
                            ? evt.index.sub(harvestableIndex).toNumber() / 1000000 // Convert to M
                            : (!!evt.fillPlaceInLine
                                ? evt.fillPlaceInLine
                                : evt.originalPlaceInLine
                            ).toNumber() / 1000000;
                    eventIndex = evt.index;
                } else if (event.type === "ORDER") {
                    const evt = event;
                    const beanAmount = evt.beanAmount;
                    const beanAmountFilled = evt.beanAmountFilled;
                    const pricePerPod = evt.pricePerPod;
                    const podAmount = beanAmount.div(pricePerPod);
                    amount = podAmount.toNumber();
                    price = evt.pricePerPod.toNumber();
                    const fillPct = beanAmountFilled.div(beanAmount).mul(100);
                    status =
                        fillPct.gt(99)
                            ? "FILLED"
                            : evt.status === "CANCELLED_PARTIAL"
                                ? "CANCELLED"
                                : evt.status;
                    placeInLine = evt.maxPlaceInLine.toNumber() / 1000000;
                } else {
                    // For TRADE type
                    const evt = event;
                    amount = evt.podAmount?.toNumber() || 0;
                    placeInLine = evt.plotPlaceInLine?.toNumber() / 1000000 || 0;
                    price =
                        evt.podAmount && evt.beanAmountFilled
                            ? evt.beanAmountFilled.div(evt.podAmount).toNumber()
                            : 0;
                    status = "FILLED";
                }

                if (placeInLine !== null && price !== null) {
                    return {
                        x: placeInLine,
                        y: price,
                        r: Math.min(5, 3 + Math.log10(amount || 1) / 10),
                        amount: amount,
                        status,
                        originalEvent,
                        id: eventId,
                        type: eventType,
                        index: eventIndex,
                        interactable: status === "ACTIVE",
                    };
                }
                return null;
            })
            .filter((point) => point !== null);

        const canvas = document.getElementById("marketScatterChart") as HTMLCanvasElement;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = pintoTokenVanilla;

        const customTooltipPlugin = {
            id: "customTooltip",
            afterDraw: (chart: Chart) => {
                const tooltip = chart.tooltip;
                if (tooltip && tooltip.opacity !== 0) {
                    const { x, y } = tooltip;
                    if (tooltip._active && tooltip._active.length > 0 && img.complete) {
                        const iconSize = 16;
                        ctx.drawImage(img, x + 8, y + 5, iconSize, iconSize);
                    }
                }
            },
        };

        // Crosshair plugin: draws dashed lines from the selected point to the axes and displays x and y values.
        const crosshairPlugin = {
            id: "crosshairPlugin",
            afterDraw: (chart: Chart) => {
                if (!selectedPointRef.current) return;
                const point = selectedPointRef.current;
                const ctx = chart.ctx;
                const x = chart.scales.x.getPixelForValue(point.x);
                const y = chart.scales.y.getPixelForValue(point.y);
                const chartArea = chart.chartArea;
                ctx.save();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "gray";
                ctx.setLineDash([3, 3]);
                // Draw vertical line from point to x-axis (only from the point to the bottom edge)
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, chartArea.bottom);
                ctx.stroke();
                // Draw horizontal line from point to y-axis (only from the point to the left edge)
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(chartArea.left, y);
                ctx.stroke();
                ctx.setLineDash([]);
                // Draw value labels on the axes
                ctx.fillStyle = "black";
                ctx.font = "12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(formatter.twoDec(point.x) + "M", x, chartArea.bottom - 5);
                ctx.textAlign = "right";
                ctx.fillText(formatter.twoDec(point.y), chartArea.left + 25, y);
                ctx.restore();
            },
        };

        // Pulsing effect plugin for the selected data point.
        const pulsingEffectPlugin = {
            id: "pulsingEffect",
            afterDraw: (chart: Chart) => {
                if (selectedPointRef.current && isPointSelectedRef.current) {
                    const point = selectedPointRef.current;
                    const ctx = chart.ctx;
                    const now = Date.now();
                    const pulse = Math.abs(Math.sin(now / 500)) * 3; // pulse amplitude from 0 to 3
                    const baseRadius = point.r || 4;
                    const radius = baseRadius + pulse;
                    const x = chart.scales.x.getPixelForValue(point.x);
                    const y = chart.scales.y.getPixelForValue(point.y);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, 2 * Math.PI);
                    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                    ctx.fill();
                    ctx.restore();
                    requestAnimationFrame(() => chart.draw());
                }
            },
        };

        const newChartInstance = new Chart(ctx, {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "Active Listings/Orders",
                        data: processedData.filter((item) => item.status === "ACTIVE"),
                        backgroundColor: "#00C767",
                        borderColor: "#00C767",
                        pointRadius: 3,
                        pointHoverRadius: 4,
                    },
                    {
                        label: "Filled/Cancelled",
                        data: processedData.filter((item) => item.status !== "ACTIVE"),
                        backgroundColor: "#D3B567",
                        borderColor: "#D3B567",
                        pointRadius: 3,
                        pointHoverRadius: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: "linear",
                        position: "bottom",
                        min: 0,
                        max: 10,
                        grid: {
                            drawOnChartArea: false,
                            drawTicks: true,
                            tickLength: 5,
                        },
                        ticks: {
                            stepSize: 1,
                            callback: (value) => value + "M",
                        },
                    },
                    y: {
                        min: 0,
                        max: 1,
                        grid: {
                            drawOnChartArea: false,
                            drawTicks: true,
                            tickLength: 5,
                        },
                        ticks: {
                            stepSize: 0.20,
                            callback: (value) => formatter.twoDec(value),
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                const point = context.raw as any;
                                const amount = point.amount;
                                const pods = amount != null && !Number.isNaN(Number(amount)) ? Number(amount) : 0;
                                return [`${formatter.noDec(pods)} pods`];
                            },
                            labelPointStyle: () => ({
                                pointStyle: "rect",
                                rotation: 0,
                            }),
                        },
                        padding: { left: 30, right: 6, top: 6, bottom: 6 },
                    },
                    legend: { display: false },
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const element = elements[0];
                        const datasetIndex = element.datasetIndex;
                        const index = element.index;
                        const dataPoint = newChartInstance.data.datasets[datasetIndex].data[index];
                        if (dataPoint.interactable) {
                            canvas.style.cursor = "pointer";
                            selectedPointRef.current = dataPoint;
                            isPointSelectedRef.current = true;
                            newChartInstance.update();
                            navigateTo(dataPoint);
                        }
                    } else {
                        // Clear selection if click outside
                        selectedPointRef.current = null;
                        isPointSelectedRef.current = false;
                        newChartInstance.update();
                    }
                },
                onHover: (event, elements) => {
                    if (!isPointSelectedRef.current) {
                        if (elements.length > 0) {
                            const element = elements[0];
                            const datasetIndex = element.datasetIndex;
                            const index = element.index;
                            const dataPoint = newChartInstance.data.datasets[datasetIndex].data[index];
                            if (dataPoint.interactable) {
                                selectedPointRef.current = dataPoint;
                                newChartInstance.update();
                                canvas.style.cursor = "pointer";
                            }
                        } else {
                            selectedPointRef.current = null;
                            newChartInstance.update();
                            canvas.style.cursor = "default";
                        }
                    }
                },
            },
            plugins: [customTooltipPlugin, crosshairPlugin, pulsingEffectPlugin],
        });

        setChartInstance(newChartInstance);

        return () => {
            if (newChartInstance) {
                newChartInstance.destroy();
                hasInitializedRef.current = false;
                selectedPointRef.current = null;
                isPointSelectedRef.current = false;
            }
        };
    }, [isLoaded, data]);

    return (
        <Card className="h-full w-full mt-4">
            <CardHeader>
                <div className="flex space-x-2">
                    <CardTitle className="pinto-body-light text-pinto-light ml-2.5">
                        {titleText}
                    </CardTitle>
                    {isFetching && !hasInitializedRef.current && (
                        <FrameAnimator className="-mt-5 -mb-12" size={80} />
                    )}
                </div>
            </CardHeader>
            <CardContent className="h-[25rem]">
                <div className="w-full h-full">
                    <canvas id="marketScatterChart" />
                </div>
            </CardContent>
        </Card>
    );
}

export default MarketActivityScatterChart;

import { Card, CardContent, CardTitle, CardHeader, CardDescription } from "@/components/ui/card"
import type { ChartConfig } from "@/components/ui/chart"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent} from "@/components/ui/chart"
import { barGraphData } from "@/utils/chartdata"
import { useMemo, useState } from "react"
import { BarChart, CartesianGrid, XAxis, Bar } from "recharts"


// configurations for barchart data
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export const barChartDescription  = "An interactive barchart";

export default function BarChartInteractive() {
    const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>("desktop");
    const total = useMemo(
        () => ({
          desktop: barGraphData.reduce((acc, curr) => acc + curr.desktop, 0),
          mobile: barGraphData.reduce((acc, curr) => acc + curr.mobile, 0),
        }),
        []
    )

    return (
        <>
            <Card>
                <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
                        <CardTitle>Interactive barchart</CardTitle>
                        <CardDescription>
                           Showing total sales for 6 months
                        </CardDescription>
                    </div>
                    <div className="flex">
                        {["desktop", "mobile"].map((key) => {
                            const chart = key as keyof typeof chartConfig
                            return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-muted-foreground text-xs">
                                {chartConfig[chart].label}
                                </span>
                                <span className="text-lg leading-none font-bold sm:text-3xl">
                                {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                            )
                        })}
                    </div>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={barGraphData}>
                            <ChartTooltip content={<ChartTooltipContent/>}/>
                            <ChartLegend content={<ChartLegendContent />} />
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={12}
                                minTickGap={32}
                                tickFormatter={(value) => value.slice(0,3)}
                            />
                            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </>
    )
}
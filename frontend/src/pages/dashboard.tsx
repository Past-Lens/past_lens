import Sidebar from "@/components/custom/Sidebar"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { BarChart, CartesianGrid, XAxis, Line, LineChart} from "recharts"
import { Bar } from "recharts"
import { data, lineData } from "@/utils/chartdata"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartLineInteractive } from "@/components/linechart"

// const chartConfig = {
//   value: {
//     label: "Sales",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig;

{/* <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
             "use client" */}


export const description = "An interactive line chart"





// export function ChartLineInteractive() {
//   const [activeChart, setActiveChart] =
//     React.useState<keyof typeof chartConfig>("desktop")

//   const total = React.useMemo(
//     () => ({
//       desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
//       mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
//     }),
//     []
//   )
// }

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

// const chartConfig2 = {
//   views: {
//     label: "Page Views",
//   },
//   desktop: {
//     label: "Desktop",
//     color: "var(--chart-1)",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "var(--chart-2)",
//   },
// } satisfies ChartConfig

function Dashboard() {

  return (
    <>
     <SidebarProvider>
        <Sidebar/>
         <main className="flex-1 relative">
          <SidebarTrigger />
          <div className=" grid lg:grid-cols-2  bg-slate-800 w-[100] h-screen gap-4 p-4">
            {/* <ChartContainer config={chartConfig}>
              <BarChart data={data}>
                <Bar dataKey="value" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer> */}
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={data}>
                <ChartTooltip content={<ChartTooltipContent/>}/>
                <ChartLegend content={<ChartLegendContent />} />
                 <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
            <ChartLineInteractive></ChartLineInteractive>
             
  {/* return (
    <Card className="py-4 sm:py-0"> */}
      {/* <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
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
      </CardHeader> */}
      {/* <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent> */}
    {/* </Card> */}
 

            {/* </ChartContainer> */}
            <div className="bg-orange-300">
              ewtioegjtlk
            </div>
            <div className="bg-orange-300">
              ewtioegjtlk
            </div>
            <div className="bg-orange-300">
              ewtioegjtlk
            </div>
          </div>
         </main>
     </SidebarProvider>
 
    </>
  )
}

export default Dashboard
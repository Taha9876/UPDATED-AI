"use client"

import { cn } from "@/lib/utils"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  Bar,
  BarChart,
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Dot,
} from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@tremor/react"

const CHART_MARGINS = { top: 20, right: 20, bottom: 20, left: 20 }

type ChartProps = {
  data: Record<string, any>[]
  config: ChartConfig
  type: "line" | "bar" | "area"
  className?: string
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(({ data, config, type, className, ...props }, ref) => {
  const ChartComponent = type === "line" ? LineChart : type === "bar" ? BarChart : AreaChart

  const renderChartElements = () => {
    return Object.entries(config).map(([key, item]) => {
      if (item.type === "line") {
        return (
          <Line
            key={key}
            dataKey={key}
            stroke={item.color}
            dot={<Dot fill={item.color} stroke={item.color} r={4} />}
            activeDot={<Dot fill={item.color} stroke={item.color} r={6} />}
            type="monotone"
          />
        )
      }
      if (item.type === "bar") {
        return <Bar key={key} dataKey={key} fill={item.color} radius={[4, 4, 0, 0]} />
      }
      if (item.type === "area") {
        return <Area key={key} dataKey={key} stroke={item.color} fill={item.color} fillOpacity={0.3} type="monotone" />
      }
      return null
    })
  }

  return (
    <ChartContainer ref={ref} config={config} className={cn("min-h-[200px] w-full", className)} {...props}>
      <ResponsiveContainer>
        <ChartComponent data={data} margin={CHART_MARGINS}>
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
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {renderChartElements()}
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  )
})

Chart.displayName = "Chart"

export { Chart }

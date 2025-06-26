import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";

type TimeControl = "blitz" | "bullet" | "rapid";

export function RatingChart({ timeControl }: { timeControl: TimeControl }) {
  const generateRatingData = (baseRating: number) => {
    const data = [];
    let currentRating = baseRating - 50;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const change = (Math.random() - 0.5) * 40;
      currentRating += change;
      currentRating = Math.max(800, Math.min(2000, currentRating));

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        rating: Math.round(currentRating),
      });
    }

    return data;
  };

  const baseRatings: Record<TimeControl, number> = {
    blitz: 1245,
    bullet: 1180,
    rapid: 1290,
  };

  const data = generateRatingData(baseRatings[timeControl]);

  const chartConfig = {
    rating: {
      label: "Rating",
      color:
        timeControl === "blitz"
          ? "hsl(142, 76%, 36%)"
          : timeControl === "bullet"
            ? "hsl(221, 83%, 53%)"
            : "hsl(262, 83%, 58%)",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 12 }} />
          <YAxis
            className="text-xs"
            tick={{ fontSize: 12 }}
            domain={["dataMin - 20", "dataMax + 20"]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="var(--color-rating)"
            strokeWidth={2}
            dot={{ fill: "var(--color-rating)", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "var(--color-rating)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLang } from "@/hooks/useLang";
import { Fragment, type ReactNode } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import AppLayout from "../../Layouts/AppLayout";

type StatisticsPageProps = {
    total: number;
    completed: number;
    byCategory: Record<string, number>;
};

const CATEGORY_COLORS: Record<string, string> = {
    general: '#C8B89A',
    work: '#B8A9D9',
    personal: '#B7CFA4',
    meeting: '#D0A18A',
    study: '#D2A25A',
    health: '#E58B86',
    household: '#D2B496',
    career: '#AAB7E6',
    family: '#B8D6C6',
    finance: '#D6B85C',
};

function Statistics({ total, completed, byCategory }: StatisticsPageProps) {
    const { __ } = useLang();

    const chartData = Object.entries(byCategory).map(([category, count]) => ({
        name: __(`messages.${category}`),
        value: count,
        color: CATEGORY_COLORS[category] ?? '#888',
    }));

    return (
        <div className="px-4 pt-5 pb-24">
            <PageHeader
                title={__('messages.statistics')}
                backHref="/profile"
            />

            <Select>
                <SelectTrigger className="w-full mb-4">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent />
            </Select>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <Card>
                    <CardContent className="flex flex-col gap-0.5 py-3 px-3">
                        <span className="text-xs text-hint-foreground">{__('messages.total_tasks')}</span>
                        <span className="text-2xl font-heading font-bold text-white">{total}</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex flex-col gap-0.5 py-3 px-3">
                        <span className="text-xs text-hint-foreground">{__('messages.completed')}</span>
                        <div className="flex justify-between items-baseline gap-2">
                            <span className="text-2xl font-heading font-bold text-white">{completed}</span>
                            <span className="text-xs text-hint-foreground">
                                {total > 0 ? Math.round((completed / total) * 100) : 0}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="py-4 px-3">
                    <p className="text-sm font-semibold text-white mb-3">{__('messages.by_category')}</p>
                    <div className="flex items-center gap-4">
                        <PieChart width={120} height={120}>
                            <Pie
                                data={chartData}
                                cx={55}
                                cy={55}
                                innerRadius={36}
                                outerRadius={54}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [value, '']}
                                contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: 8, fontSize: 12 }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>

                        <div className="grid gap-x-3 gap-y-1.5" style={{ gridTemplateColumns: 'auto auto', alignSelf: 'start' }}>
                            {chartData.map((entry, index) => (
                                <Fragment key={index}>
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className="size-2 rounded-full shrink-0"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-xs text-hint-foreground truncate">{entry.name}</span>
                                    </div>
                                    <span className="text-xs text-white font-medium text-right self-center">
                                        {total > 0 ? Math.round((entry.value / total) * 100) : 0}%
                                    </span>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

Statistics.layout = (page: ReactNode) => <AppLayout children={page} />;

export default Statistics;

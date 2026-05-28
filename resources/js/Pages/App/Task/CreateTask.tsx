import TypeCard from "@/components/task/TypeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, getDefaultTimeRange } from "@/lib/utils";
import { Category } from "@/types/enums/category";
import { Priority } from "@/types/enums/priority";
import { RecurrenceType } from "@/types/enums/recurrenceType";
import { ReminderInterval } from "@/types/enums/reminderInterval";
import { WeekDays } from "@/types/enums/weekDays";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { addDays, format, isSameDay, startOfDay } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronDownIcon, ChevronLeft, Clock, RefreshCw, Settings2, Sparkles } from "lucide-react";
import { RadioGroup } from "radix-ui";
import { ReactNode, useState } from "react";
import { toast } from "sonner";
import { useLang } from "../../../hooks/useLang";
import AppLayout from "../../../Layouts/AppLayout";

type PageProps = {
    currentLanguage: string
}

type HomePageProps = {
    priorities: Priority[],
    categories: Category[],
    reminders: ReminderInterval[],
    weekDays: WeekDays[],
    recurrenceTypes: RecurrenceType[],
}

type FormProps = {
    title: string,
    description?: string,
    date?: Date,
    startTime?: string,
    endTime?: string,
    category?: string,
    priority?: string,
    reminderInterval?: string,
    recurrence?: string,
    weekDay?: string,
    monthDay?: number,
}

const CreateTask: React.FC<HomePageProps> & { layout?: (page: ReactNode) => ReactNode } = function CreateTask({ priorities, categories, reminders, weekDays, recurrenceTypes }: HomePageProps) {
    const { __ } = useLang();
    const { currentLanguage } = usePage<PageProps>().props;
    const range = getDefaultTimeRange();
    const today = startOfDay(new Date());
    const defaultStartTime = format(range.start, "HH:mm");
    const defaultEndTime = format(range.end, "HH:mm");
    const [step, setStep] = useState<string>('choose');
    const [DatePopoverOpen, setDatePopoverOpen] = useState<boolean>(false);
    const [isCollapsiblePreferencesOpen, setIsCollapsiblePreferencesOpen] = useState<boolean>(false);
    const [isCollapsibleTimeOpen, setIsCollapsibleTimeOpen] = useState<boolean>(false);
    const [isCollapsibleRecurrenceOpen, setIsCollapsibleRecurrenceOpen] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormProps>({
        title: "",
        description: "",
        date: new Date(),
        startTime: defaultStartTime,
        endTime: defaultEndTime,
        category: "general",
        priority: "low",
        reminderInterval: "no_reminder",
        recurrence: undefined,
        weekDay: undefined,
        monthDay: undefined,
    });

    const stepTitleMessages: Record<string, string> = {
        choose: __('messages.new_task'),
        simple: __('messages.new_simple_task'),
        routine: __('messages.new_routine_task'),
    };

    const timeLabel = (() => {
        if (!data.date) return __('messages.today');

        const normalized = startOfDay(data.date);

        if (isSameDay(normalized, today)) return __('messages.today');
        if (isSameDay(normalized, addDays(today, 1))) return __('messages.tomorrow');
        return format(normalized, "d 'de' MMM", { locale: currentLanguage === 'pt_br' ? ptBR : enUS });
    })();

    const preferencesLabel = (() => {
        if (isCollapsibleRecurrenceOpen) return '';

        let label = __('messages.' + data.recurrence);

        if (data.recurrence === 'weekly' && data.weekDay) {
            label += ' · ' + __('messages.' + data.weekDay);
        }

        if (data.recurrence === 'monthly' && data.weekDay) {
            label += ' · ' + data.monthDay
        }

        return label;
    })();

    function save(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        post('/tasks', {
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
            onFinish: () => {
                reset();
                router.visit(`/home`, { viewTransition: true });
            }
        })
    }

    function goBack() {
        reset();
        switch (step) {
            case 'simple':
                setStep('choose');
                break;
            case 'routine':
                setStep('choose');
                break;
            default:
                router.visit(`/home`, { viewTransition: true });
                break;
        }
    }

    function handleChoose(type: string) {
        if (type === 'simple') {
            setData('recurrence', undefined);
            setData('weekDay', undefined);
            setData('monthDay', undefined);
        } else {
            setData('recurrence', 'daily');
        }

        setStep(type);
    }

    function setCategory(category: string) {
        setData('category', category);
    }

    function setPriority(priority: string) {
        setData('priority', priority);
    }

    function setReminder(reminder: string) {
        setData('reminderInterval', reminder);
    }

    function setRecurrence(recurrence: string) {
        setData('recurrence', recurrence);

        if (recurrence !== 'daily') {
            const now = new Date();
            const currentWeekDay = weekDays[now.getDay()]?.id || '';

            if (recurrence === 'weekly') {
                setData('weekDay', currentWeekDay);
            } else {
                setData('monthDay', now.getDate());
            }
        } else {
            setData('weekDay', undefined);
            setData('monthDay', undefined);
        }
    }

    return (
        <>
            <Head title={__('messages.new_task')} />
            <div className="max-w-2xl mx-auto px-4 pt-12 pb-24">
                <div className="flex items-center gap-3 mb-6">
                    <Button size="icon" className="hover:bg-destructive/10" variant="ghost" onClick={goBack}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <h1 className="font-heading text-2xl font-bold text-foreground tracking-wide flex items-center gap-2">
                        {stepTitleMessages[step]}
                    </h1>
                </div>

                {step === 'choose' && (
                    <motion.div
                        key="choose"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-4 flex-1"
                    >
                        {/* decorative orb hint */}
                        <div className="flex items-center justify-center mb-2">
                            <motion.div
                                animate={{ rotate: [0, 10, -8, 10, 0], scale: [1, 1.08, 1] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center"
                            >
                                <Sparkles className="w-7 h-7 text-primary" strokeWidth={1.5} />
                            </motion.div>
                        </div>

                        <p className="font-body text-sm text-muted-foreground text-center italic mb-2">
                            {__('messages.what_type_of_task_do_you_want_to_create')}
                        </p>

                        <TypeCard
                            icon={Calendar}
                            title={__('messages.simple_task')}
                            subtitle={__('messages.a_unique_event_with_a_specific_date_start_time_and_end_time')}
                            color="bg-violet-500/15 text-violet-600 border border-violet-400/30"
                            onClick={() => handleChoose('simple')}
                        />

                        <TypeCard
                            icon={RefreshCw}
                            title={__('messages.routine_task')}
                            subtitle={__('messages.repeats_daily_weekly_or_monthly')}
                            color="bg-amber-500/15 text-amber-600 border border-amber-400/30"
                            onClick={() => handleChoose('routine')}
                        />
                    </motion.div>
                )}

                {step != 'choose' && (
                    <>
                        <Card className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/60 mt-4">
                            <CardContent className="p-4">
                                <form onSubmit={save} id="create-task-form" className="flex flex-col space-y-5 px-2">
                                    <div>
                                        <Label htmlFor="title" className="uppercase mb-2">{__('messages.title')}*</Label>
                                        <Input
                                            value={data.title}
                                            id="title"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                                            placeholder={__('messages.task_name') + '*'}
                                            className="font-body text-base border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                                        />
                                        {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
                                    </div>
                                    <div>
                                        <Label htmlFor="description" className="uppercase mb-2">{__('messages.description')}</Label>
                                        <Textarea
                                            value={data.description}
                                            id="description"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                            placeholder={__('messages.description') + '...'}
                                            className="font-body text-base border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary" />
                                    </div>

                                    <Collapsible
                                        className="border border-border/50 bg-card/40 hover:bg-card/70 rounded-xl"
                                        open={isCollapsiblePreferencesOpen}
                                        onOpenChange={setIsCollapsiblePreferencesOpen}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" className="w-full cursor-pointer hover:bg-transparent data-[state=open]:bg-transparent flex justify-between">
                                                <div className="flex items-center gap-2 uppercase">
                                                    <Settings2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wider flex-1">{__('messages.preferences')}</span>
                                                </div>
                                                <div className="flex items-center gap-3 justify-end">
                                                    <span className="font-body text-xs text-foreground/70 max-w-60">
                                                        {!isCollapsiblePreferencesOpen && (
                                                            <>
                                                                {__('messages.' + data.category) + ' · ' + __('messages.' + data.priority) + ' · ' + __('messages.' + data.reminderInterval)}
                                                            </>
                                                        )}
                                                    </span>
                                                    <ChevronDownIcon className="w-3.5 h-3.5 ml-auto group-data-[state=open]:rotate-180" />
                                                </div>
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="p-4">
                                            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">{__('messages.category')}</p>
                                            <RadioGroup.Root onValueChange={(value: string) => setCategory(value)}>
                                                <div className="flex flex-wrap gap-2">
                                                    {categories.map(category => (
                                                        <RadioGroup.Item key={category.id} value={category.id}>
                                                            <RadioGroup.Indicator />
                                                            <Badge variant="outline" className={`p-4 cursor-pointer ${data.category === category.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/60 border-border text-foreground hover:bg-secondary/60'} `}>
                                                                <div className={`rounded-full w-2 h-2 ${category.color}`}></div>
                                                                {category.title}
                                                            </Badge>
                                                        </RadioGroup.Item>
                                                    ))}
                                                </div>
                                            </RadioGroup.Root>
                                            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-3 mb-1.5">{__('messages.priority')}</p>
                                            <RadioGroup.Root onValueChange={(value: string) => setPriority(value)}>
                                                <div className="flex flex-wrap gap-2">
                                                    {priorities.map(priority => (
                                                        <RadioGroup.Item key={priority.id} value={priority.id}>
                                                            <RadioGroup.Indicator />
                                                            <Badge variant="outline" className={`p-4 cursor-pointer ${data.priority === priority.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/60 border-border text-foreground hover:bg-secondary/60'} `}>
                                                                {priority.title}
                                                            </Badge>
                                                        </RadioGroup.Item>
                                                    ))}
                                                </div>
                                            </RadioGroup.Root>
                                            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-3 mb-1.5">{__('messages.notification')}</p>
                                            <RadioGroup.Root onValueChange={(value: string) => setReminder(value)}>
                                                <div className="flex flex-wrap gap-2">
                                                    {reminders.map(reminder => (
                                                        <RadioGroup.Item key={reminder.id} value={reminder.id}>
                                                            <RadioGroup.Indicator />
                                                            <Badge variant="outline" className={`p-4 cursor-pointer ${data.reminderInterval === reminder.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/60 border-border text-foreground hover:bg-secondary/60'} `}>
                                                                {reminder.title}
                                                            </Badge>
                                                        </RadioGroup.Item>
                                                    ))}
                                                </div>
                                            </RadioGroup.Root>
                                        </CollapsibleContent>
                                    </Collapsible>

                                    <Collapsible
                                        className="border border-border/50 bg-card/40 hover:bg-card/70 rounded-xl"
                                        open={isCollapsibleTimeOpen}
                                        onOpenChange={setIsCollapsibleTimeOpen}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <Button variant="ghost" className="w-full cursor-pointer hover:bg-transparent data-[state=open]:bg-transparent flex justify-between">
                                                <div className="flex items-center gap-2 uppercase">
                                                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wider flex-1">{__('messages.time')}</span>
                                                </div>
                                                <div className="flex items-center gap-3 justify-end">
                                                    <span className="font-body text-xs text-foreground/70 truncate max-w-35">
                                                        {!isCollapsibleTimeOpen && `${data.startTime} – ${data.endTime}${step === 'simple' ? ' · ' + timeLabel : ''}`}
                                                    </span>
                                                    <ChevronDownIcon className="w-3.5 h-3.5 ml-auto group-data-[state=open]:rotate-180" />
                                                </div>
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="p-4">
                                            <div className="flex items-center gap-3 mb-5">
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.start_time')}</p>
                                                    <Input
                                                        type="time"
                                                        value={data.startTime || formatDate(range.start, "HH:mm")}
                                                        onChange={e => setData('startTime', e.target.value || formatDate(range.start, "HH:mm"))}
                                                        className="font-body h-9 text-sm"
                                                    />
                                                </div>
                                                <div className="w-4 h-px bg-border mt-4" />
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.end_time')}</p>
                                                    <Input
                                                        type="time"
                                                        value={data.endTime || formatDate(range.end, "HH:mm")}
                                                        onChange={e => setData('endTime', e.target.value || formatDate(range.end, "HH:mm"))}
                                                        className="font-body h-9 text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {step === 'simple' && (
                                                <Popover open={DatePopoverOpen} onOpenChange={setDatePopoverOpen}>
                                                    <PopoverTrigger asChild>
                                                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card/60 hover:bg-secondary/50 transition-all font-body text-sm text-foreground w-full">
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                            {timeLabel}
                                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0 z-200" align="start">
                                                        <CalendarPicker
                                                            mode="single"
                                                            selected={data.date}
                                                            onSelect={d => { if (d) { setData('date', d); setDatePopoverOpen(false); } }}
                                                            locale={currentLanguage === 'pt_br' ? ptBR : enUS}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        </CollapsibleContent>
                                    </Collapsible>

                                    {step === 'routine' && (
                                        <Collapsible
                                            className="border border-border/50 bg-card/40 hover:bg-card/70 rounded-xl"
                                            open={isCollapsibleRecurrenceOpen}
                                            onOpenChange={setIsCollapsibleRecurrenceOpen}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <Button variant="ghost" className="w-full cursor-pointer hover:bg-transparent data-[state=open]:bg-transparent flex justify-between">
                                                    <div className="flex items-center gap-2 uppercase">
                                                        <RefreshCw className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                        <span className="font-body text-xs text-muted-foreground uppercase tracking-wider flex-1">{__('messages.periodicity')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 justify-end">
                                                        <span className="font-body text-xs text-foreground/70 max-w-44">
                                                            {preferencesLabel}
                                                        </span>
                                                        <ChevronDownIcon className="w-3.5 h-3.5 ml-auto group-data-[state=open]:rotate-180" />
                                                    </div>
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="p-4">
                                                <div className="flex flex-col gap-4">
                                                    <RadioGroup.Root value={data.recurrence} onValueChange={(value: string) => setRecurrence(value)} className="flex flex-wrap gap-2">
                                                        {recurrenceTypes.map(recurrence => (
                                                            <RadioGroup.Item key={recurrence.id} value={recurrence.id}>
                                                                <RadioGroup.Indicator />
                                                                <Badge variant="outline" className={`p-4 cursor-pointer ${data.recurrence === recurrence.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/60 border-border text-foreground hover:bg-secondary/60'} `}>
                                                                    {recurrence.title}
                                                                </Badge>
                                                            </RadioGroup.Item>
                                                        ))}
                                                    </RadioGroup.Root>
                                                </div>
                                                {data.recurrence === 'monthly' && (
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.week_day')}</p>
                                                        <RadioGroup.Root value={data.monthDay?.toString()} onValueChange={(value: string) => setData('monthDay', parseInt(value))} className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                                                            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                                <RadioGroup.Item key={d} value={d.toString()}>
                                                                    <RadioGroup.Indicator />
                                                                    <Badge variant="outline" className={`p-4 cursor-pointer ${data.monthDay === d ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/60 border-border text-foreground hover:bg-secondary/60'} `}>
                                                                        {d}
                                                                    </Badge>
                                                                </RadioGroup.Item>
                                                            ))}
                                                        </RadioGroup.Root>
                                                    </div>
                                                )}

                                                {data.recurrence === 'weekly' && (
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.month_day')}</p>
                                                        <RadioGroup.Root value={data.weekDay} onValueChange={(value: string) => setData('weekDay', value)} className="flex flex-wrap gap-2 mt-2">
                                                            {weekDays.map(weekDay => (
                                                                <RadioGroup.Item key={weekDay.id} value={weekDay.id}>
                                                                    <RadioGroup.Indicator />
                                                                    <Badge variant="outline" className={`p-4 cursor-pointer ${data.weekDay === weekDay.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/60 border-border text-foreground hover:bg-secondary/60'} `}>
                                                                        {weekDay.title}
                                                                    </Badge>
                                                                </RadioGroup.Item>
                                                            ))}
                                                        </RadioGroup.Root>
                                                    </div>
                                                )}

                                            </CollapsibleContent>
                                        </Collapsible>
                                    )}

                                </form>
                            </CardContent>
                        </Card>
                        <div className="flex gap-3 pb-6 mt-5">
                            <Button variant="outline" className="flex-1" onClick={() => goBack()}>
                                {__('messages.back')}
                            </Button>
                            <Button type="submit" className="flex-1 bg-[#7B1F2D]" form="create-task-form" disabled={processing}>
                                {processing ? <Spinner className="ml-2" /> : ''}
                                {__('messages.create')}
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

CreateTask.layout = (page: ReactNode) => (
    <AppLayout>{page}</AppLayout>
)

export default CreateTask;
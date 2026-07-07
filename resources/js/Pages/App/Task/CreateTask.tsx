import PageHeader from "@/components/layout/PageHeader";
import TypeCard from "@/components/task/TypeCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { AlignLeft, Bell, Calendar, CheckCircle2, ChevronDownIcon, Clock, FileText, Folder, RefreshCw, Tag } from "lucide-react";
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
    date?: string,
    startTime?: string,
    endTime?: string,
    category?: string,
    priority?: string,
    reminderInterval?: string,
    recurrence?: string,
    weekDay?: string[],
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
    const [isDescriptionOpen, setIsDescriptionOpen] = useState<boolean>(false);
    const [isDateOpen, setIsDateOpen] = useState<boolean>(false);
    const [isTimeOpen, setIsTimeOpen] = useState<boolean>(false);
    const [isPriorityOpen, setIsPriorityOpen] = useState<boolean>(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
    const [isReminderOpen, setIsReminderOpen] = useState<boolean>(false);
    const [isRecurrenceOpen, setIsRecurrenceOpen] = useState<boolean>(false);

    const { data, setData, post, processing, errors, reset } = useForm<FormProps>({
        title: "",
        description: "",
        date: format(new Date(), 'yyyy-MM-dd'),
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

        const normalized = new Date(data.date + 'T00:00:00');

        if (isSameDay(normalized, today)) return __('messages.today');
        if (isSameDay(normalized, addDays(today, 1))) return __('messages.tomorrow');
        return format(normalized, "d 'de' MMM", { locale: currentLanguage === 'pt_br' ? ptBR : enUS });
    })();

    const recurrenceLabel = (() => {
        if (isRecurrenceOpen) return '';

        let label = __('messages.' + data.recurrence);

        if (data.recurrence === 'weekly' && data.weekDay && data.weekDay.length > 0) {
            label += ' · ' + data.weekDay.map(d => __('messages.' + d)).join(', ');
        }

        if (data.recurrence === 'monthly' && data.monthDay) {
            label += ' · ' + data.monthDay;
        }

        return label;
    })();

    const selectedPriority = priorities.find(p => p.id === data.priority);
    const selectedCategory = categories.find(c => c.id === data.category);
    const selectedReminder = reminders.find(r => r.id === data.reminderInterval);

    function save(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        post('/tasks', {
            onSuccess: () => {
                reset();
                router.visit(`/home`, { viewTransition: true });
            },
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
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
                setData('weekDay', [currentWeekDay]);
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
            <div className="px-4 pt-5 pb-24">
                <PageHeader
                    title={stepTitleMessages[step]}
                    subtitle={step === 'choose' ? __('messages.what_type_of_task_do_you_want_to_create') : undefined}
                    onBack={goBack}
                />

                {step === 'choose' && (
                    <motion.div
                        key="choose"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col gap-4 flex-1"
                    >
                        <TypeCard
                            icon={Calendar}
                            title={__('messages.simple_task')}
                            subtitle={__('messages.a_unique_event_with_a_specific_date_start_time_and_end_time')}
                            color="bg-primary/10 text-primary border border-primary/20"
                            onClick={() => handleChoose('simple')}
                        />

                        <TypeCard
                            icon={RefreshCw}
                            title={__('messages.routine_task')}
                            subtitle={__('messages.repeats_daily_weekly_or_monthly')}
                            color="bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            onClick={() => handleChoose('routine')}
                        />
                    </motion.div>
                )}

                {step != 'choose' && (
                    <>
                        <form onSubmit={save} id="create-task-form" className="flex flex-col space-y-3 mt-4">
                            <div className="flex items-start gap-4 p-4 rounded-2xl border border-card-border bg-card">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-surface-tertiary border border-border/60 text-nav-icon mt-0.5">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Label htmlFor="title" className="mb-2">{__('messages.task_title')}</Label>
                                    <Input
                                        value={data.title}
                                        id="title"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('title', e.target.value)}
                                        placeholder={__('messages.task_name_placeholder')}
                                        className="font-body text-base border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                                    />
                                    {errors.title && <span className="text-destructive text-xs">{errors.title}</span>}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-card-border bg-card overflow-hidden">
                                <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-secondary/50 transition-colors text-left">
                                            <AlignLeft className="w-4 h-4 text-nav-icon shrink-0" />
                                            <span className="flex-1 font-body text-sm text-foreground">{__('messages.description')}</span>
                                            {!isDescriptionOpen && data.description && (
                                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                            )}
                                            <ChevronDownIcon className={`w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform ${isDescriptionOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 pb-4">
                                        <Textarea
                                            value={data.description}
                                            id="description"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('description', e.target.value)}
                                            placeholder={__('messages.description_placeholder')}
                                            className="font-body text-base border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0 focus-visible:border-primary" />
                                    </CollapsibleContent>
                                </Collapsible>

                                <Separator className="mx-4" />

                                {step === 'simple' && (
                                    <>
                                        <Collapsible open={isDateOpen} onOpenChange={setIsDateOpen}>
                                            <CollapsibleTrigger asChild>
                                                <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-secondary/50 transition-colors text-left">
                                                    <Calendar className="w-4 h-4 text-nav-icon shrink-0" />
                                                    <span className="flex-1 font-body text-sm text-foreground">{__('messages.date')}</span>
                                                    <span className="font-body text-sm text-muted-foreground">{timeLabel}</span>
                                                    <ChevronDownIcon className={`w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform ${isDateOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pb-2">
                                                <CalendarPicker
                                                    mode="single"
                                                    selected={data.date ? new Date(data.date + 'T00:00:00') : undefined}
                                                    onSelect={d => { if (d) { setData('date', format(d, 'yyyy-MM-dd')); setIsDateOpen(false); } }}
                                                    locale={currentLanguage === 'pt_br' ? ptBR : enUS}
                                                    className="w-full"
                                                    classNames={{ root: "w-full" }}
                                                />
                                            </CollapsibleContent>
                                        </Collapsible>
                                        <Separator className="mx-4" />
                                    </>
                                )}

                                <Collapsible open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-secondary/50 transition-colors text-left">
                                            <Clock className="w-4 h-4 text-nav-icon shrink-0" />
                                            <span className="flex-1 font-body text-sm text-foreground">{__('messages.time')}</span>
                                            <span className="font-body text-sm text-muted-foreground">{data.startTime} – {data.endTime}</span>
                                            <ChevronDownIcon className={`w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform ${isTimeOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.start_time')}</p>
                                                <Input
                                                    type="time"
                                                    value={data.startTime || formatDate(range.start, "HH:mm")}
                                                    onChange={e => setData('startTime', e.target.value || formatDate(range.start, "HH:mm"))}
                                                    className="font-body h-9 text-sm scheme-dark"
                                                />
                                            </div>
                                            <div className="w-4 h-px bg-border mt-4" />
                                            <div className="flex-1">
                                                <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.end_time')}</p>
                                                <Input
                                                    type="time"
                                                    value={data.endTime || formatDate(range.end, "HH:mm")}
                                                    onChange={e => setData('endTime', e.target.value || formatDate(range.end, "HH:mm"))}
                                                    className="font-body h-9 text-sm scheme-dark"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>

                                <Separator className="mx-4" />

                                <Collapsible open={isPriorityOpen} onOpenChange={setIsPriorityOpen}>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-secondary/50 transition-colors text-left">
                                            <Tag className="w-4 h-4 text-nav-icon shrink-0" />
                                            <span className="flex-1 font-body text-sm text-foreground">{__('messages.priority')}</span>
                                            <span className="font-body text-sm text-muted-foreground">{selectedPriority?.title}</span>
                                            <ChevronDownIcon className={`w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform ${isPriorityOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 pb-4">
                                        <RadioGroup.Root value={data.priority} onValueChange={(value: string) => setPriority(value)}>
                                            <div className="flex flex-wrap gap-2">
                                                {priorities.map(priority => (
                                                    <RadioGroup.Item key={priority.id} value={priority.id}>
                                                        <RadioGroup.Indicator />
                                                        <Badge variant="outline" className={`p-4 cursor-pointer ${data.priority === priority.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-tertiary border-border/60 text-foreground hover:bg-surface-elevated'}`}>
                                                            {priority.title}
                                                        </Badge>
                                                    </RadioGroup.Item>
                                                ))}
                                            </div>
                                        </RadioGroup.Root>
                                    </CollapsibleContent>
                                </Collapsible>

                                <Separator className="mx-4" />

                                <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-secondary/50 transition-colors text-left">
                                            <Folder className="w-4 h-4 text-nav-icon shrink-0" />
                                            <span className="flex-1 font-body text-sm text-foreground">{__('messages.category')}</span>
                                            <span className="font-body text-sm text-muted-foreground">{selectedCategory?.title}</span>
                                            <ChevronDownIcon className={`w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 pb-4">
                                        <RadioGroup.Root value={data.category} onValueChange={(value: string) => setCategory(value)}>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(category => (
                                                    <RadioGroup.Item key={category.id} value={category.id}>
                                                        <RadioGroup.Indicator />
                                                        <Badge variant="outline" className={`p-4 cursor-pointer ${data.category === category.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-tertiary border-border/60 text-foreground hover:bg-surface-elevated'}`}>
                                                            {category.title}
                                                        </Badge>
                                                    </RadioGroup.Item>
                                                ))}
                                            </div>
                                        </RadioGroup.Root>
                                    </CollapsibleContent>
                                </Collapsible>

                                <Separator className="mx-4" />

                                <Collapsible open={isReminderOpen} onOpenChange={setIsReminderOpen}>
                                    <CollapsibleTrigger asChild>
                                        <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-secondary/50 transition-colors text-left">
                                            <Bell className="w-4 h-4 text-nav-icon shrink-0" />
                                            <span className="flex-1 font-body text-sm text-foreground">{__('messages.reminder')}</span>
                                            <span className="font-body text-sm text-muted-foreground">{selectedReminder?.title}</span>
                                            <ChevronDownIcon className={`w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform ${isReminderOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-4 pb-4">
                                        <RadioGroup.Root value={data.reminderInterval} onValueChange={(value: string) => setReminder(value)}>
                                            <div className="flex flex-wrap gap-2">
                                                {reminders.map(reminder => (
                                                    <RadioGroup.Item key={reminder.id} value={reminder.id}>
                                                        <RadioGroup.Indicator />
                                                        <Badge variant="outline" className={`p-4 cursor-pointer ${data.reminderInterval === reminder.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-tertiary border-border/60 text-foreground hover:bg-surface-elevated'}`}>
                                                            {reminder.title}
                                                        </Badge>
                                                    </RadioGroup.Item>
                                                ))}
                                            </div>
                                        </RadioGroup.Root>
                                    </CollapsibleContent>
                                </Collapsible>

                                {step === 'routine' && (
                                    <>
                                    <Separator className="mx-4" />
                                    <Collapsible open={isRecurrenceOpen} onOpenChange={setIsRecurrenceOpen}>
                                        <CollapsibleTrigger asChild>
                                            <button className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-surface-secondary/50 transition-colors text-left">
                                                <RefreshCw className="w-4 h-4 text-nav-icon shrink-0" />
                                                <span className="flex-1 font-body text-sm text-foreground">{__('messages.repeat')}</span>
                                                <span className="font-body text-sm text-muted-foreground">{recurrenceLabel}</span>
                                                <ChevronDownIcon className={`w-4 h-4 text-muted-foreground shrink-0 ml-1 transition-transform ${isRecurrenceOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="px-4 pb-4">
                                            <RadioGroup.Root value={data.recurrence} onValueChange={(value: string) => setRecurrence(value)} className="flex flex-wrap gap-2">
                                                {recurrenceTypes.map(recurrence => (
                                                    <RadioGroup.Item key={recurrence.id} value={recurrence.id}>
                                                        <RadioGroup.Indicator />
                                                        <Badge variant="outline" className={`p-4 cursor-pointer ${data.recurrence === recurrence.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-tertiary border-border/60 text-foreground hover:bg-surface-elevated'}`}>
                                                            {recurrence.title}
                                                        </Badge>
                                                    </RadioGroup.Item>
                                                ))}
                                            </RadioGroup.Root>
                                            {data.recurrence === 'monthly' && (
                                                <div className="mt-4">
                                                    <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.week_day')}</p>
                                                    <RadioGroup.Root value={data.monthDay?.toString()} onValueChange={(value: string) => setData('monthDay', parseInt(value))} className="flex flex-wrap gap-2 max-h-36 overflow-y-auto mt-2">
                                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                            <RadioGroup.Item key={d} value={d.toString()}>
                                                                <RadioGroup.Indicator />
                                                                <Badge variant="outline" className={`p-4 cursor-pointer ${data.monthDay === d ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-tertiary border-border/60 text-foreground hover:bg-surface-elevated'}`}>
                                                                    {d}
                                                                </Badge>
                                                            </RadioGroup.Item>
                                                        ))}
                                                    </RadioGroup.Root>
                                                </div>
                                            )}
                                            {data.recurrence === 'weekly' && (
                                                <div className="mt-4">
                                                    <p className="text-[10px] text-muted-foreground mb-1 font-body">{__('messages.week_day')}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {weekDays.map(weekDay => (
                                                            <button
                                                                key={weekDay.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    const current = data.weekDay ?? [];
                                                                    setData('weekDay', current.includes(weekDay.id)
                                                                        ? current.filter(d => d !== weekDay.id)
                                                                        : [...current, weekDay.id]
                                                                    );
                                                                }}
                                                            >
                                                                <Badge variant="outline" className={`p-4 cursor-pointer ${data.weekDay?.includes(weekDay.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-tertiary border-border/60 text-foreground hover:bg-surface-elevated'}`}>
                                                                    {weekDay.title}
                                                                </Badge>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CollapsibleContent>
                                    </Collapsible>
                                    </>
                                )}
                            </div>

                        </form>
                        <div className="flex gap-3 pb-6 mt-5">
                            <Button variant="outline" className="flex-1 h-10" onClick={() => goBack()}>
                                {__('messages.back')}
                            </Button>
                            <Button type="submit" className="flex-1 h-10 cursor-pointer" form="create-task-form" disabled={processing}>
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
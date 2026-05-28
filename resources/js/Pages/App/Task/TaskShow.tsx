import { RemembrallOrb } from "@/components/home/RemembrallOrb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkTaskIsDueSoon, checkTaskIsOverdue, formatDate } from "@/lib/utils";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { Head, router, usePage } from "@inertiajs/react";
import { Bell, BellOff, Calendar, Check, CheckCircle2, ChevronLeft, Clock, ClockAlert, Flag, Hourglass, RotateCcw, Tag, Trash2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "../../../hooks/useLang";
import AppLayout from "../../../Layouts/AppLayout";

type PageProps = {
    currentLanguage: string
}

function TaskShow({ taskRecurrence }: { taskRecurrence: TaskRecurrence }) {
    const { __ } = useLang();
    const { currentLanguage } = usePage<PageProps>().props;

    const isCompleted = taskRecurrence.completed_at !== null;
    const isOverdue = checkTaskIsOverdue(taskRecurrence.end_date);
    const isDueSoon = checkTaskIsDueSoon(taskRecurrence.end_date);
    const status = (!isCompleted && isOverdue) ? 'danger' : isDueSoon ? 'warning' : 'clear';

    function goBack() {
        window.history.back()
    }

    function markAsCompleted() {
        router.put(`/tasks/${taskRecurrence.id}/complete`, {}, {
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    function markAsPending() {
        router.put(`/tasks/${taskRecurrence.id}/pending`, {}, {
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    function deleteTask() {
        router.delete(`/tasks/${taskRecurrence.id}`, {
            onError: () => toast.error(__('messages.oops_something_went_wrong_please_try_again')),
        })
    }

    return (
        <>
            <Head title={__('messages.task_details')} />
            <div className="max-w-2xl mx-auto px-4 pt-12 pb-24">
                <div className="flex items-center gap-3 mb-6">
                    <Button size="icon" className="hover:bg-destructive/10" variant="ghost" onClick={goBack}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>

                    <h1 className="font-heading text-2xl font-bold text-foreground tracking-wide flex items-center gap-2">
                        {__('messages.task_details')}
                    </h1>
                </div>


                <div className="flex flex-col items-center justify-center gap-3 mt-6 mb-4">
                    <RemembrallOrb state={status} size={220} />
                    <span className={`text-sm font-body px-3 py-1 rounded-full border 
                    ${isCompleted ? 'bg-green-500/10 text-green-700 border-green-400/40'
                            : isOverdue ? 'bg-red-500/10 text-red-700 border-red-400/40'
                                : isDueSoon ? 'bg-amber-500/10 text-amber-700 border-amber-400/40'
                                    : 'bg-muted text-muted-foreground border-border'
                        }`}>
                        <div className="flex items-center gap-2 text-nowrap">
                            {isCompleted ? <><Check className="w-4 h-4" /> {__('messages.completed')}</>
                                : isOverdue ? <><TriangleAlert className="w-4 h-4" /> {__('messages.overdue')}</>
                                    : isDueSoon ? <><Hourglass className="w-4 h-4" /> {__('messages.due_soon')}</>
                                        : <><ClockAlert className="w-4 h-4" /> {__('messages.pending')}</>}
                        </div>
                    </span>
                </div>

                <Card className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/60">
                    <CardHeader>
                        <CardTitle className="flex space-x-3 items-center font-heading text-sm uppercase tracking-widest text-foreground">
                            {taskRecurrence.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-3">
                        <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                            {taskRecurrence.description?.trim() || '-'}
                        </p>
                        <div className="flex items-center gap-3 text-sm font-body text-foreground">
                            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span>{formatDate(taskRecurrence.start_date, "dD, d de dM de y", currentLanguage)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-body text-foreground">
                            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div>
                                <span>{formatDate(taskRecurrence.start_date, 'H:i', currentLanguage)}</span>-
                                <span>{formatDate(taskRecurrence.end_date, 'H:i', currentLanguage)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-body text-foreground">
                            <Flag className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span>{__('messages.priority')}: <span className={
                                taskRecurrence.priority === 'high' ? 'text-destructive font-semibold' :
                                    taskRecurrence.priority === 'medium' ? 'text-accent font-semibold' : 'text-muted-foreground'
                            }>{__('messages.' + taskRecurrence.priority)}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-body text-foreground">
                            <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span>{__('messages.category')}: <span className="font-semibold">{__('messages.' + taskRecurrence.category)}</span></span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-body text-foreground">
                            {taskRecurrence.reminder_at ? (
                                <><Bell className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span>{__('messages.reminder')}: <span className="font-semibold">{formatDate(taskRecurrence.reminder_at, 'H:i', currentLanguage)}</span></span></>
                            ) : (
                                <><BellOff className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">{__('messages.no_reminder')}</span></>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-3 mt-5">
                    <Button onClick={() => isCompleted ? markAsPending() : markAsCompleted()}
                        className="bg-[#6D2E32] hover:bg-[#7C373C] cursor-pointer text-[#EFD5B3] font-bold text-lg w-full h-12">
                        {isCompleted ? (
                            <><RotateCcw className="w-4 h-4" />{__('messages.mark_as_pending')}</>
                        ) : (
                            <><CheckCircle2 className="w-4 h-4" /> {__('messages.mark_as_completed')}</>
                        )}
                    </Button>
                    <Button
                        className="w-full cursor-pointer bg-[#F0E7D5] border-destructive/40 font-heading h-12 hover:bg-destructive/10"
                        variant="outline"
                        onClick={deleteTask}
                    >
                        <><Trash2 className="w-4 h-4" /> {__('messages.delete_task')}</>
                    </Button>
                </div>

            </div>
        </>
    );
}

TaskShow.layout = (page: React.ReactNode) => <AppLayout children={page} />

export default TaskShow;
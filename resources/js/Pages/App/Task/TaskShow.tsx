import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { checkTaskIsDueSoon, checkTaskIsOverdue, formatDate } from "@/lib/utils";
import { GlobalProps } from "@/types/global";
import { TaskRecurrence } from "@/types/TaskRecurrence";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Head, router, usePage } from "@inertiajs/react";
import * as Icons from "lucide-react";
import {
    Bell,
    BellOff,
    Calendar,
    Check,
    CheckSquare,
    Clock,
    Flag,
    GripVertical,
    Hourglass,
    MoreVertical,
    Plus,
    RefreshCw,
    Sparkles,
    Tag,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import type { ElementType, ReactNode } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLang } from "../../../hooks/useLang";
import AppLayout from "../../../Layouts/AppLayout";

type ChecklistItem = { id: number; description: string; completed: boolean };

function SortableChecklistItem({ item, onToggle, onDelete }: { item: ChecklistItem; onToggle: (id: number) => void; onDelete: (id: number) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

    return (
        <div
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="flex items-center gap-3 px-4 py-3">
                <button {...attributes} {...listeners} className="shrink-0 cursor-grab touch-none">
                    <GripVertical className="size-4 text-hint-foreground/50" />
                </button>
                <button
                    onClick={() => onToggle(item.id)}
                    className={`shrink-0 size-4 rounded-full border-2 flex items-center justify-center transition-colors ${item.completed ? "bg-primary border-primary" : "border-primary/60 hover:bg-primary/10"}`}
                >
                    {item.completed && <Check className="size-2.5 text-primary-foreground" strokeWidth={2.5} />}
                </button>
                <span className={`flex-1 text-sm leading-snug ${item.completed ? "line-through text-hint-foreground" : "text-label-foreground"}`}>
                    {item.description}
                </span>
                <button
                    onClick={() => onDelete(item.id)}
                    className="shrink-0 flex items-center justify-center size-7 rounded-full hover:bg-destructive/10 transition-colors"
                >
                    <Trash2 className="size-3.5 text-hint-foreground/60" />
                </button>
            </div>
            <div className="mx-4 h-px bg-border" />
        </div>
    );
}

function TaskShow({ taskRecurrence }: { taskRecurrence: TaskRecurrence }) {
    const { __ } = useLang();
    const { currentLanguage, priorities } = usePage<GlobalProps>().props;
    const dateFormat = currentLanguage === "pt_br" ? "d/m/Y" : "m/d/Y";
    const priority = priorities.find(p => p.id === taskRecurrence.priority);

    const [sheetOpen, setSheetOpen] = useState(false);
    const [deleteTaskSheetOpen, setDeleteTaskSheetOpen] = useState(false);
    const [itemDescription, setItemDescription] = useState('');
    const [items, setItems] = useState<ChecklistItem[]>(taskRecurrence.checklist_items);
    const maxLength = 100;

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

    useEffect(() => {
        setItems(taskRecurrence.checklist_items);
    }, [taskRecurrence.checklist_items]);

    const isCompleted = taskRecurrence.completed_at !== null;
    const isOverdue = !isCompleted && checkTaskIsOverdue(taskRecurrence.end_date);
    const isDueSoon = !isCompleted && !isOverdue && checkTaskIsDueSoon(taskRecurrence.end_date);
    const isRecurring = !!taskRecurrence.recurrence_type;

    const CategoryIcon = taskRecurrence.category_icon
        ? (Icons[taskRecurrence.category_icon as keyof typeof Icons] as ElementType)
        : Icons.LayoutGrid;

    const statusConfig = isCompleted
        ? { label: __("messages.completed"), icon: <Check className="size-3" />, className: "bg-emerald-950/40 border-emerald-700/30 text-emerald-400" }
        : isOverdue
            ? { label: __("messages.overdue"), icon: <TriangleAlert className="size-3" />, className: "bg-destructive/10 border-destructive/30 text-destructive" }
            : isDueSoon
                ? { label: __("messages.in_time"), icon: <Hourglass className="size-3" />, className: "bg-amber-950/40 border-amber-600/30 text-amber-400" }
                : { label: __("messages.soon"), icon: <Sparkles className="size-3" />, className: "bg-primary/10 border-primary/30 text-primary" };

    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.visit('/');
        }
    }

    function markAsCompleted() {
        router.put(`/tasks/${taskRecurrence.id}/complete`, {}, {
            onSuccess: () => toast.success(__("messages.task_updated_successfully")),
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    }

    function markAsPending() {
        router.put(`/tasks/${taskRecurrence.id}/pending`, {}, {
            onSuccess: () => toast.success(__("messages.task_updated_successfully")),
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    }

    function deleteTask() {
        router.delete(`/tasks/${taskRecurrence.id}`, {
            onSuccess: () => toast.success(__("messages.task_deleted_successfully")),
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    }

    function deleteEntireTask() {
        router.delete(`/tasks/${taskRecurrence.id}/task`, {
            onSuccess: () => toast.success(__("messages.task_deleted_successfully")),
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        setItems(reordered);
        router.put(`/tasks/${taskRecurrence.id}/checklist/reorder`, { items: reordered.map(i => i.id) }, {
            preserveScroll: true,
            onError: () => {
                setItems(taskRecurrence.checklist_items);
                toast.error(__("messages.oops_something_went_wrong_please_try_again"));
            },
        });
    }

    function handleStoreItem() {
        router.post(`/tasks/${taskRecurrence.id}/checklist`, { description: itemDescription }, {
            onSuccess: () => {
                setSheetOpen(false);
                setItemDescription('');
                toast.success(__("messages.task_updated_successfully"));
            },
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    }

    function handleToggleItem(itemId: number) {
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i));
        router.put(`/tasks/checklist/${itemId}/toggle`, {}, {
            preserveScroll: true,
            onError: () => {
                setItems(prev => prev.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i));
                toast.error(__("messages.oops_something_went_wrong_please_try_again"));
            },
        });
    }

    function handleDeleteItem(itemId: number) {
        router.delete(`/tasks/checklist/${itemId}`, {
            onSuccess: () => toast.success(__("messages.task_updated_successfully")),
            onError: () => toast.error(__("messages.oops_something_went_wrong_please_try_again")),
        });
    }

    return (
        <>
            <Head title={__("messages.task_details")} />
            <div className="px-4 pt-5 pb-24">

                <PageHeader
                    title={__("messages.task_details")}
                    onBack={goBack}
                    action={isRecurring ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center size-9 rounded-full hover:bg-nav-icon/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                                    <MoreVertical className="size-5 text-nav-icon" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onClick={() => setDeleteTaskSheetOpen(true)}
                                >
                                    {__("messages.delete_task")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : undefined}
                />

                <div className="flex items-center gap-3 rounded-2xl border border-card-border bg-card px-3 py-3">
                    <div className={`shrink-0 size-10 rounded-full flex items-center justify-center ${taskRecurrence.category_color ?? "bg-surface-tertiary"}`}>
                        <CategoryIcon className="size-4 text-white" />
                    </div>

                    <div className="flex flex-1 flex-col min-w-0 gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                            <span className="rounded-full border bg-badge-bg border-badge-border text-badge-text px-2 py-0.5 text-xs font-medium">
                                {isRecurring ? __("messages.routine_task") : __("messages.simple_task")}
                            </span>
                            <span className={`shrink-0 flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${statusConfig.className}`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                            </span>
                        </div>
                        <p className="text-sm font-semibold leading-snug text-label-foreground line-clamp-2">
                            {taskRecurrence.title}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-card-border bg-card mt-4">
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm text-hint-foreground">
                            <Calendar className="size-4 text-gold-primary" />
                            {__("messages.date")}
                        </span>
                        <span className="inline-flex items-center text-sm font-medium text-gold-primary">
                            {formatDate(taskRecurrence.start_date, dateFormat)}
                        </span>
                    </div>
                    <div className="mx-4 h-px bg-border" />

                    <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm text-hint-foreground">
                            <Clock className="size-4 text-gold-primary" />
                            {__("messages.time")}
                        </span>
                        <span className="inline-flex items-center text-sm font-medium text-gold-primary">
                            {formatDate(taskRecurrence.start_date, "H:i")} → {formatDate(taskRecurrence.end_date, "H:i")}
                        </span>
                    </div>
                    <div className="mx-4 h-px bg-border" />

                    <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm text-hint-foreground">
                            <Flag className="size-4 text-gold-primary" />
                            {__("messages.priority")}
                        </span>
                        <span className="inline-flex items-center text-sm font-medium text-label-foreground">
                            {priority
                                ? <span className={`${priority.color} rounded-full px-2 py-0.5 text-xs font-semibold`}>{priority.title}</span>
                                : "-"}
                        </span>
                    </div>
                    <div className="mx-4 h-px bg-border" />

                    <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm text-hint-foreground">
                            <Tag className="size-4 text-gold-primary" />
                            {__("messages.category")}
                        </span>
                        <span className="inline-flex items-center text-sm font-medium text-label-foreground">
                            {__("messages." + taskRecurrence.category)}
                        </span>
                    </div>
                    <div className="mx-4 h-px bg-border" />

                    <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm text-hint-foreground">
                            {taskRecurrence.reminder_at
                                ? <Bell className="size-4 text-gold-primary" />
                                : <BellOff className="size-4 text-gold-primary" />}
                            {__("messages.reminder")}
                        </span>
                        <span className="inline-flex items-center text-sm font-medium text-label-foreground">
                            {taskRecurrence.reminder_at
                                ? formatDate(taskRecurrence.reminder_at, "H:i")
                                : __("messages.no_reminder")}
                        </span>
                    </div>
                    <div className="mx-4 h-px bg-border" />

                    <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm text-hint-foreground">
                            <RefreshCw className="size-4 text-gold-primary" />
                            {__("messages.repeat")}
                        </span>
                        <span className="inline-flex items-center text-sm font-medium text-label-foreground">
                            {taskRecurrence.recurrence_type
                                ? __("messages." + taskRecurrence.recurrence_type)
                                : __("messages.not_repeat")}
                        </span>
                    </div>
                </div>

                <div className="rounded-2xl border border-card-border bg-card mt-4">
                    <div className="flex items-center justify-between px-4 py-2.5">
                        <span className="flex items-center gap-2 text-sm font-medium text-label-foreground">
                            <CheckSquare className="size-4 text-gold-primary" />
                            Checklist
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-badge-bg border border-badge-border px-2 py-0.5 text-xs font-medium text-badge-text">
                            {taskRecurrence.checklist_completed_count}/{taskRecurrence.checklist_total_count} {__("messages.checklist_items_completed")}
                        </span>
                    </div>
                    <div className="mx-4 h-px bg-border" />

                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                            {items.map((item) => (
                                <SortableChecklistItem key={item.id} item={item} onToggle={handleToggleItem} onDelete={handleDeleteItem} />
                            ))}
                        </SortableContext>
                    </DndContext>

                    <button
                        onClick={() => setSheetOpen(true)}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors rounded-b-2xl cursor-pointer"
                    >
                        <Plus className="size-4 text-gold-primary" />
                        <span className="text-sm text-hint-foreground">
                            {__("messages.add_item")}
                        </span>
                    </button>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        variant="destructive"
                        className="flex-1 h-10 cursor-pointer"
                        onClick={isRecurring ? deleteTask : deleteEntireTask}
                    >
                        <Trash2 className="size-4" />
                        {isRecurring ? __("messages.delete_occurrence") : __("messages.delete_task")}
                    </Button>
                    {!isCompleted ? (
                        <Button
                            className="flex-1 h-10 cursor-pointer"
                            onClick={markAsCompleted}
                        >
                            <Check className="size-4" />
                            {__("messages.mark_as_completed")}
                        </Button>
                    ) : (
                        <Button
                            className="flex-1 h-10 cursor-pointer btn-revert"
                            onClick={markAsPending}
                        >
                            <Icons.RotateCcw className="size-4" />
                            {__("messages.mark_as_pending")}
                        </Button>
                    )}
                </div>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetContent side="bottom" showCloseButton={false} className="rounded-t-2xl px-4 pb-8 pt-4">
                        <SheetHeader className="p-0 mb-4">
                            <SheetTitle className="text-base font-semibold text-label-foreground">
                                {__("messages.add_item")}
                            </SheetTitle>
                        </SheetHeader>

                        <div className="flex flex-col gap-1.5">
                            <Textarea
                                value={itemDescription}
                                onChange={e => setItemDescription(e.target.value)}
                                maxLength={maxLength}
                                placeholder={__("messages.description")}
                                className="resize-none min-h-20 text-sm"
                                autoFocus
                            />
                            <span className="text-right text-xs text-subtle-foreground">
                                {itemDescription.length}/{maxLength}
                            </span>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <Button
                                variant="outline"
                                className="flex-1 cursor-pointer"
                                onClick={() => { setSheetOpen(false); setItemDescription(''); }}
                            >
                                {__("messages.cancel")}
                            </Button>
                            <Button
                                className="flex-1 btn-primary cursor-pointer"
                                onClick={handleStoreItem}
                                disabled={itemDescription.trim().length === 0}
                            >
                                {__("messages.create")}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                <Sheet open={deleteTaskSheetOpen} onOpenChange={setDeleteTaskSheetOpen}>
                    <SheetContent side="bottom" showCloseButton={false} className="rounded-t-2xl px-4 pb-8 pt-4">
                        <SheetHeader className="p-0 mb-4">
                            <SheetTitle className="text-base font-semibold text-label-foreground">
                                {__("messages.delete_task")}
                            </SheetTitle>
                        </SheetHeader>

                        <p className="text-sm text-hint-foreground leading-relaxed mb-6">
                            {__("messages.delete_task_confirmation")}
                        </p>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 cursor-pointer"
                                onClick={() => setDeleteTaskSheetOpen(false)}
                            >
                                {__("messages.cancel")}
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 cursor-pointer"
                                onClick={deleteEntireTask}
                            >
                                {__("messages.confirm")}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

            </div>
        </>
    );
}

TaskShow.layout = (page: ReactNode) => <AppLayout>{page}</AppLayout>

export default TaskShow;

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, {
            month: "short",
          }),
        ...formatters,
      }}
      className={cn(
        "group/calendar relative block w-full min-w-0 bg-background p-2",
        "[--cell-radius:var(--radius-md)]",
        "[--cell-size:--spacing(9)]",
        "in-data-[slot=card-content]:bg-transparent",
        "in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      classNames={{
        root: cn(
          "relative block w-full min-w-0",
          defaultClassNames.root
        ),

        months: cn(
          "relative flex w-full min-w-0 flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),

        month: cn(
          "relative flex w-full min-w-0 flex-col gap-4",
          defaultClassNames.month
        ),

        nav: cn(
          "absolute inset-x-0 top-0 z-10 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),

        button_previous: cn(
          buttonVariants({
            variant: buttonVariant,
          }),
          "size-(--cell-size) shrink-0 p-0 select-none",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),

        button_next: cn(
          buttonVariants({
            variant: buttonVariant,
          }),
          "size-(--cell-size) shrink-0 p-0 select-none",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),

        month_caption: cn(
          "relative flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),

        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),

        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),

        dropdown: cn(
          "absolute inset-0 bg-popover opacity-0",
          defaultClassNames.dropdown
        ),

        caption_label: cn(
          "font-medium select-none",
          captionLayout === "label"
            ? "text-sm"
            : [
              "flex items-center gap-1",
              "rounded-(--cell-radius)",
              "text-sm",
              "[&>svg]:size-3.5",
              "[&>svg]:text-muted-foreground",
            ],
          defaultClassNames.caption_label
        ),

        month_grid: cn(
          "w-full table-fixed border-collapse",
          defaultClassNames.month_grid
        ),

        weekdays: cn(
          "table-row",
          defaultClassNames.weekdays
        ),

        weekday: cn(
          "h-(--cell-size) text-center align-middle",
          "text-[0.8rem] font-normal text-muted-foreground",
          "select-none",
          defaultClassNames.weekday
        ),

        weeks: cn(
          "table-row-group",
          defaultClassNames.weeks
        ),

        week: cn(
          "table-row",
          defaultClassNames.week
        ),

        week_number_header: cn(
          "h-(--cell-size) w-(--cell-size) text-center align-middle select-none",
          defaultClassNames.week_number_header
        ),

        week_number: cn(
          "h-(--cell-size) w-(--cell-size) text-center align-middle",
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),

        day: cn(
          "group/day relative h-(--cell-size) p-0.5",
          "text-center align-middle select-none",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          "[&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          defaultClassNames.day
        ),

        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-muted",
          "after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
          defaultClassNames.range_start
        ),

        range_middle: cn(
          "rounded-none",
          defaultClassNames.range_middle
        ),

        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-muted",
          "after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
          defaultClassNames.range_end
        ),

        today: cn(
          "rounded-(--cell-radius) bg-muted text-foreground",
          "data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),

        outside: cn(
          "text-muted-foreground",
          "aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),

        disabled: cn(
          "pointer-events-none text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),

        hidden: cn(
          "invisible",
          defaultClassNames.hidden
        ),

        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(
              "relative block h-auto w-full min-w-0",
              className
            )}
            {...rootProps}
          />
        ),

        Chevron: ({ className, orientation, ...chevronProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", className)}
                {...chevronProps}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...chevronProps}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={cn("size-4", className)}
              {...chevronProps}
            />
          )
        },

        DayButton: (dayButtonProps) => (
          <CalendarDayButton
            locale={locale}
            {...dayButtonProps}
          />
        ),

        WeekNumber: ({ children, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),

        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale>
}) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus()
    }
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex",
        "h-(--cell-size) w-full min-w-0",
        "items-center justify-center",
        "rounded-(--cell-radius)",
        "border-0 p-0",
        "leading-none font-normal",

        "group-data-[focused=true]/day:ring-[3px]",
        "group-data-[focused=true]/day:ring-ring/50",

        "data-[range-start=true]:rounded-l-(--cell-radius)",
        "data-[range-start=true]:bg-primary",
        "data-[range-start=true]:text-primary-foreground",

        "data-[range-middle=true]:rounded-none",
        "data-[range-middle=true]:bg-muted",
        "data-[range-middle=true]:text-foreground",

        "data-[range-end=true]:rounded-r-(--cell-radius)",
        "data-[range-end=true]:bg-primary",
        "data-[range-end=true]:text-primary-foreground",

        "data-[selected-single=true]:bg-primary",
        "data-[selected-single=true]:text-primary-foreground",

        "dark:hover:text-foreground",

        "[&>span]:text-xs",
        "[&>span]:opacity-70",

        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }

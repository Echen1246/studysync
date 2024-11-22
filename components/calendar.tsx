"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { useStudyStore } from "@/lib/store"

export function Calendar() {
  const { selectedDate, setSelectedDate, tasks } = useStudyStore()

  // Create a map of dates with tasks
  const datesWithTasks = tasks.reduce((acc, task) => {
    const dateStr = task.dueDate.toDateString()
    acc[dateStr] = (acc[dateStr] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Custom day rendering to show task indicators
  const modifiers = {
    hasTasks: (date: Date) => !!datesWithTasks[date.toDateString()],
  }

  const modifiersStyles = {
    hasTasks: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <CardTitle>Study Calendar</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          showOutsideDays={false}
          className="w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
            ),
            day_range_end: "day-range-end",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
        />
      </CardContent>
    </Card>
  )
}
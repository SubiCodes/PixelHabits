'use client'

import React, { useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Habit } from '@/store/useHabitStore'
import { DialogEditHabit } from './DialogEditHabit'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DialogDeleteHabit } from './DialogDeleteHabit'

interface CardHabitsProps {
    habit: Habit
}

function CardHabits({ habit }: CardHabitsProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false)

    // Format the date
    const formattedDate = new Date(habit.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })

    const handleDelete = () => {
        setDropdownOpen(false)
        // TODO: Implement delete functionality
        console.log('Delete habit:', habit.id)
    }

    return (
        <Card className="w-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl">{habit.title}</CardTitle>
                        <span className="text-sm text-muted-foreground">{formattedDate}</span>
                    </div>

                    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DialogEditHabit
                                habit={habit}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        <span>Edit Habit</span>
                                    </DropdownMenuItem>
                                }
                            />
                            <DialogDeleteHabit
                                habit={habit}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                        <span className="text-destructive">Delete Habit</span>
                                    </DropdownMenuItem>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {habit.description && (
                    <CardDescription className="mt-2 text-sm">
                        {habit.description}
                    </CardDescription>
                )}
            </CardHeader>
        </Card>
    )
}

export default CardHabits


import { useState } from "react";
import { Calendar } from "lucide-react"

export default function DatePicker({ value, onChange, placeholder }: { value: string, onChange: (date: string) => void, placeholder: string }) {
    const [showCalendar, setShowCalendar] = useState(false)

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-')
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
        setShowCalendar(false)
    }

    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={formatDate(value)}
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full pl-4 pr-10 py-3 border border-border rounded-3xl bg-background text-desc placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            />
            <Calendar
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-desc w-6 h-6 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
            />
            {showCalendar && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-border rounded-lg shadow-lg p-2">
                    <input
                        type="date"
                        value={value}
                        onChange={handleDateChange}
                        className="border border-border rounded p-2"
                        autoFocus
                    />
                </div>
            )}
        </div>
    )
}
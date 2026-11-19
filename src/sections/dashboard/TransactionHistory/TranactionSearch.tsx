import {Search} from "lucide-react"

interface TransactionSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TransactionSearch({ searchQuery, onSearchChange }: TransactionSearchProps) {
  return (
    <div className="relative flex gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9A9A9A" }} />
        <input
          type="text"
          placeholder="Search by ref or crypto..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl focus:outline-none"
          style={{
            background: "#FFFFFF",
            border: "1px solid #ECECEC",
            color: "#0E0F0C",
          }}
        />
      </div>
    </div>
  )
}

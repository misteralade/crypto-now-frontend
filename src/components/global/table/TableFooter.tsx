import type { ChangeEvent } from 'react'

interface TableFooterProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  maxVisible?: number;
}

const TableFooter = ({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange, maxVisible = 10 }: TableFooterProps) => {
  const getVisiblePages = () => {
    const pages = []

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage)
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value === 'all' ? totalItems : Number(e.target.value)
    onPageSizeChange(newSize)
    onPageChange(1) // Reset to first page when page size changes
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between w-full mt-4">
      {/* Left side - Items per page selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#667085]">Show</span>
        <select
          value={pageSize === totalItems ? 'all' : pageSize}
          onChange={handlePageSizeChange}
          className="px-3 py-2 border border-[#ECECEC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#03034D] cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value="all">All</option>
        </select>
        <span className="text-sm text-[#667085]">
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      {/* Right side - Pagination controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
            currentPage === 1
              ? 'text-[#CCCCCC] cursor-not-allowed'
              : 'text-black hover:text-[#03034D]'
          } hover:cursor-pointer`}
        >
          Prev
        </button>

        <div className="flex items-center gap-2">
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span key={`${index}-${page}`} className="px-2 text-[#CCCCCC]">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#03034D] text-white'
                    : 'border border-[#ECECEC] text-[#667085] hover:border-[#03034D]'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
            currentPage === totalPages
              ? 'text-[#CCCCCC] cursor-not-allowed'
              : 'text-black hover:text-[#03034D]'
          } hover:cursor-pointer`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default TableFooter;
export default function TransactionPagination({
                                   currentPage,
                                   totalPages,
                                   onPageChange
                               }: {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
}) {
    const getVisiblePages = () => {
        const pages = []
        const maxVisible = 5

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

    return (
        <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                        currentPage === 1
                            ? 'text-[#CCCCCC] cursor-not-allowed'
                            : 'text-black'
                    }`}
                >
                    Prev
                </button>

                <div className="flex items-center gap-2">
                    {getVisiblePages().map((page, index) => (
                        page === '...' ? (
                            <span key={index} className="px-2 text-muted-foreground">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                                    currentPage === page
                                        ? 'bg-accent2 text-white'
                                        : 'border border-border text-placeholder'
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
                            : 'text-black'
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
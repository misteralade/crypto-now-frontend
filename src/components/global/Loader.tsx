export default function CustomLoader  () {
    return(
        <div className="relative w-10 h-10">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div
                className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
        </div>
    )
}
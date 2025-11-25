import {ArrowUpFromLine, ChevronDown, ChevronUp} from "lucide-react";
import {useState} from "react";

const ExportTransaction = () => {
    const [showDropdown, setShowDropdown] = useState(false)

    const handleDropdown = () => {
        setShowDropdown(!showDropdown)
    }

    return(
        <div className={`rounded-3xl bg-primary p-3 flex gap-2 items-center cursor-pointer relative w-1/2 md:w-auto`} onClick={handleDropdown}>
            <div className={`flex gap-2 items-center`}>
                <ArrowUpFromLine className={`text-white w-5 h-5`} />
                <p className={`text-white text-sm font-semibold`}>Export</p>
            </div>

            <div className={`w-[1px] h-5 bg-white/20`}></div>

            {showDropdown ? <ChevronUp className={`text-white w-5 h-5`} />:   <ChevronDown className={`text-white w-5 h-5`} />}

            {showDropdown &&
                <div className={`absolute top-14 right-0 border border-greyBg rounded-2xl py-5 px-10 space-y-3 bg-white min-w-[200px] shadow-lg z-1`}>
                    <button className={`text-primary cursor-pointer text-lg block`}>Export as CSV</button>
                    <button className={`text-primary cursor-pointer text-lg block`}>Export as PDF</button>
                 </div>
            }

        </div>
    )
}

export default ExportTransaction;
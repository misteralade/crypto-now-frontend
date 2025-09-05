import Copy from "../../assets/icons/fluent_copy-16-regular.svg"
import {useState} from "react";

interface CopyAccountDetails {
    accountNumber: string;
}

export default function CopyAccountDetails({accountNumber}: CopyAccountDetails) {
    const [response, setResponse] = useState<string>("");
    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber)
            .then(() => {
                setResponse("Copied!");

                setTimeout(() => setResponse(""), 2000);
            })
            .catch(err => {
                setResponse(`Error!: ${err}`);
            });
    };
    return(
            <div className={`flex gap-2 items-center relative`}>
                <p>{accountNumber}</p>

                <img src={Copy} alt="copy" onClick={handleCopy} className={`cursor-pointer`} />

                <p className={`text-accent2 text-sm absolute -top-5 right-0 transition-all duration-500`}>{response}</p>
            </div>
    )
}
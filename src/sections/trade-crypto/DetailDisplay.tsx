interface DetailDisplayProp{
    title: string;
    value: string | number;
}

export default function DetailDisplay({title, value}: DetailDisplayProp){
    return(
        <div className="flex justify-between items-center gap-20">
            <span className="text-grey3 font-medium capitalize">{title}</span>
            <span className="font-medium text-black overflow-hidden whitespace-nowrap text-ellipsis">{value}</span>
        </div>
    )
}
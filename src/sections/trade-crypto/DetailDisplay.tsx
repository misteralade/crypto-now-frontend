interface DetailDisplayProp{
    title: string;
    value: string | number;
}

export default function DetailDisplay({title, value}: DetailDisplayProp){
    return(
        <div className="flex justify-between items-center gap-20">
            <span className="text-grey3 font-medium capitalize">{title}</span>
            <span className="font-medium">{value}</span>
        </div>
    )
}
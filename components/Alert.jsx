const Alert = ({text,type}) => {
    return (
        <div className="absolute top-10 left-0 right-0
        flex items-center justify-center">
            <div className={`p-2 text-indigo-100 leading-none 
                lg:rounded-full flex lg:inline-flex items-center
                ${type === "Success" ? "bg-green-800" : "bg-red-800"}`} 
                role="alert">
                <p className={`${type === "Success" ? "bg-green-500" : "bg-red-500"}
                flex rounded-full uppercase px-2 py-1 font-semibold mr-3 text-xs
                `}>{type === "Success" ? "Success!" : "Error!"}</p>
                <p className="mr-2 text-left">{text}</p>
            </div>
        </div>
    );
}

export default Alert;

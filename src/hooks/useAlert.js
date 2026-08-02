import {useState} from "react";

const useAlert = () => {
    const [alert, setAlert] = useState({show: false, text: "", type: "Danger"});

    const showAlert = ({text, type = 'Danger'}) => 
        setAlert({show: true, text, type});
    const hideAlert = () => 
        setAlert({show: false, text: "", type: "Danger"});
    return{
        alert,
        showAlert,
        hideAlert
    }
}

export {useAlert};
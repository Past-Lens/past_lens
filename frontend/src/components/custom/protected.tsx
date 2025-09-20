import { useAuth } from "@/context/authcontext"
import {useEffect, type ReactElement} from "react"
import { useNavigate } from "react-router-dom"

function Protected({children} : {children: ReactElement }) {
    const {isAuthenticated, setState} = useAuth()
    const navigate = useNavigate();
    const loggedInState = localStorage.getItem("isAuthenticated")
    useEffect(()=>{
        if(!isAuthenticated || !setState(loggedInState!)) navigate("/")
    }, [isAuthenticated, loggedInState])

    return (
        <>{children}</>
    )
}

export default Protected
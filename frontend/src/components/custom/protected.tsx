import { useAuth } from "@/context/authcontext"
import {useEffect, type ReactElement} from "react"
import { useNavigate } from "react-router-dom"

function Protected({children} : {children: ReactElement }) {
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate();
    useEffect(()=>{
        if(!isAuthenticated) navigate("/")
    }, [isAuthenticated])
    return (
        <>{children}</>
    )
}

export default Protected
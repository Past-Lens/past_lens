import { useAuth } from "@/context/authcontext"
import type {ReactElement} from "react"
import { useNavigate } from "react-router-dom"

function Protected({children} : {children: ReactElement }) {
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate();
    if(!isAuthenticated) navigate("/")
    return (
        <>{children}</>
    )
}

export default Protected

import { createContext, useState, useContext, type ReactNode } from "react";

type SidebarCTX = {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const sideBarContext = createContext<SidebarCTX | undefined>(undefined);

export const SideBarToogleProvider = ({children} : {children : ReactNode}) => {
    const [isOpen, setIsOpen] = useState(
        localStorage.getItem("isOpen") === "true"
    );

    const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
        setIsOpen((prev) => {
            const newValue = typeof value === "function" ? value(prev) : value;
            localStorage.setItem("isOpen", String(newValue));
            return newValue;
        });
    };
    
    return (
        <sideBarContext.Provider value={{isOpen, setOpen}}>
            {children}
        </sideBarContext.Provider>
    )
}

export const useBar = () : SidebarCTX => {
    const barContext = useContext(sideBarContext);
    if (!barContext) {
        throw new Error("useBar must be used within the SideBarToogleProvider");
    }
    return barContext
}
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProfileHeader({
    username = 'EA',
}: {
    username?: string;
}) {
    const initials = username
        .split('')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <header className="w-[100%] flex items-center p-4 justify-between bg-slate-800 border-b sticky top-0">
            <div className="inline-flex gap-4">
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 rounded-full bg-[#eeeff1] flex items-center justify-center shadow"
                >
                    <a href="/">
                        <img src="/PLTransparent.png" alt="PL" />
                    </a>
                </motion.div>
                <span className="text-3xl font-extrabold tracking-tight text-[#eeeff1]">
                    Past Lens
                </span>
            </div>
            <nav className="flex items-center gap-4 text-white">
                <Link to="/contribute">
                    <Button variant="ghost" className="text-lg cursor-pointer">
                        Contribute
                    </Button>
                </Link>
                <Link to="/museum">
                    <Button variant="ghost" className="text-lg cursor-pointer">
                        Museum
                    </Button>
                </Link>
            </nav>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 focus:outline-none cursor-pointer">
                        <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to="/logout">Sign Out</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

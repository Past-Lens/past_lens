import {
    ChevronDown,
    ChevronUp,
    HomeIcon,
    LogOut,
    Settings,
    User2,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '../ui/sidebar';
import paths from '@/utils/sideBarPaths';
import { contributionData } from '@/utils/chartdata';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/authcontext';
import { useTheme } from '@/context/themecontext';

const pendingCount = contributionData.filter(
    (c) => c.status === 'pending'
).length;

function Appsidebar() {
    const { pathname: currentPath } = useLocation();
    const { logout } = useAuth();
    const { themeColors } = useTheme();

    return (
        <>
            <Sidebar
                collapsible="icon"
                className="max-w-[15rem]"
                style={{
                    background: themeColors.background,
                    color: themeColors.text,
                    borderRight: `1px solid ${themeColors.border}`,
                }}
            >
                <SidebarHeader className="p-1">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        style={{
                                            background: 'transparent',
                                            color: themeColors.text,
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src="./PLlogo.jpg"
                                                alt="PastLens Logo"
                                                width={40}
                                                height={20}
                                                className="rounded-full ml-[-"
                                            />
                                            <span className="font-semibold text-[1rem]">
                                                PastLens
                                            </span>
                                        </div>
                                        <ChevronDown className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-popper-anchor-width] ml-auto"
                                    side="bottom"
                                    align="end"
                                >
                                    <DropdownMenuItem>
                                        <SidebarMenuButton asChild>
                                            <a href="/">
                                                <HomeIcon />
                                                <span>Go to Home</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarSeparator
                    className="max-w-[90%]"
                    style={{ background: themeColors.border }}
                />
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel style={{ color: themeColors.text }}>
                            Admin Dashboard
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="gap-3">
                                {paths.map((path) => {
                                    const isSelected = currentPath === path.url;
                                    const isDefaultTheme =
                                        themeColors.primary === '#64748b';
                                    let selectedBg =
                                        themeColors.hover ||
                                        themeColors.primary;
                                    if (
                                        isSelected &&
                                        themeColors.primary === '#b83260'
                                    ) {
                                        selectedBg = '#fbb6ce'; // rose-300
                                    } else if (isSelected && isDefaultTheme) {
                                        selectedBg = '#cbd5e1'; // slate-300
                                    }
                                    const showBadge =
                                        path.title === 'Contributions' &&
                                        pendingCount > 0;
                                    return (
                                        <SidebarMenuItem
                                            key={path.title}
                                            className={cn(
                                                'rounded-sm py-2 min-w-8 relative',
                                                isSelected ? 'font-bold' : ''
                                            )}
                                            style={{
                                                background: isSelected
                                                    ? selectedBg
                                                    : themeColors.cardBg ||
                                                      themeColors.cardBackground,
                                                color: themeColors.text,
                                                border: `1px solid ${themeColors.border}`,
                                            }}
                                        >
                                            <SidebarMenuButton
                                                asChild
                                                style={{
                                                    color: themeColors.text,
                                                }}
                                            >
                                                <NavLink
                                                    to={path.url}
                                                    className="font-semibold text-[1rem] tracking-wide flex items-center gap-2"
                                                    style={{
                                                        color: themeColors.text,
                                                    }}
                                                >
                                                    <path.icon />
                                                    <span>{path.title}</span>
                                                    {showBadge && (
                                                        <span
                                                            className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white min-w-[1.5em]"
                                                            style={{
                                                                background:
                                                                    themeColors.primary ===
                                                                    '#b83260'
                                                                        ? '#b83260'
                                                                        : themeColors.primary,
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            {pendingCount}
                                                        </span>
                                                    )}
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        style={{ color: themeColors.text }}
                                    >
                                        <User2 /> EdenAdmin
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    align="end"
                                    className="w-max"
                                >
                                    <DropdownMenuItem>
                                        <NavLink
                                            to={'/admin/settings'}
                                            className="flex gap-4"
                                            style={{ color: themeColors.text }}
                                        >
                                            <Settings />
                                            <span>Account Settings</span>
                                        </NavLink>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => logout()}
                                            style={{ color: themeColors.text }}
                                        >
                                            <LogOut />
                                            <span>Sign out</span>
                                        </SidebarMenuButton>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}

export default Appsidebar;

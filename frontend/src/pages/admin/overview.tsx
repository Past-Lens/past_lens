
import { useState } from "react";
import BarChartInteractive from "@/components/custom/charts/barChart";
import {ChartAreaInteractive} from "@/components/custom/charts/lineChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { users } from "@/utils/usersData";

export default function Overview() {
    const [userType, setUserType] = useState<'all' | 'user' | 'admin'>('all');
    const filteredUsers = userType === 'all' ? users : users.filter(u => u.role === userType);
    const totalContributions = users.reduce((sum, u) => sum + u.contributionsCount, 0);
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalRegularUsers = users.filter(u => u.role === 'user').length;

    return (
        <div className="grid lg:grid-cols-2 bg-slate-800 w-full min-h-screen gap-4 p-4">
            {/* Charts */}
            <ChartAreaInteractive />
            <BarChartInteractive />

            {/* Total Users Card */}
            <Card className="col-span-1">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Total Users</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="px-3 py-1 rounded bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition cursor-pointer">
                                {userType === 'all' ? 'All' : userType === 'admin' ? 'Admins' : 'Users'} ▼
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setUserType('all')} className="cursor-pointer">All ({totalUsers})</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserType('user')} className="cursor-pointer">Users ({totalRegularUsers})</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUserType('admin')} className="cursor-pointer">Admins ({totalAdmins})</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold mb-2">{filteredUsers.length}</div>
                    <div className="text-muted-foreground text-sm mb-4">
                        {userType === 'all' ? 'Total registered users' : userType === 'admin' ? 'Total admins' : 'Total users'}
                    </div>
                    <div className="overflow-x-auto max-h-56 border rounded bg-white/80 dark:bg-slate-900/60">
                        <table className="min-w-full text-left text-xs">
                            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 z-10">
                                <tr>
                                    <th className="px-3 py-2 font-semibold">Full Name</th>
                                    <th className="px-3 py-2 font-semibold">Role</th>
                                    <th className="px-3 py-2 font-semibold">Contributions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.fullName} className="even:bg-slate-50 dark:even:bg-slate-800/40">
                                        <td className="px-3 py-2 whitespace-nowrap">{user.fullName}</td>
                                        <td className="px-3 py-2 capitalize">{user.role}</td>
                                        <td className="px-3 py-2 text-center">{user.contributionsCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Total Contributions Card */}
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Total Contributions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold mb-2">{totalContributions}</div>
                    <div className="text-muted-foreground text-sm">Contributions made by all users</div>
                </CardContent>
            </Card>
        </div>
    );
}
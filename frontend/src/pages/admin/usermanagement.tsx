
import { useState } from "react";
import { useSearch } from "@/context/searchcontext";
import { users } from "@/utils/usersData";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const USERS_PER_PAGE = 10;

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const { query } = useSearch();
  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()) ||
    u.username.toLowerCase().includes(query.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex gap-6 h-full p-6 flex-1">
      {/* User List */}
      <Card className="w-1/2 min-w-[320px] max-w-lg flex-1">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <div className="flex flex-col gap-2 px-6">
          {paginatedUsers.map((user) => (
            <div
              key={user.username}
              className={`flex items-center gap-4 p-3 rounded cursor-pointer transition-colors ${selectedUser.username === user.username ? 'bg-accent' : 'hover:bg-muted'}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <span className="ml-auto text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground capitalize">{user.role}</span>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4">
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      </Card>

      {/* User Detail */}
      <Card className="w-1/2 min-w-[320px] max-w-lg flex-1">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        {selectedUser ? (
          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-3xl">
              {selectedUser.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{selectedUser.fullName}</div>
              <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
              <div className="text-xs text-muted-foreground">@{selectedUser.username}</div>
              <div className="mt-2 text-sm"><span className="font-medium">Role:</span> {selectedUser.role}</div>
              <div className="text-sm"><span className="font-medium">Contributions:</span> {selectedUser.contributionsCount}</div>
            </div>
            <Button className="mt-4 w-full" onClick={() => window.location.href = `/admin/contributions?user=${selectedUser.username}`}>See Contributions</Button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">Select a user to view details</div>
        )}
      </Card>
    </div>
    </div>
  );
}
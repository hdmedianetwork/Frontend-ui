import React, { useState } from "react";
import { UserActionCard } from "../../../ui/UserActionCard";

export const Permission = () => {
  // Sample user data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      joinDate: "Jan 2024",
      Subscription: "Premium",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      phone: "+1 (555) 987-6543",
      location: "Los Angeles, USA",
      joinDate: "Mar 2024",
      Subscription: "Basic",
    },
  ]);

  // Handle deleting a user
  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  // Handle changing user role
  const handleRoleChange = (userId, newRole) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };
  // Handle changing user role
  const handleSubChange = (userId, newSub) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, Subscription: newSub } : user
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Permissions</h2>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserActionCard
            key={user.id}
            user={user}
            onDelete={handleDeleteUser}
            onRoleChange={handleRoleChange}
            onSubChange={handleSubChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Permission;

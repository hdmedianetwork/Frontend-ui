import { UserInfoCard } from "../../../ui/UserInfoCard";

export const Info = () => {
  // Sample user data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      phone: "+1 (555) 123-4567",
      location: "New York, USA",
      joinDate: "Jan 2024",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      phone: "+1 (555) 987-6543",
      location: "Los Angeles, USA",
      joinDate: "Mar 2024",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "user",
      phone: "+1 (555) 456-7890",
      location: "Chicago, USA",
      joinDate: "Feb 2024",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Information</h2>
        <p className="text-gray-600">Manage and view all user accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserInfoCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Info;

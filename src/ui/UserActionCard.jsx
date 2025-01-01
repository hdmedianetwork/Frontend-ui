import React, { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  Phone,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  Package,
} from "lucide-react";

export const UserActionCard = ({
  user,
  onDelete,
  onRoleChange,
  onSubChange,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  const [isEditingSub, setIsEditingSub] = useState(false);
  const [selectedSub, setSelectedSub] = useState(user.Subscription);

  const roles = ["user", "admin", "editor"];
  const subscriptions = ["Basic", "Premium", "VIP"];

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDelete(user.id);
    }
  };

  const handleRoleChange = (e) => {
    e.stopPropagation();
    setSelectedRole(e.target.value);
  };

  const saveRoleChange = (e) => {
    e.stopPropagation();
    onRoleChange(user.id, selectedRole);
    setIsEditingRole(false);
  };

  const handleSubChange = (e) => {
    e.stopPropagation();
    setSelectedSub(e.target.value);
  };

  const saveSubChange = (e) => {
    e.stopPropagation();
    onSubChange(user.id, selectedSub); // Use onSubChange instead of onRoleChange for subscription
    setIsEditingSub(false);
  };

  const ActionButton = ({ icon: Icon, onClick, color }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${color}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <div className="flex items-center gap-2">
            {isEditingRole ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  className="text-sm border rounded p-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ActionButton
                  icon={Check}
                  onClick={saveRoleChange}
                  color="text-green-600"
                />
                <ActionButton
                  icon={X}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingRole(false);
                    setSelectedRole(user.role);
                  }}
                  color="text-red-600"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{user.role}</span>
                {user.role === "admin" && (
                  <Shield className="h-4 w-4 text-blue-600" />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border py-2 z-10 w-36">
              <button
                onClick={() => {
                  setIsEditingRole(true);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Role
              </button>
              <button
                onClick={() => {
                  setIsEditingSub(true);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Subscription
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="h-4 w-4" />
          <span className="text-sm">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{user.phone}</span>
          </div>
        )}
        {user.location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{user.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Joined {user.joinDate}</span>
        </div>

        {isEditingSub ? (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-600" />{" "}
            <select
              value={selectedSub}
              onChange={handleSubChange}
              className="text-sm border rounded p-1"
              onClick={(e) => e.stopPropagation()}
            >
              {subscriptions.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            <ActionButton
              icon={Check}
              onClick={saveSubChange}
              color="text-green-600"
            />
            <ActionButton
              icon={X}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingSub(false);
                setSelectedSub(user.Subscription);
              }}
              color="text-red-600"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-4 w-4 text-gray-600" />{" "}
            <span className="text-sm">{user.Subscription}</span>
          </div>
        )}
      </div>
    </div>
  );
};

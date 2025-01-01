import React from "react";
import { User, Mail, Shield, Calendar, MapPin, Phone } from "lucide-react";
import Card from "./Card";

export const UserInfoCard = ({ user, onCardClick }) => {
  return (
    <Card
      title={
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          {user.role === "admin" && (
            <Shield className="h-5 w-5 text-blue-600" />
          )}
        </div>
      }
      onClick={() => onCardClick?.(user)}
      className="transition-all duration-200 hover:shadow-xl"
    >
      <div className="space-y-3">
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
      </div>
    </Card>
  );
};

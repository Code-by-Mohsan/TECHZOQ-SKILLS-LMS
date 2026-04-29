"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { KeyRound, Shield, Users } from "lucide-react";

interface RoleItem {
  _id: string;
  key: string;
  name: string;
  description: string;
  permissionIds: string[];
  assignedUsers: number;
}

interface PermissionItem {
  _id: string;
  key: string;
  name: string;
  module: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  roleIds: string[];
}

export default function AccessControlPage() {
  const router = useRouter();
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRole, setSavingRole] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [search, setSearch] = useState("");

  const fetchSummary = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/rbac/summary?${params}`);
      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || "Failed to load RBAC data");
        return;
      }
      setRoles(json.data.roles || []);
      setPermissions(json.data.permissions || []);
      setUsers(json.data.users || []);
    } catch {
      toast.error("Failed to load RBAC data");
    } finally {
      setLoading(false);
    }
  }, [router, search]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (!selectedRoleId && roles.length > 0) setSelectedRoleId(roles[0]._id);
  }, [roles, selectedRoleId]);

  useEffect(() => {
    if (!selectedUserId && users.length > 0) setSelectedUserId(users[0]._id);
  }, [users, selectedUserId]);

  const selectedRole = useMemo(
    () => roles.find((role) => role._id === selectedRoleId) || null,
    [roles, selectedRoleId],
  );

  const selectedUser = useMemo(
    () => users.find((user) => user._id === selectedUserId) || null,
    [users, selectedUserId],
  );

  const toggleRolePermission = (permissionId: string) => {
    if (!selectedRole) return;
    const hasPermission = selectedRole.permissionIds.includes(permissionId);
    setRoles((prev) =>
      prev.map((role) => {
        if (role._id !== selectedRole._id) return role;
        return {
          ...role,
          permissionIds: hasPermission
            ? role.permissionIds.filter((id) => id !== permissionId)
            : [...role.permissionIds, permissionId],
        };
      }),
    );
  };

  const saveRolePermissions = async () => {
    if (!selectedRole) return;
    setSavingRole(true);
    try {
      const res = await fetch(`/api/admin/rbac/roles/${selectedRole._id}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissionIds: selectedRole.permissionIds }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to update role permissions");
        return;
      }
      toast.success("Role permissions updated");
      fetchSummary();
    } catch {
      toast.error("Failed to update role permissions");
    } finally {
      setSavingRole(false);
    }
  };

  const toggleUserRole = (roleId: string) => {
    if (!selectedUser) return;
    const hasRole = selectedUser.roleIds.includes(roleId);
    setUsers((prev) =>
      prev.map((user) => {
        if (user._id !== selectedUser._id) return user;
        return {
          ...user,
          roleIds: hasRole
            ? user.roleIds.filter((id) => id !== roleId)
            : [...user.roleIds, roleId],
        };
      }),
    );
  };

  const saveUserRoles = async () => {
    if (!selectedUser) return;
    setSavingUser(true);
    try {
      const res = await fetch(`/api/admin/rbac/users/${selectedUser._id}/roles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleIds: selectedUser.roleIds }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to update user roles");
        return;
      }
      toast.success("User roles updated");
      fetchSummary();
    } catch {
      toast.error("Failed to update user roles");
    } finally {
      setSavingUser(false);
    }
  };

  const bootstrapRbac = async () => {
    try {
      const res = await fetch("/api/admin/rbac/bootstrap", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to bootstrap RBAC");
        return;
      }
      toast.success("RBAC defaults seeded");
      fetchSummary();
    } catch {
      toast.error("Failed to bootstrap RBAC");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-sm text-gray-500">Loading access control...</div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          <p className="text-sm text-gray-500 mt-1">Manage roles, permissions, and user assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
          />
          <button
            type="button"
            onClick={fetchSummary}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={bootstrapRbac}
            className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Seed Defaults
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <Shield className="w-4 h-4" />
            Roles
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {roles.map((role) => (
              <button
                key={role._id}
                type="button"
                onClick={() => setSelectedRoleId(role._id)}
                className={`w-full text-left p-3 rounded-lg border ${
                  selectedRoleId === role._id
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">{role.name}</p>
                <p className="text-xs text-gray-500">{role.key}</p>
                <p className="text-xs text-gray-500 mt-1">{role.assignedUsers} assigned users</p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <KeyRound className="w-4 h-4" />
            Permissions {selectedRole ? `for ${selectedRole.name}` : ""}
          </div>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {permissions.map((permission) => {
              const checked = selectedRole?.permissionIds.includes(permission._id) || false;
              return (
                <label key={permission._id} className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRolePermission(permission._id)}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{permission.name}</p>
                    <p className="text-xs text-gray-500">{permission.key}</p>
                  </div>
                </label>
              );
            })}
          </div>
          <button
            type="button"
            onClick={saveRolePermissions}
            disabled={!selectedRole || savingRole}
            className="mt-4 w-full px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            {savingRole ? "Saving..." : "Save Role Permissions"}
          </button>
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
            <Users className="w-4 h-4" />
            User Role Assignment
          </div>
          <select
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-3"
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {roles.map((role) => {
              const checked = selectedUser?.roleIds.includes(role._id) || false;
              return (
                <label key={role._id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleUserRole(role._id)}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{role.name}</p>
                    <p className="text-xs text-gray-500">{role.key}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={saveUserRoles}
            disabled={!selectedUser || savingUser}
            className="mt-4 w-full px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
          >
            {savingUser ? "Saving..." : "Save User Roles"}
          </button>
        </section>
      </div>
    </div>
  );
}

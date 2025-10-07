import { create } from 'zustand';
import type { ManagedUser, ManagedUserStatus, RoleDefinition, SettingsState } from '@types/index';
import { mockManagedUsers, mockRoles } from '@mocks/settings';

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

interface CreateRoleInput {
  name: string;
  description: string;
  permissions: string[];
}

interface UpdateRoleInput extends Partial<Omit<RoleDefinition, 'id'>> {}

interface CreateUserInput {
  fullName: string;
  email: string;
  username?: string;
  roleId?: string;
  status?: ManagedUserStatus;
  phone?: string;
  department?: string;
}

interface UpdateUserInput {
  fullName?: string;
  email?: string;
  username?: string;
  roleId?: string;
  status?: ManagedUserStatus;
  phone?: string;
  department?: string;
  requirePasswordReset?: boolean;
  password?: string;
}

interface SettingsActions {
  createRole: (payload: CreateRoleInput) => RoleDefinition;
  updateRole: (roleId: string, payload: UpdateRoleInput) => void;
  deleteRole: (roleId: string) => void;
  createUser: (payload: CreateUserInput) => ManagedUser;
  updateUser: (userId: string, payload: UpdateUserInput) => void;
  deleteUser: (userId: string) => void;
  resetUserPassword: (userId: string) => string;
}

const getFallbackRoleId = (roles: RoleDefinition[], removedRoleId?: string) => {
  const preferred = roles.find((role) => role.isDefault && role.id !== removedRoleId);
  if (preferred) {
    return preferred.id;
  }
  const firstAvailable = roles.find((role) => role.id !== removedRoleId);
  return firstAvailable?.id;
};

export const useSettingsStore = create<SettingsState & SettingsActions>((set, get) => ({
  roles: mockRoles,
  users: mockManagedUsers,
  createRole: (payload) => {
    const role: RoleDefinition = {
      id: generateId('role'),
      ...payload
    };
    set((state) => ({ roles: [...state.roles, role] }));
    return role;
  },
  updateRole: (roleId, payload) =>
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              ...payload,
              permissions: payload.permissions ?? role.permissions
            }
          : role
      )
    })),
  deleteRole: (roleId) =>
    set((state) => {
      const role = state.roles.find((item) => item.id === roleId);
      if (!role || role.isSystem) {
        return state;
      }
      const remainingRoles = state.roles.filter((item) => item.id !== roleId);
      const fallbackRoleId = getFallbackRoleId(remainingRoles, roleId);
      return {
        roles: remainingRoles,
        users: fallbackRoleId
          ? state.users.map((user) =>
              user.roleId === roleId
                ? {
                    ...user,
                    roleId: fallbackRoleId,
                    requirePasswordReset: true
                  }
                : user
            )
          : state.users
      };
    }),
  createUser: (payload) => {
    const state = get();
    const fallbackRoleId = payload.roleId ?? getFallbackRoleId(state.roles);
    if (!fallbackRoleId) {
      throw new Error('Не найдена роль для назначения пользователя');
    }
    const now = new Date().toISOString();
    const user: ManagedUser = {
      id: generateId('user'),
      fullName: payload.fullName,
      email: payload.email,
      username: payload.username ?? payload.email,
      roleId: fallbackRoleId,
      status: payload.status ?? 'pending',
      phone: payload.phone,
      department: payload.department,
      lastLoginAt: null,
      createdAt: now,
      passwordUpdatedAt: now,
      requirePasswordReset: true,
      temporaryPassword: 'Пароль будет задан при первом входе'
    };
    set((state) => ({ users: [user, ...state.users] }));
    return user;
  },
  updateUser: (userId, payload) =>
    set((state) => ({
      users: state.users.map((user) => {
        if (user.id !== userId) {
          return user;
        }
        const { password, ...rest } = payload;
        const updated: ManagedUser = {
          ...user,
          ...rest
        };
        if (password) {
          updated.temporaryPassword = password;
          updated.passwordUpdatedAt = new Date().toISOString();
          updated.requirePasswordReset = true;
        }
        return updated;
      })
    })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId)
    })),
  resetUserPassword: (userId) => {
    const tempPassword = `Pwd-${Math.random().toString(36).slice(2, 8)}-${Math.random()
      .toString(36)
      .slice(2, 4)}`;
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId
          ? {
              ...user,
              temporaryPassword: tempPassword,
              passwordUpdatedAt: new Date().toISOString(),
              requirePasswordReset: true
            }
          : user
      )
    }));
    return tempPassword;
  }
}));

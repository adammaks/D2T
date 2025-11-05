import { User, UserRole } from '../types';

const STORAGE_KEY_USERS = 'tournament_users';
const STORAGE_KEY_CURRENT_USER = 'tournament_current_user';

// Инициализация начального админа
export const initializeDefaultAdmin = (): User => {
  const defaultAdmin: User = {
    id: 'admin-1',
    username: 'admin',
    password: 'admin',
    role: UserRole.ADMIN,
  };
  return defaultAdmin;
};

// Загрузка пользователей из localStorage
export const loadUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEY_USERS);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Если пользователей нет, создаем начального админа
  const defaultAdmin = initializeDefaultAdmin();
  const users = [defaultAdmin];
  saveUsers(users);
  return users;
};

// Сохранение пользователей в localStorage
export const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

// Загрузка текущего пользователя
export const loadCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
  return stored ? JSON.parse(stored) : null;
};

// Сохранение текущего пользователя
export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
};

// Проверка, является ли пользователь модератором или админом
export const isModeratorOrAdmin = (user: User | null): boolean => {
  return user !== null && (user.role === UserRole.MODERATOR || user.role === UserRole.ADMIN);
};

// Проверка, является ли пользователь админом
export const isAdmin = (user: User | null): boolean => {
  return user !== null && user.role === UserRole.ADMIN;
};

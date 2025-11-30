import { createId } from "../utils/id";

const KEY = "users_db";

export const loadUsers = () => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveUsers = (users) => {
  localStorage.setItem(KEY, JSON.stringify(users));
};

export const getUserById = (id) => {
  const users = loadUsers();
  return users.find((u) => u.id === id) || null;
};

export const createGuestUser = () => {
  const id = createId("guest");
  const guest = {
    id,
    name: "Гость",
    avatarUrl: "/guest.png",
    purchases: [],
    createdAt: Date.now(),
    type: "guest",
  };
  const users = loadUsers();
  users.push(guest);
  saveUsers(users);
  return guest;
};

export const registerUser = (userData) => {
  const id = createId("user");
  const user = {
    id,
    ...userData,
    purchases: [],
    type: "user",
    createdAt: Date.now(),
  };
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return user;
};

export const updateUser = (user) => {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx === -1) return;
  users[idx] = user;
  saveUsers(users);
};
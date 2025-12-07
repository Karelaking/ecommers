export function generateMockUsers(count: number = 20) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({ id: `user-${i+1}`, name: `User ${i+1}` });
  }
  return users;
}

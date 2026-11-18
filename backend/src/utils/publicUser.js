export const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  teacher: user.teacher
    ? {
        id: user.teacher._id,
        name: user.teacher.name,
        initials: user.teacher.initials,
        classLevel: user.teacher.classLevel,
        color: user.teacher.color,
        status: user.teacher.status,
      }
    : null,
});

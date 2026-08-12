export const findMember = (group, userId) => {
    return group.members.find(({ user }) =>
        user.equals(userId)
    );
};

export const findActiveMember = (group, userId) => {
    return group.members.find(
        ({ user, isActive }) =>
            user.equals(userId) && isActive
    );
};

export const isActiveMember = (group, userId) => {
    return group.members.some(
        ({ user, isActive }) =>
            user.equals(userId) && isActive
    );
};

export const getActiveMemberCount = (group) => {
    return group.members.filter(
        ({ isActive }) => isActive
    ).length;
};

export const getInactiveMemberCount = (group) => {
    return group.members.filter(
        ({ isActive }) => !isActive
    ).length;
};
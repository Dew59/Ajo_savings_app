const createMember = (userId) => {
    return {
        user: userId,
        joinedAt: new Date(),
    };
};

export default createMember;
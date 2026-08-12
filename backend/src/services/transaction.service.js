import Transaction from "../models/transaction.model.js";


const populateTransaction = (query) => {
    return query
        .populate("group", "name members")
        .populate("cycle", "cycleNumber")
        .populate("user", "name email")
        .populate("contribution", "amount paymentDate");
};

export const createTransaction = async ({
    user,
    group,
    cycle,
    contribution = null,
    type,
    amount,
    description,
    session = null,
}) => {
    return await Transaction.create(
        [
            {
                user,
                group,
                cycle,
                contribution,
                type,
                amount,
                description,
            },
        ],
        session ? { session } : {}
    ).then(([transaction]) => transaction);
};

export const getTransactions = async (userId) => {
    return await populateTransaction(
        Transaction.find({
            user: userId,
        }).sort({
            createdAt: -1,
        })
    );
};
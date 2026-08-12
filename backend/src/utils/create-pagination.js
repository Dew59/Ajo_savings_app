import AppError from "../utils/app-error.js";
import HTTP_STATUS from "../constants/http-status.js";
import getPagination from "../utils/pagination.js";

const createPagination = ({ total, page, limit }) => {
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    if (page > totalPages && total > 0) {
        throw new AppError(
            "Requested page exceeds the available number of pages.",
            HTTP_STATUS.BAD_REQUEST
        );
    }

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
};

export default createPagination;
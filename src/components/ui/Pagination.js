import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (!totalPages || totalPages <= 1) return null;

    const MAX_VISIBLE = 7;
    const pages = [];

    const addPage = (p) => pages.push(p);
    const addEllipsis = (key) => pages.push(key);

    if (totalPages <= MAX_VISIBLE) {
        for (let p = 1; p <= totalPages; p++) addPage(p);
    } else {
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        addPage(1);
        if (start > 2) addEllipsis("start");
        for (let p = start; p <= end; p++) addPage(p);
        if (end < totalPages - 1) addEllipsis("end");
        addPage(totalPages);
    }

    return (
        <div className="pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Trang trước"
            >
                ←
            </button>
            {pages.map((p, idx) =>
                typeof p === "number" ? (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={currentPage === p ? "active" : ""}
                        aria-current={currentPage === p ? "page" : undefined}
                    >
                        {p}
                    </button>
                ) : (
                    <button
                        key={`${p}-${idx}`}
                        disabled
                        style={{ opacity: 0.6 }}
                    >
                        …
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
            >
                →
            </button>
        </div>
    );
};

export default Pagination;

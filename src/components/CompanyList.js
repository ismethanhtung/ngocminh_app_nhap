import React, { useState, useEffect } from "react";
import { companyService } from "../services/api";
import Pagination from "./ui/Pagination";
import Spinner from "./ui/Spinner";
import EmptyState from "./ui/EmptyState";

const CompanyList = ({ onCompanySelect }) => {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("CreatedDate");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        loadCompanies();
    }, []);

    useEffect(() => {
        filterAndSortCompanies();
    }, [companies, searchTerm, sortBy, sortOrder, dateFrom, dateTo]);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await companyService.getAllCompanies();

            if (response.success) {
                setCompanies(response.data || []);
            } else {
                setError("Không thể tải danh sách công ty");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortCompanies = () => {
        let filtered = [...companies];

        // Lọc theo từ khóa tìm kiếm (an toàn với null/undefined)
        const q = (searchTerm || "").toLowerCase().trim();
        if (q) {
            filtered = filtered.filter((company) => {
                const name = (company?.OrgName || "").toLowerCase();
                const creator = (company?.Creator || "").toLowerCase();
                return name.includes(q) || creator.includes(q);
            });
        }

        // Lọc theo khoảng thời gian
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filtered = filtered.filter((company) => {
                const companyDate = new Date(company.CreatedDate);
                return companyDate >= fromDate;
            });
        }

        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999); // Đến cuối ngày
            filtered = filtered.filter((company) => {
                const companyDate = new Date(company.CreatedDate);
                return companyDate <= toDate;
            });
        }

        // Sắp xếp
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (
                sortBy === "CreatedDate" ||
                sortBy === "StartDate" ||
                sortBy === "EndDate"
            ) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredCompanies(filtered);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
    };

    const clearDateFilter = () => {
        setDateFrom("");
        setDateTo("");
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const handleCompanySelect = (company) => {
        if (onCompanySelect) {
            onCompanySelect(company);
        }
    };

    const handleRowKey = (e, company) => {
        if (e.key === "Enter") {
            handleCompanySelect(company);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString("vi-VN");
    };

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <Spinner label="Đang tải danh sách công ty..." />;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div>
            {/* Thanh tìm kiếm và lọc */}
            <div className="search-container">
                <div style={{ marginBottom: "16px" }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm công ty hoặc người tạo..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control"
                    />
                </div>

                {/* Bộ lọc theo ngày */}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        marginBottom: "16px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#333",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Từ ngày:
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={handleDateFromChange}
                            className="form-control"
                            style={{ width: "150px" }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#333",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Đến ngày:
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={handleDateToChange}
                            className="form-control"
                            style={{ width: "150px" }}
                        />
                    </div>

                    {(dateFrom || dateTo) && (
                        <button
                            onClick={clearDateFilter}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "500",
                            }}
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </div>
            </div>

            {/* Bảng danh sách công ty hoặc trạng thái rỗng */}
            {filteredCompanies.length ? (
                <div style={{ overflowX: "auto" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => handleSort("OrgName")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Tên công ty{" "}
                                    {sortBy === "OrgName" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("Creator")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Người tạo{" "}
                                    {sortBy === "Creator" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("StartDate")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Ngày bắt đầu{" "}
                                    {sortBy === "StartDate" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("EndDate")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Ngày kết thúc{" "}
                                    {sortBy === "EndDate" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("ResultCount")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Số kết quả{" "}
                                    {sortBy === "ResultCount" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("CreatedDate")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Ngày tạo{" "}
                                    {sortBy === "CreatedDate" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCompanies.map((company) => (
                                <tr
                                    key={company.Id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleCompanySelect(company)}
                                    onKeyDown={(e) => handleRowKey(e, company)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td style={{ padding: "16px" }}>
                                        <strong>{company.OrgName}</strong>
                                        {company.Notes && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#666",
                                                    marginTop: "4px",
                                                }}
                                            >
                                                Ghi chú: {company.Notes}
                                            </div>
                                        )}
                                    </td>
                                    <td>{company.Creator}</td>
                                    <td>{formatDate(company.StartDate)}</td>
                                    <td>{formatDate(company.EndDate)}</td>
                                    <td>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    company.ResultCount > 0
                                                        ? "#d4edda"
                                                        : "#f8d7da",
                                                color:
                                                    company.ResultCount > 0
                                                        ? "#155724"
                                                        : "#721c24",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                fontSize: "12px",
                                            }}
                                        >
                                            {company.ResultCount} kết quả
                                        </span>
                                    </td>
                                    <td>
                                        {formatDateTime(company.CreatedDate)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    title="Không tìm thấy công ty phù hợp"
                    subtitle="Hãy thử từ khóa khác hoặc xóa bộ lọc"
                />
            )}

            {/* Phân trang */}
            {filteredCompanies.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Thống kê */}
            {filteredCompanies.length > 0 && (
                <div
                    style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        color: "#6c757d",
                    }}
                >
                    Hiển thị {startIndex + 1}-
                    {Math.min(endIndex, filteredCompanies.length)} trong tổng số{" "}
                    {filteredCompanies.length} công ty
                </div>
            )}
        </div>
    );
};

export default CompanyList;

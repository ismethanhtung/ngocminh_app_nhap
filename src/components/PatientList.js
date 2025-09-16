import React, { useState, useEffect } from "react";
import { patientService } from "../services/api";
import Pagination from "./ui/Pagination";
import Spinner from "./ui/Spinner";
import EmptyState from "./ui/EmptyState";

const PatientList = ({ company, onPatientSelect, onBack }) => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        if (company && company.Id) {
            loadPatients(company.Id);
        }
    }, [company]);

    useEffect(() => {
        filterAndSortPatients();
    }, [patients, searchTerm, sortBy, sortOrder]);

    const loadPatients = async (dataId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await patientService.getPatientsByCompanyId(
                dataId
            );

            if (response.success) {
                setPatients(response.data || []);
            } else {
                setError("Không thể tải danh sách bệnh nhân");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPatients = () => {
        let filtered = [...patients];

        // Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter(
                (patient) =>
                    (patient.SurName &&
                        patient.SurName.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        )) ||
                    (patient.FirstName &&
                        patient.FirstName.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        )) ||
                    (patient.FileNum &&
                        patient.FileNum.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        )) ||
                    (patient.ItemNum &&
                        patient.ItemNum.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        )) ||
                    (patient.HealthType &&
                        patient.HealthType.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        )) ||
                    (patient.Conclusion &&
                        patient.Conclusion.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        )) ||
                    (patient.ConclusionDoctor &&
                        patient.ConclusionDoctor.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        )) ||
                    (patient.FileName &&
                        patient.FileName.toLowerCase().includes(
                            searchTerm.toLowerCase()
                        ))
            );
        }

        // Sắp xếp
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Xử lý sắp xếp theo tên bệnh nhân (kết hợp SurName + FirstName)
            if (sortBy === "SurName") {
                aValue = `${a.SurName || ""} ${a.FirstName || ""}`.trim();
                bValue = `${b.SurName || ""} ${b.FirstName || ""}`.trim();
            }

            if (sortBy === "ConclusionDate") {
                aValue = new Date(aValue || 0);
                bValue = new Date(bValue || 0);
            }

            if (aValue === null || aValue === undefined) aValue = "";
            if (bValue === null || bValue === undefined) bValue = "";

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredPatients(filtered);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const handleRowClick = (patient) => {
        onPatientSelect && onPatientSelect(patient);
    };

    const handleRowKey = (e, patient) => {
        if (e.key === "Enter") handleRowClick(patient);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Chưa có";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const getStatusBadge = (patient) => {
        if (patient.Conclusion && patient.Conclusion.trim()) {
            return {
                text: "Đã có kết quả",
                className: "status-completed",
            };
        } else {
            return {
                text: "Chưa có kết quả",
                className: "status-pending",
            };
        }
    };

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPatients = filteredPatients.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <Spinner label="Đang tải danh sách bệnh nhân..." />;
    }

    if (error) {
        return (
            <div>
                <div className="error">{error}</div>
                <button className="btn btn-secondary" onClick={onBack}>
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Thanh tìm kiếm */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên bệnh nhân, số hồ sơ, số mẫu, loại khám, kết luận, bác sĩ..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control"
                />
            </div>
            {/* Nút quay lại */}
            <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                <button
                    className="btn btn-secondary"
                    style={{ backgroundColor: "#fefbd8", color: "#fff" }}
                    onClick={onBack}
                >
                    ← Quay lại danh sách công ty
                </button>
            </div>

            {/* Bảng danh sách bệnh nhân hoặc trạng thái rỗng */}
            {filteredPatients.length ? (
                <div style={{ overflowX: "auto" }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th
                                    onClick={() => handleSort("Id")}
                                    style={{ cursor: "pointer" }}
                                >
                                    ID{" "}
                                    {sortBy === "Id" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("SurName")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Tên bệnh nhân{" "}
                                    {sortBy === "SurName" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("FileNum")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Số hồ sơ{" "}
                                    {sortBy === "FileNum" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("ItemNum")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Số mẫu{" "}
                                    {sortBy === "ItemNum" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("HealthType")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Sức khoẻ loại{" "}
                                    {sortBy === "HealthType" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("Conclusion")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Kết luận{" "}
                                    {sortBy === "Conclusion" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() =>
                                        handleSort("ConclusionDoctor")
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    Bác sĩ{" "}
                                    {sortBy === "ConclusionDoctor" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("ConclusionDate")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Ngày kết luận{" "}
                                    {sortBy === "ConclusionDate" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                                <th
                                    onClick={() => handleSort("FileName")}
                                    style={{ cursor: "pointer" }}
                                >
                                    File đính kèm{" "}
                                    {sortBy === "FileName" &&
                                        (sortOrder === "asc" ? "↑" : "↓")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPatients.map((patient) => {
                                return (
                                    <tr
                                        key={patient.Id}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            onPatientSelect &&
                                            onPatientSelect(patient)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                                onPatientSelect &&
                                                    onPatientSelect(patient);
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{patient.Id}</td>
                                        <td>
                                            <div style={{ fontWeight: "500" }}>
                                                {patient.SurName &&
                                                patient.FirstName
                                                    ? `${patient.SurName} ${patient.FirstName}`
                                                    : "Chưa có tên"}
                                            </div>
                                            {patient.Sex && (
                                                <div
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#666",
                                                    }}
                                                >
                                                    {patient.Sex}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    backgroundColor: "#e7f3ff",
                                                    color: "#0066cc",
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {patient.FileNum || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    backgroundColor: "#f0f0f0",
                                                    color: "#333",
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {patient.ItemNum || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            {patient.HealthType ||
                                                "Chưa xác định"}
                                        </td>
                                        <td>
                                            <div
                                                style={{
                                                    maxWidth: "200px",
                                                    wordWrap: "break-word",
                                                }}
                                            >
                                                {patient.Conclusion
                                                    ? patient.Conclusion
                                                          .length > 50
                                                        ? `${patient.Conclusion.substring(
                                                              0,
                                                              50
                                                          )}...`
                                                        : patient.Conclusion
                                                    : "Chưa có kết luận"}
                                            </div>
                                        </td>
                                        <td>
                                            {patient.ConclusionDoctor ||
                                                "Chưa xác định"}
                                        </td>
                                        <td>
                                            {formatDate(patient.ConclusionDate)}
                                        </td>
                                        <td>
                                            {patient.FileName ? (
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#007bff",
                                                    }}
                                                >
                                                    {patient.FileName}
                                                </span>
                                            ) : (
                                                "Không có file"
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    title="Không tìm thấy bệnh nhân phù hợp"
                    subtitle="Hãy thử từ khóa khác hoặc xóa bộ lọc"
                />
            )}

            {/* Phân trang */}
            {filteredPatients.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Thống kê */}
            {filteredPatients.length > 0 && (
                <div
                    style={{
                        marginTop: "12px",
                        fontSize: "13px",
                        color: "#6c757d",
                    }}
                >
                    Hiển thị {startIndex + 1}-
                    {Math.min(endIndex, filteredPatients.length)} trong tổng số{" "}
                    {filteredPatients.length} bệnh nhân
                </div>
            )}
        </div>
    );
};

export default PatientList;

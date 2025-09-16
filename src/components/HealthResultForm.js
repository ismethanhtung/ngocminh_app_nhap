import React, { useState, useEffect } from "react";
import { healthResultService, fileService } from "../services/api";

const HealthResultForm = ({ patient, company, onSave, onCancel, onBack }) => {
    const [formData, setFormData] = useState({
        HealthType: "",
        Conclusion: "",
        Suggestion: "",
        ConclusionDate: "",
        FileName: "",
        ConclusionDoctor: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (patient) {
            // Nếu bệnh nhân đã có dữ liệu, điền vào form để chỉnh sửa
            setFormData({
                HealthType: patient.HealthType || "",
                Conclusion: patient.Conclusion || "",
                Suggestion: patient.Suggestion || "",
                ConclusionDate: patient.ConclusionDate
                    ? new Date(patient.ConclusionDate)
                          .toISOString()
                          .split("T")[0]
                    : "",
                FileName: patient.FileName || "",
                ConclusionDoctor: patient.ConclusionDoctor || "",
            });
            setIsEditing(true);
        } else {
            // Nếu là bệnh nhân mới, reset form
            setFormData({
                HealthType: "",
                Conclusion: "",
                Suggestion: "",
                ConclusionDate: new Date().toISOString().split("T")[0],
                FileName: "",
                ConclusionDoctor: "",
            });
            setIsEditing(false);
        }
    }, [patient]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Debug log để kiểm tra encoding
        if (name === "ConclusionDoctor") {
            console.log("Original value:", value);
            console.log("Value length:", value.length);
            console.log("Value bytes:", new TextEncoder().encode(value));
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.HealthType.trim()) {
            setError("Vui lòng nhập loại khám sức khỏe");
            return;
        }

        if (!formData.Conclusion.trim()) {
            setError("Vui lòng nhập kết luận khám");
            return;
        }

        if (!formData.ConclusionDoctor.trim()) {
            setError("Vui lòng nhập tên bác sĩ kết luận");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            let response;
            if (isEditing && patient) {
                // Cập nhật kết quả hiện có
                response = await healthResultService.updateHealthResult(
                    patient.Id,
                    formData
                );
            } else {
                // Tạo kết quả mới
                response = await healthResultService.createHealthResult(
                    company.Id,
                    formData
                );
            }

            if (response.success) {
                setSuccess(
                    isEditing
                        ? "Cập nhật kết quả thành công!"
                        : "Tạo kết quả thành công!"
                );

                // Gọi callback để thông báo cho component cha
                if (onSave) {
                    onSave(response.data);
                }

                // Tự động quay lại sau 2 giây
                setTimeout(() => {
                    if (onBack) {
                        onBack();
                    }
                }, 2000);
            } else {
                setError(response.message || "Có lỗi xảy ra khi lưu kết quả");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (patient) {
            // Reset về dữ liệu gốc
            setFormData({
                HealthType: patient.HealthType || "",
                Conclusion: patient.Conclusion || "",
                Suggestion: patient.Suggestion || "",
                ConclusionDate: patient.ConclusionDate
                    ? new Date(patient.ConclusionDate)
                          .toISOString()
                          .split("T")[0]
                    : "",
                FileName: patient.FileName || "",
                ConclusionDoctor: patient.ConclusionDoctor || "",
            });
        } else {
            // Reset form trống
            setFormData({
                HealthType: "",
                Conclusion: "",
                Suggestion: "",
                ConclusionDate: new Date().toISOString().split("T")[0],
                FileName: "",
                ConclusionDoctor: "",
            });
        }
        setError(null);
        setSuccess(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Chưa có";
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    return (
        <div className="card">
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    padding: 48,
                }}
            >
                <h2
                    style={{
                        fontWeight: 700,
                        fontSize: 30,
                        color: "#222",
                        margin: 0,
                        textAlign: "center",
                        letterSpacing: 0.5,
                    }}
                >
                    {`${patient?.SurName || ""} ${
                        patient?.FirstName || ""
                    }`.trim() || "Chưa có"}
                    {patient?.ItemNum ? ` - ${patient.ItemNum}` : ""}
                </h2>
                {/* Thông tin bệnh nhân */}
            </div>

            {/* Thông báo lỗi/thành công */}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            {/* Form nhập liệu */}
            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {/* Loại khám sức khỏe */}
                    <div className="form-group">
                        <label className="form-label">
                            Loại khám sức khỏe{" "}
                            <span style={{ color: "red" }}></span>
                        </label>
                        <input
                            type="text"
                            name="HealthType"
                            value={formData.HealthType}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Nhập loại khám sức khỏe (VD: I, II, III...)"
                        />
                    </div>

                    {/* Bác sĩ kết luận */}
                    <div className="form-group">
                        <label className="form-label">
                            Bác sĩ kết luận{" "}
                            <span style={{ color: "red" }}></span>
                        </label>
                        <input
                            type="text"
                            name="ConclusionDoctor"
                            value={formData.ConclusionDoctor}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Nhập tên bác sĩ kết luận"
                        />
                    </div>

                    {/* Ngày kết luận */}
                    <div className="form-group">
                        <label className="form-label">Ngày kết luận</label>
                        <input
                            type="date"
                            name="ConclusionDate"
                            value={formData.ConclusionDate}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>

                    {/* Tên file đính kèm - ẩn trong giao diện chỉnh sửa theo yêu cầu */}
                    {/* (Đã tạm ẩn không render input để tránh chỉnh sửa FileName) */}
                </div>

                {/* Hiển thị trạng thái file kết quả */}
                <div className="form-group">
                    <label className="form-label">File kết quả hiện tại</label>
                    {patient?.FileName ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px",
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #dee2e6",
                                borderRadius: "6px",
                                marginTop: "8px",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontWeight: "500",
                                        color: "#495057",
                                        marginBottom: "4px",
                                    }}
                                >
                                    📄 {patient.FileName}
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#6c757d",
                                    }}
                                >
                                    File đính kèm kết quả khám
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    style={{
                                        fontSize: "12px",
                                        padding: "6px 12px",
                                    }}
                                    onClick={() =>
                                        fileService.openHaDoc(patient.FileName)
                                    }
                                >
                                    👁️ Xem
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    style={{
                                        fontSize: "12px",
                                        padding: "6px 12px",
                                    }}
                                    onClick={() =>
                                        fileService.downloadHaDoc(
                                            patient.FileName
                                        )
                                    }
                                >
                                    ⬇️ Tải về
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px",
                                backgroundColor: "#fff3cd",
                                border: "1px solid #ffeaa7",
                                borderRadius: "6px",
                                marginTop: "8px",
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        fontWeight: "500",
                                        color: "#856404",
                                        marginBottom: "4px",
                                    }}
                                >
                                    📄 Chưa có file
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#856404",
                                    }}
                                >
                                    Bệnh nhân chưa có file kết quả khám đính kèm
                                </div>
                            </div>
                            <div
                                style={{
                                    fontSize: "24px",
                                    color: "#856404",
                                    opacity: 0.7,
                                }}
                            >
                                ⚠️
                            </div>
                        </div>
                    )}
                </div>

                {/* Kết luận */}
                <div className="form-group">
                    <label className="form-label">
                        Kết luận khám <span style={{ color: "red" }}></span>
                    </label>
                    <textarea
                        name="Conclusion"
                        value={formData.Conclusion}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="4"
                        placeholder="Nhập kết luận chi tiết về tình trạng sức khỏe của bệnh nhân..."
                        style={{ resize: "vertical" }}
                    />
                </div>

                {/* Đề xuất */}
                <div className="form-group">
                    <label className="form-label">Đề xuất/Chỉ định</label>
                    <textarea
                        name="Suggestion"
                        value={formData.Suggestion}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="3"
                        placeholder="Nhập các đề xuất, chỉ định điều trị hoặc theo dõi..."
                        style={{ resize: "vertical" }}
                    />
                </div>

                {/* Nút thao tác */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "flex-end",
                        marginTop: "30px",
                        paddingTop: "20px",
                        borderTop: "1px solid #ddd",
                    }}
                >
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Hủy
                    </button>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading
                            ? "Đang lưu..."
                            : isEditing
                            ? "Cập nhật"
                            : "Lưu kết quả"}
                    </button>
                </div>
            </form>

            {/* Hướng dẫn sử dụng */}
        </div>
    );
};

export default HealthResultForm;

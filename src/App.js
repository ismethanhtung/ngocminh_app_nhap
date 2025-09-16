import React, { useState } from "react";
import CompanyList from "./components/CompanyList";
import PatientList from "./components/PatientList";
import HealthResultForm from "./components/HealthResultForm";
import "./App.css";
import "./utils/encodingTest"; // Import để có thể test UTF-8 encoding
import GlobalDropzone from "./components/GlobalDropzone";

function App() {
    const [currentView, setCurrentView] = useState("companies"); // 'companies', 'patients', 'form'
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', message: string }

    // Xử lý khi chọn công ty
    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        setSelectedPatient(null);
        setCurrentView("patients");
    };

    // Xử lý khi chọn bệnh nhân
    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setCurrentView("form");
    };

    // Xử lý khi lưu kết quả thành công
    const handleSaveSuccess = (savedData) => {
        console.log("Kết quả đã được lưu:", savedData);
        // Có thể thêm logic cập nhật danh sách bệnh nhân ở đây
    };

    // Quay lại danh sách công ty
    const handleBackToCompanies = () => {
        setCurrentView("companies");
        setSelectedCompany(null);
        setSelectedPatient(null);
    };

    // Quay lại danh sách bệnh nhân
    const handleBackToPatients = () => {
        setCurrentView("patients");
        setSelectedPatient(null);
    };

    // Quay lại từ form về danh sách bệnh nhân
    const handleBackFromForm = () => {
        setCurrentView("patients");
        setSelectedPatient(null);
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const handleUploadSuccess = (data) => {
        // data: { success, message, files, updates, uploadedFiles, skippedFiles }
        let message = data?.message || "Upload thành công";

        if (data?.uploadedFiles && data.uploadedFiles.length > 0) {
            message += ` - Đã upload: ${data.uploadedFiles.join(", ")}`;
        }

        if (data?.skippedFiles && data.skippedFiles.length > 0) {
            message += ` - Bỏ qua: ${data.skippedFiles.join(", ")}`;
        }

        showToast("success", message);
    };

    const handleUploadError = (err) => {
        const message =
            err?.response?.data?.message || err.message || "Lỗi upload";
        showToast("error", message);
    };

    // Render component dựa trên view hiện tại
    const renderCurrentView = () => {
        switch (currentView) {
            case "companies":
                return <CompanyList onCompanySelect={handleCompanySelect} />;

            case "patients":
                return (
                    <PatientList
                        company={selectedCompany}
                        onPatientSelect={handlePatientSelect}
                        onBack={handleBackToCompanies}
                    />
                );

            case "form":
                return (
                    <HealthResultForm
                        patient={selectedPatient}
                        company={selectedCompany}
                        onSave={handleSaveSuccess}
                        onCancel={handleBackToPatients}
                        onBack={handleBackFromForm}
                    />
                );

            default:
                return <CompanyList onCompanySelect={handleCompanySelect} />;
        }
    };

    return (
        <div className="App">
            {/* Global dropzone for drag & drop upload */}
            <GlobalDropzone
                onUploaded={handleUploadSuccess}
                onError={handleUploadError}
            />

            {/* Toast notification */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        right: 20,
                        bottom: 20,
                        background:
                            toast.type === "success" ? "#28a745" : "#dc3545",
                        color: "#fff",
                        padding: "12px 16px",
                        borderRadius: 8,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        zIndex: 10000,
                        maxWidth: 360,
                    }}
                >
                    {toast.message}
                </div>
            )}

            <div className="container">
                {/* Navigation breadcrumb */}
                <div className="breadcrumb" style={{ marginBottom: "20px" }}>
                    <span
                        className={currentView === "companies" ? "active" : ""}
                        onClick={() => setCurrentView("companies")}
                        style={{
                            cursor: "pointer",
                            color:
                                currentView === "companies"
                                    ? "#007bff"
                                    : "#666",
                        }}
                    >
                        📋 Danh sách công ty
                    </span>

                    {selectedCompany && (
                        <>
                            <span>›</span>
                            <span
                                className={
                                    currentView === "patients" ? "active" : ""
                                }
                                onClick={() => setCurrentView("patients")}
                                style={{
                                    cursor: "pointer",
                                    color:
                                        currentView === "patients"
                                            ? "#007bff"
                                            : "#666",
                                }}
                            >
                                {selectedCompany.OrgName}
                            </span>
                        </>
                    )}

                    {selectedPatient && (
                        <>
                            <span>›</span>
                            <span
                                className={
                                    currentView === "form" ? "active" : ""
                                }
                                style={{
                                    color:
                                        currentView === "form"
                                            ? "#007bff"
                                            : "#666",
                                }}
                            >
                                {" "}
                                {selectedPatient.Conclusion
                                    ? "Chỉnh sửa kết quả"
                                    : "Nhập kết quả"}
                            </span>
                        </>
                    )}
                </div>

                {/* Main content */}
                {renderCurrentView()}
            </div>
        </div>
    );
}

export default App;

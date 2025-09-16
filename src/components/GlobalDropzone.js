import React, { useEffect, useRef, useState } from "react";
import { uploadService } from "../services/api";

const GlobalDropzone = ({ onUploaded, onError }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [pendingFiles, setPendingFiles] = useState([]);
    const dragCounter = useRef(0);

    // Hàm xử lý khi file đã tồn tại
    const handleFileExists = (filename) => {
        return new Promise((resolve) => {
            setPendingFile(filename);
            setShowConfirmDialog(true);

            // Lưu resolve function để sử dụng trong dialog
            window.fileExistsResolve = resolve;
        });
    };

    // Xử lý khi người dùng chọn thay thế
    const handleReplace = () => {
        setShowConfirmDialog(false);
        if (window.fileExistsResolve) {
            window.fileExistsResolve(true);
            window.fileExistsResolve = null;
        }
    };

    // Xử lý khi người dùng chọn bỏ qua
    const handleSkip = () => {
        setShowConfirmDialog(false);
        if (window.fileExistsResolve) {
            window.fileExistsResolve(false);
            window.fileExistsResolve = null;
        }
    };

    useEffect(() => {
        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current += 1;
            setIsDragging(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current -= 1;
            if (dragCounter.current === 0) setIsDragging(false);
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current = 0;
            setIsDragging(false);

            const files = e.dataTransfer?.files;
            if (!files || files.length === 0) return;

            // Sử dụng API mới với xác nhận thay thế
            try {
                const data = await uploadService.uploadHaDocsWithConfirmation(
                    files,
                    handleFileExists
                );
                onUploaded && onUploaded(data);
            } catch (err) {
                onError && onError(err);
            }
        };

        window.addEventListener("dragenter", handleDragEnter);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragenter", handleDragEnter);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop);
        };
    }, [onUploaded, onError]);

    return (
        <>
            {/* Dialog xác nhận thay thế file */}
            {showConfirmDialog && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10000,
                        pointerEvents: "auto",
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            maxWidth: "400px",
                            width: "90%",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                marginBottom: "12px",
                                color: "#333",
                            }}
                        >
                            ⚠️ File đã tồn tại
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                color: "#666",
                                marginBottom: "20px",
                            }}
                        >
                            File <strong>"{pendingFile}"</strong> đã tồn tại
                            trong hệ thống.
                            <br />
                            Bạn có muốn thay thế file này không?
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={handleSkip}
                                style={{
                                    padding: "8px 16px",
                                    border: "1px solid #ddd",
                                    background: "white",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    color: "#666",
                                }}
                            >
                                Bỏ qua
                            </button>
                            <button
                                onClick={handleReplace}
                                style={{
                                    padding: "8px 16px",
                                    border: "none",
                                    background: "#dc3545",
                                    color: "white",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                }}
                            >
                                Thay thế
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay drag & drop */}
            {isDragging && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        pointerEvents: "auto",
                    }}
                >
                    <div
                        style={{
                            border: "2px dashed #fff",
                            padding: 40,
                            borderRadius: 12,
                            textAlign: "center",
                            backdropFilter: "blur(2px)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 600,
                                marginBottom: 8,
                            }}
                        >
                            Thả file vào đây để upload
                        </div>
                        <div style={{ fontSize: 14, opacity: 0.9 }}>
                            Hỗ trợ nhiều file, tối đa 10MB/file. Tên file cần
                            bắt đầu bằng ItemNum.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GlobalDropzone;

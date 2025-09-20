import axios from "axios";

// Cấu hình base URL cho API
const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://172.16.2.240:3000";

// Utility function để đảm bảo UTF-8 encoding
const ensureUtf8 = (str) => {
    if (typeof str === "string") {
        // Normalize string để đảm bảo UTF-8 encoding đúng
        return str.normalize("NFC");
    }
    return str;
};

// Utility function để xử lý object data
const processDataForUtf8 = (data) => {
    if (typeof data === "object" && data !== null) {
        const processed = {};
        for (const [key, value] of Object.entries(data)) {
            processed[key] =
                typeof value === "string" ? ensureUtf8(value) : value;
        }
        return processed;
    }
    return data;
};

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    },
});

// Interceptor để xử lý request - đảm bảo UTF-8 encoding
api.interceptors.request.use(
    (config) => {
        // Xử lý dữ liệu để đảm bảo UTF-8 encoding
        if (config.data && !(config.data instanceof FormData)) {
            const processedData = processDataForUtf8(config.data);
            config.data = processedData;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

// API Services
export const companyService = {
    // Lấy danh sách tất cả công ty
    getAllCompanies: async () => {
        try {
            const response = await api.get("/api/v1/ha/all-data");
            return response.data;
        } catch (error) {
            throw new Error(`Lỗi khi lấy danh sách công ty: ${error.message}`);
        }
    },

    // Lấy thông tin chi tiết công ty theo ID
    getCompanyById: async (companyId) => {
        try {
            const response = await api.get(`/api/v1/ha/all-data/${companyId}`);
            return response.data;
        } catch (error) {
            throw new Error(`Lỗi khi lấy thông tin công ty: ${error.message}`);
        }
    },
};

export const patientService = {
    // Lấy danh sách bệnh nhân theo DataId (ID công ty)
    getPatientsByCompanyId: async (dataId) => {
        try {
            const response = await api.get(
                `/api/v1/ha/result-detail/${dataId}`
            );
            return response.data;
        } catch (error) {
            throw new Error(
                `Lỗi khi lấy danh sách bệnh nhân: ${error.message}`
            );
        }
    },

    // Lấy thông tin chi tiết bệnh nhân theo ID
    getPatientById: async (patientId) => {
        try {
            const response = await api.get(
                `/api/v1/ha/result-detail/${patientId}`
            );
            return response.data;
        } catch (error) {
            throw new Error(
                `Lỗi khi lấy thông tin bệnh nhân: ${error.message}`
            );
        }
    },
};

export const healthResultService = {
    // Cập nhật kết quả khám sức khỏe
    updateHealthResult: async (resultId, updateData) => {
        try {
            // Debug log để kiểm tra dữ liệu trước khi gửi
            console.log("Data before sending:", updateData);
            console.log(
                "ConclusionDoctor bytes:",
                new TextEncoder().encode(updateData.ConclusionDoctor || "")
            );

            const response = await api.put(
                `/api/v1/ha/result-detail/${resultId}`,
                updateData
            );
            return response.data;
        } catch (error) {
            throw new Error(`Lỗi khi cập nhật kết quả khám: ${error.message}`);
        }
    },

    // Tạo kết quả khám sức khỏe mới
    createHealthResult: async (dataId, healthData) => {
        try {
            // Debug log để kiểm tra dữ liệu trước khi gửi
            console.log("Data before sending:", healthData);
            console.log(
                "ConclusionDoctor bytes:",
                new TextEncoder().encode(healthData.ConclusionDoctor || "")
            );

            const response = await api.post(`/api/v1/ha/result-detail`, {
                DataId: dataId,
                ...healthData,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Lỗi khi tạo kết quả khám: ${error.message}`);
        }
    },
};

export const uploadService = {
    // Kiểm tra file có tồn tại không
    checkFileExists: async (filename) => {
        try {
            const response = await api.get(
                `/api/v1/ha/check-file-exists/${encodeURIComponent(filename)}`
            );
            return response.data;
        } catch (error) {
            // Nếu API không tồn tại hoặc lỗi, giả sử file không tồn tại
            return { exists: false };
        }
    },

    // Upload 1-n file HA docs
    uploadHaDocs: async (files) => {
        const form = new FormData();
        Array.from(files).forEach((file) => form.append("files", file));

        try {
            const response = await api.post("/api/v1/ha/upload-ha-docs", form, {
                headers: { "Content-Type": "multipart/form-data" },
                maxContentLength: 10 * 1024 * 1024,
                maxBodyLength: 10 * 1024 * 1024,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Lỗi upload tài liệu: ${error.message}`);
        }
    },

    // Upload file với xác nhận thay thế
    uploadHaDocsWithConfirmation: async (files, onFileExists) => {
        const filesToUpload = [];
        const filesToSkip = [];

        // Kiểm tra từng file
        for (const file of Array.from(files)) {
            try {
                const checkResult = await uploadService.checkFileExists(
                    file.name
                );
                if (checkResult.exists) {
                    // File đã tồn tại, hỏi người dùng
                    const shouldReplace = await onFileExists(file.name);
                    if (shouldReplace) {
                        filesToUpload.push(file);
                    } else {
                        filesToSkip.push(file.name);
                    }
                } else {
                    // File chưa tồn tại, upload bình thường
                    filesToUpload.push(file);
                }
            } catch (error) {
                console.warn(`Không thể kiểm tra file ${file.name}:`, error);
                // Nếu không kiểm tra được, vẫn upload
                filesToUpload.push(file);
            }
        }

        // Nếu có file để upload
        if (filesToUpload.length > 0) {
            const form = new FormData();
            filesToUpload.forEach((file) => form.append("files", file));

            try {
                const response = await api.post(
                    "/api/v1/ha/upload-ha-docs",
                    form,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                        maxContentLength: 10 * 1024 * 1024,
                        maxBodyLength: 10 * 1024 * 1024,
                    }
                );

                return {
                    ...response.data,
                    skippedFiles: filesToSkip,
                    uploadedFiles: filesToUpload.map((f) => f.name),
                };
            } catch (error) {
                throw new Error(`Lỗi upload tài liệu: ${error.message}`);
            }
        } else {
            // Không có file nào để upload
            return {
                success: true,
                message: "Tất cả file đã được bỏ qua",
                skippedFiles: filesToSkip,
                uploadedFiles: [],
            };
        }
    },
};

export const fileService = {
    // Lấy file HA docs theo filename
    getHaDoc: (filename) => {
        if (!filename) return null;
        return `${API_BASE_URL}/api/v1/ha/ha-docs/${encodeURIComponent(
            filename
        )}`;
    },

    // Mở file trong tab mới
    openHaDoc: (filename) => {
        if (!filename) return;
        const url = fileService.getHaDoc(filename);
        window.open(url, "_blank");
    },

    // Tải file về
    downloadHaDoc: async (filename) => {
        if (!filename) return;

        try {
            const url = fileService.getHaDoc(filename);
            const response = await fetch(url);
            const blob = await response.blob();

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            throw new Error(`Lỗi tải file: ${error.message}`);
        }
    },
};

export default api;

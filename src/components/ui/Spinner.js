import React from "react";

const Spinner = ({ label = "Đang tải..." }) => (
    <div style={{ textAlign: "center", padding: 40 }}>
        <div
            style={{
                width: 28,
                height: 28,
                border: "3px solid #e9ecef",
                borderTopColor: "#007bff",
                borderRadius: "50%",
                margin: "0 auto 12px",
                animation: "spin 0.8s linear infinite",
            }}
        />
        <div style={{ color: "#6c757d" }}>{label}</div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
);

export default Spinner;

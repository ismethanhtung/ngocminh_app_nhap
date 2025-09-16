import React from "react";

const EmptyState = ({ title = "Không có dữ liệu", subtitle, action }) => (
    <div
        style={{
            textAlign: "center",
            padding: 40,
            color: "#6c757d",
            background: "#fff",
            borderRadius: 8,
            border: "1px dashed #dee2e6",
        }}
    >
        <div style={{ fontSize: 40, marginBottom: 8 }}>🗂️</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#495057" }}>
            {title}
        </div>
        {subtitle && <div style={{ marginTop: 6 }}>{subtitle}</div>}
        {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
);

export default EmptyState;

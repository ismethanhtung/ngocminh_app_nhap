import React from "react";

const Crumb = ({ children, onClick, active }) => (
    <span
        onClick={onClick}
        style={{
            cursor: onClick ? "pointer" : "default",
            color: active ? "#007bff" : onClick ? "#495057" : "#6c757d",
            fontWeight: active ? 600 : 500,
        }}
    >
        {children}
    </span>
);

const Breadcrumbs = ({ items }) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="breadcrumb" style={{ marginBottom: 16 }}>
            {items.map((item, idx) => (
                <React.Fragment key={idx}>
                    {idx > 0 && <span>›</span>}
                    <Crumb onClick={item.onClick} active={item.active}>
                        {item.label}
                    </Crumb>
                </React.Fragment>
            ))}
        </div>
    );
};

export default Breadcrumbs;

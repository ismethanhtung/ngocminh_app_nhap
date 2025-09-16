import React from "react";

const Card = ({ title, extra, children }) => (
    <div className="card">
        {title && (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                }}
            >
                <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>
                {extra}
            </div>
        )}
        {children}
    </div>
);

export default Card;

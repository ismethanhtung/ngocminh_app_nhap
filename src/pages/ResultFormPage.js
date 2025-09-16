import React from "react";
import HealthResultForm from "../components/HealthResultForm";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Card from "../components/ui/Card";

const ResultFormPage = ({
    company,
    patient,
    onBackCompanies,
    onBackPatients,
    onSave,
}) => {
    if (!company) return null;
    return (
        <>
            <Breadcrumbs
                items={[
                    { label: "📋 Danh sách công ty", onClick: onBackCompanies },
                    { label: `👥 ${company.OrgName}`, onClick: onBackPatients },
                    {
                        label: patient?.Conclusion
                            ? "📝 Chỉnh sửa kết quả"
                            : "📝 Nhập kết quả",
                        active: true,
                    },
                ]}
            />
            <Card
                title={
                    patient?.Conclusion ? "Chỉnh sửa kết quả" : "Nhập kết quả"
                }
            >
                <HealthResultForm
                    patient={patient}
                    company={company}
                    onSave={onSave}
                    onCancel={onBackPatients}
                    onBack={onBackPatients}
                />
            </Card>
        </>
    );
};

export default ResultFormPage;

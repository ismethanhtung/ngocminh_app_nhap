import React from "react";
import PatientList from "../components/PatientList";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Card from "../components/ui/Card";

const PatientsPage = ({ company, onBack, onPatientSelect }) => {
    if (!company) return null;
    return (
        <>
            <Breadcrumbs
                items={[
                    { label: "📋 Danh sách công ty", onClick: onBack },
                    { label: ` ${company.OrgName}`, active: true },
                ]}
            />
            <Card title={`Bệnh nhân - ${company.OrgName}`}>
                <PatientList
                    company={company}
                    onPatientSelect={onPatientSelect}
                    onBack={onBack}
                />
            </Card>
        </>
    );
};

export default PatientsPage;

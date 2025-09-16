import React from "react";
import CompanyList from "../components/CompanyList";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import Card from "../components/ui/Card";

const CompaniesPage = ({ onCompanySelect }) => {
    return (
        <>
            <Breadcrumbs
                items={[{ label: "📋 Danh sách công ty", active: true }]}
            />
            <Card title="Danh sách công ty">
                <CompanyList onCompanySelect={onCompanySelect} />
            </Card>
        </>
    );
};

export default CompaniesPage;

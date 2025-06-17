// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../api/api";
// import OrganizationHeader from "../components/Organization/OrganizationHeader";
// import StaffList from "../components/Organization/StaffList";
// import SurveyList from "../components/Organization/SurveyList";
// import EmailStaffModal from "../utils/Modals/EmailStaffModal";
// import SurveyFormModal from "../utils/Modals/SurveyFormModal";
// import SurveyCreateModal from "../utils/Modals/SurveyCreateModal";
// import OrgSideBar from "../components/Organization/OrgSideBar";
// // import OrganizationHeader from "../components/organization/OrganizationHeader";
// // import SurveyCreateModal from "../components/organization/SurveyCreateModal";
// // import StaffList from "../components/organization/StaffList";
// // import SurveyList from "../components/organization/SurveyList";
// // import EmailStaffModal from "../components/organization/EmailStaffModal";

// const OrganizationDetailPage = () => {
//   const { id } = useParams();
//   const [organization, setOrganization] = useState(null);
//   const [surveys, setSurveys] = useState([]);
//   const [staff, setStaff] = useState([]);
//   const [showSurveyModal, setShowSurveyModal] = useState(false);
//   const [showEmailModal, setShowEmailModal] = useState(false);

//   const loadDetails = async () => {
//     const org = await api.get(`/organizations/${id}`);
//     // const orgSurveys = await api.get(`/surveys/organization/${id}`);
//     // const orgStaff = await api.get(`/staff/organization/${id}`);

//     setOrganization(org.data);
//     setSurveys(org.data.surveys);
//     setStaff(org.data.staffs);
//   };

//   useEffect(() => {
//     loadDetails();
//   }, [id]);

//   if (!organization) return <div>Loading organization details...</div>;

//   return (
//     <div className="">
//       <OrganizationHeader
//         name={organization.name}
//         onCreateSurvey={() => setShowSurveyModal(true)}
//         onEmailStaff={() => setShowEmailModal(true)}
//       />
//       <OrgSideBar />
//       <StaffList staff={staff} />
//       <SurveyList surveys={surveys} />

//       <SurveyCreateModal
//         isOpen={showSurveyModal}
//         onClose={() => setShowSurveyModal(false)}
//         organizationId={id}
//         onCreated={loadDetails}
//       />
//       <EmailStaffModal
//         isOpen={showEmailModal}
//         onClose={() => setShowEmailModal(false)}
//         staffEmails={staff.map(s => s.email)}
//       />
//     </div>
//   );
// };

// export default OrganizationDetailPage;

import React, { useState, useEffect } from "react";
import OrgSideBar from "../components/Organization/OrgSideBar";
import StaffList from "../components/Organization/StaffList";
import SurveyList from "../components/Organization/SurveyList";
import SurveyFormModal from "../utils/Modals/SurveyFormModal";
import ShareSurveyComponent from "../components/Organization/ShareSurveyComponent.jsx"; // hypothetical
import api from "../api/api";
import { useParams } from "react-router-dom";
import CreateSurveyOrg from "../components/Organization/CreateOrgSurvey";
import ShareSurveyModal from "../components/Organization/ShareSurveyComponent.jsx";
import ImportStaff from "../components/Organization/ImportStaff.jsx";

const OrganizationDetailPage = () => {
  const [selectedView, setSelectedView] = useState("staffs");
  const [organization, setOrganization] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [staff, setStaff] = useState([]);
  // const [showShareModal, setShowShareModal] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const loadDetails = async () => {
      const org = await api.get(`/organizations/${id}`);
      setOrganization(org.data);
      setSurveys(org.data.surveys);
      setStaff(org.data.staffs);
    };
    loadDetails();
  }, [id]);

  const renderMainContent = () => {
    switch (selectedView) {
      case "staffs":
        return <StaffList staff={staff} onImportStaff={(newStaff) => setStaff([...staff, ...newStaff])} orgId={organization.id}/>;
      case "surveys":
        return <SurveyList surveys={surveys} orgName={organization.name} staffs={staff} />;
      case "create":
        return (
          <CreateSurveyOrg
            organizationId={id}
            onCreated={() => setSelectedView("surveys")}
          />
        );
      case "import":
        return (
          <ImportStaff
            organizationId={id}
            onCreated={() => setSelectedView("surveys")}
          />
        );
      // return <SurveyFormModal isOpen={true} onClose={() => setSelectedView("surveys")} organizationId={id} onCreated={() => setSelectedView("surveys")} />;
      // case "share":
      //   // return <ShareSurveyModal organizationId={id} />;
      //   <ShareSurveyModal
      //     isOpen={showShareModal}
      //     onClose={() => setShowShareModal(false)}
      //     survey={selectedSurvey}
      //     staffEmails={staff.map((s) => s.email)}
      //   />;
      default:
        return <div>Select an option from the sidebar.</div>;
    }
  };

  if (!organization) return <div>Loading organization...</div>;

  return (
    <div className="flex h-screen">
      <OrgSideBar
        selected={selectedView}
        onSelect={setSelectedView}
        orgName={organization.name}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        {/* <h1 className="text-2xl font-bold mb-4">{organization.name}</h1> */}
        {renderMainContent()}
      </div>
    </div>
  );
};

export default OrganizationDetailPage;

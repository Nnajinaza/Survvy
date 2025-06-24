import { useState, useEffect } from "react";
import OrgSideBar from "../components/Organization/OrgSideBar";
import StaffList from "../components/Organization/StaffList";
import SurveyList from "../components/Organization/SurveyList";
import api from "../api/api";
import { useParams } from "react-router-dom";
import CreateSurveyOrg from "../components/Organization/CreateOrgSurvey";
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

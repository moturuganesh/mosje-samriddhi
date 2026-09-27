with open('frontend/src/components/AdminDashboard.jsx', 'rb') as f:
    content = f.read().decode('utf-8')

import_replacement = "import { fetchAdminBranches, fetchAllApplications, updateApplicationStatus, deleteApplication } from '../api';"
content = content.replace("import { fetchAdminBranches, fetchAllApplications, updateApplicationStatus } from '../api';", import_replacement)

func_replacement = """
  const handleDeleteApplication = async (arn) => {
    if (window.confirm('Are you sure you want to permanently delete this application?')) {
      try {
        await deleteApplication(arn);
        setToastMessage('Application deleted successfully!');
        loadApplications();
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        console.error(err);
        setToastMessage('Failed to delete application.');
        setTimeout(() => setToastMessage(null), 3000);
      }
    }
  };

  const handleStatusChange = async (arn, newStatus) => {"""
content = content.replace('  const handleStatusChange = async (arn, newStatus) => {', func_replacement)

with open('frontend/src/components/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

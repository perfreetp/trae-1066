import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import DataImport from "@/pages/DataImport";
import DataVerify from "@/pages/DataVerify";
import Summary from "@/pages/Summary";
import WarningList from "@/pages/WarningList";
import DisposalTrack from "@/pages/DisposalTrack";
import ReportEditor from "@/pages/ReportEditor";
import ArchivePage from "@/pages/Archive";
import SettingsPage from "@/pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="import" element={<DataImport />} />
          <Route path="verify" element={<DataVerify />} />
          <Route path="summary" element={<Summary />} />
          <Route path="warnings" element={<WarningList />} />
          <Route path="disposal" element={<DisposalTrack />} />
          <Route path="editor" element={<ReportEditor />} />
          <Route path="archive" element={<ArchivePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

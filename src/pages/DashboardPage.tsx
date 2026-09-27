import InteractiveMap from '../components/Common/InteractiveMap';
///import { useAuth } from '../hooks/useAuth';
///import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from "../components/Dashboard/DashboardLayout.tsx";


export default function DashboardPage() {
  return (
    <DashboardLayout>
      <InteractiveMap />
    </DashboardLayout>
  );
}
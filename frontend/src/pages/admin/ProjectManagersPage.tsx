import { ProjectManagersTable } from "../../components/admin/project-managers-table";
export type ProjectManager = {
  id: number;
  fullname: string;
  email: string;
  department?: string;
  teamSize: number;
  activeProjects: number;
  status: "Active" | "On Leave" | "Suspended" | "Invited";
  lastActive?: string;
};

export const mockProjectManagers: ProjectManager[] = [
  {
    id: 1,
    fullname: "Harper Lane",
    email: "harper.lane@example.com",
    department: "Platform",
    teamSize: 12,
    activeProjects: 4,
    status: "Active",
    lastActive: "10m ago",
  },
  {
    id: 2,
    fullname: "Owen Bryant",
    email: "owen.bryant@example.com",
    department: "Mobile",
    teamSize: 8,
    activeProjects: 3,
    status: "Active",
    lastActive: "1h ago",
  },
  {
    id: 3,
    fullname: "Chloe Rivera",
    email: "chloe.rivera@example.com",
    department: "Integrations",
    teamSize: 6,
    activeProjects: 2,
    status: "On Leave",
    lastActive: "2d ago",
  },
  {
    id: 4,
    fullname: "Noah Patel",
    email: "noah.patel@example.com",
    department: "Platform",
    teamSize: 15,
    activeProjects: 6,
    status: "Active",
    lastActive: "5m ago",
  },
  {
    id: 5,
    fullname: "Ava Sullivan",
    email: "ava.sullivan@example.com",
    department: "Design",
    teamSize: 5,
    activeProjects: 1,
    status: "Active",
    lastActive: "3h ago",
  },
  {
    id: 6,
    fullname: "Liam Cooper",
    email: "liam.cooper@example.com",
    department: "Data",
    teamSize: 9,
    activeProjects: 2,
    status: "Active",
    lastActive: "20m ago",
  },
  {
    id: 7,
    fullname: "Isabella Price",
    email: "isabella.price@example.com",
    department: "Mobile",
    teamSize: 7,
    activeProjects: 3,
    status: "Active",
    lastActive: "2d ago",
  },
  {
    id: 8,
    fullname: "Mason Turner",
    email: "mason.turner@example.com",
    department: "Ops",
    teamSize: 4,
    activeProjects: 1,
    status: "Invited",
    lastActive: undefined,
  },
  {
    id: 9,
    fullname: "Sophia Bennett",
    email: "sophia.bennett@example.com",
    department: "Integrations",
    teamSize: 11,
    activeProjects: 5,
    status: "Active",
    lastActive: "8h ago",
  },
  {
    id: 10,
    fullname: "Lucas Price",
    email: "lucas.price@example.com",
    department: "Platform",
    teamSize: 10,
    activeProjects: 4,
    status: "Suspended",
    lastActive: "6mo ago",
  },
];
export default function PMPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">project managers</h1>
      <ProjectManagersTable data={mockProjectManagers} />
    </>
  );
}

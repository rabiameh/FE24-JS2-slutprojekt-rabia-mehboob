export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  timestamp: Date;
  assignedTo?: string | null;
}

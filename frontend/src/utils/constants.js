export const PROJECT_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
};

export const PROJECT_STATUS_CONFIG = {
  NOT_STARTED: {
    label: 'Not Started',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/80'
  },
  COMPLETED: {
    label: 'Completed',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
  }
};

export const TASK_STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700'
  },
  IN_PROGRESS: {
    label: 'In Progress',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/80'
  },
  COMPLETED: {
    label: 'Completed',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
  }
};

export const PRIORITY_CONFIG = {
  LOW: {
    label: 'Low',
    badgeClass: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80'
  },
  MEDIUM: {
    label: 'Medium',
    badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-800/80'
  },
  HIGH: {
    label: 'High',
    badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-800/80'
  }
};

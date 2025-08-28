import {
  User,
  Project,
  Client,
  Checksheet,
  Punchlist,
  Template,
  Tag,
  TagType,
  Vendor,
  Scope,
  DisciplineCode,
  Phase,
  TemplateVersion,
  ChecksheetStatus,
  ChecksheetHour,
  ChecksheetAttachment,
  DashboardStats,
  Tasklist
} from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Smith',
    name: 'John Smith',
    email: 'john.smith@arbiter.com',
    role_id: 1,
    picture: 'https://via.placeholder.com/150/4CAF50/FFFFFF?text=JS',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    role: {
      id: 1,
      name: 'Project Manager',
      description: 'Manages construction projects and teams',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  {
    id: 2,
    first_name: 'Sarah',
    last_name: 'Johnson',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@arbiter.com',
    role_id: 2,
    picture: 'https://via.placeholder.com/150/2196F3/FFFFFF?text=SJ',
    is_active: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z',
    role: {
      id: 2,
      name: 'Site Inspector',
      description: 'Conducts quality inspections and checksheets',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 1,
    name: 'Metro Construction Co.',
    logo: 'https://via.placeholder.com/100x50/4CAF50/FFFFFF?text=Metro',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2024-01-01T08:00:00Z'
  },
  {
    id: 2,
    name: 'Urban Development LLC',
    logo: 'https://via.placeholder.com/100x50/2196F3/FFFFFF?text=Urban',
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-05T08:00:00Z'
  },
  {
    id: 3,
    name: 'Skyline Builders Inc.',
    logo: 'https://via.placeholder.com/100x50/FF9800/FFFFFF?text=Skyline',
    created_at: '2024-01-08T08:00:00Z',
    updated_at: '2024-01-08T08:00:00Z'
  }
];

// Mock Vendors
export const mockVendors: Vendor[] = [
  {
    id: 1,
    name: 'ABC Construction',
    contact_person: 'Mike Wilson',
    email: 'mike@abcconstruction.com',
    phone: '+1 (555) 123-4567',
    address: '123 Construction Ave, New York, NY',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'XYZ Contractors',
    contact_person: 'Lisa Brown',
    email: 'lisa@xyzcontractors.com',
    phone: '+1 (555) 234-5678',
    address: '456 Builder St, Los Angeles, CA',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Scopes
export const mockScopes: Scope[] = [
  {
    id: 1,
    name: 'Foundation',
    description: 'Foundation and structural work',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Framing',
    description: 'Structural framing and walls',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Discipline Codes
export const mockDisciplineCodes: DisciplineCode[] = [
  {
    id: 1,
    code: 'CIV',
    name: 'Civil',
    description: 'Civil engineering discipline',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    code: 'STR',
    name: 'Structural',
    description: 'Structural engineering discipline',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Phases
export const mockPhases: Phase[] = [
  {
    id: 1,
    name: 'Design',
    description: 'Design and planning phase',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Construction',
    description: 'Construction and building phase',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Template Versions
export const mockTemplateVersions: TemplateVersion[] = [
  {
    id: 1,
    version: '1.0',
    description: 'Initial version',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    version: '2.0',
    description: 'Updated version',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Tag Types
export const mockTagTypes: TagType[] = [
  {
    id: 1,
    name: 'Foundation Check',
    description: 'Foundation inspection tags',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Structural Check',
    description: 'Structural inspection tags',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Tags
export const mockTags: Tag[] = [
  {
    id: 1,
    created_by: 1,
    name: 'F-001',
    tagtype_id: 1,
    project_id: 1,
    group_1_id: 1,
    group_2_id: 1,
    group_3_id: 1,
    reference_document: 'Foundation_Plan.pdf',
    description: 'Foundation inspection point 1',
    or_phase_id: 1,
    non_crit: 0,
    color: '#FF0000',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    tagType: mockTagTypes[0]
  },
  {
    id: 2,
    created_by: 1,
    name: 'S-001',
    tagtype_id: 2,
    project_id: 1,
    group_1_id: 2,
    group_2_id: 2,
    group_3_id: 2,
    reference_document: 'Structural_Plan.pdf',
    description: 'Structural inspection point 1',
    or_phase_id: 2,
    non_crit: 0,
    color: '#00FF00',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    tagType: mockTagTypes[1]
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 1,
    client_id: 1,
    name: 'Downtown Office Complex',
    number: 1001,
    description: 'Modern 15-story office building with retail space on ground floor',
    is_active: true,
    actual_hours_required: false,
    completion_date: '2024-12-31',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    client: mockClients[0]
  },
  {
    id: 2,
    client_id: 2,
    name: 'Residential Tower Project',
    number: 1002,
    description: '25-story luxury residential tower with amenities',
    is_active: true,
    actual_hours_required: false,
    completion_date: '2025-06-30',
    created_at: '2024-01-20T11:00:00Z',
    updated_at: '2024-01-20T11:00:00Z',
    client: mockClients[1]
  },
  {
    id: 3,
    client_id: 3,
    name: 'Shopping Center Development',
    number: 1003,
    description: 'Multi-level shopping center with parking structure',
    is_active: false,
    actual_hours_required: false,
    completion_date: '2024-08-15',
    created_at: '2024-02-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z',
    client: mockClients[2]
  }
];

// Mock Tasklists for Templates
export const mockTasklists: Tasklist[] = [
  {
    id: 1,
    task: 'Foundation excavation depth meets specification requirements',
    template_id: 1,
    ordinal: 1,
    bol_subtitle: false,
    bol_signature: false,
    takes_input: false
  },
  {
    id: 2,
    task: 'Concrete strength test results: __ MPa (minimum required: 25 MPa)',
    template_id: 1,
    ordinal: 2,
    bol_subtitle: false,
    bol_signature: false,
    takes_input: true
  },
  {
    id: 3,
    task: 'Foundation reinforcement spacing: __ mm (specified: 200mm)',
    template_id: 1,
    ordinal: 3,
    bol_subtitle: false,
    bol_signature: false,
    takes_input: true
  },
  {
    id: 4,
    task: 'Foundation Inspection',
    template_id: 1,
    ordinal: 4,
    bol_subtitle: true,
    bol_signature: false,
    takes_input: false
  },
  {
    id: 5,
    task: 'Foundation waterproofing membrane installation complete',
    template_id: 1,
    ordinal: 5,
    bol_subtitle: false,
    bol_signature: true,
    takes_input: false
  },
  {
    id: 6,
    task: 'Structural steel erection alignment within tolerance',
    template_id: 2,
    ordinal: 1,
    bol_subtitle: false,
    bol_signature: false,
    takes_input: false
  },
  {
    id: 7,
    task: 'Steel connection bolt torque: __ Nm (specified: 400 Nm)',
    template_id: 2,
    ordinal: 2,
    bol_subtitle: false,
    bol_signature: false,
    takes_input: true
  },
  {
    id: 8,
    task: 'Structural Inspection',
    template_id: 2,
    ordinal: 3,
    bol_subtitle: true,
    bol_signature: false,
    takes_input: false
  },
  {
    id: 9,
    task: 'Structural welding inspection complete',
    template_id: 2,
    ordinal: 4,
    bol_subtitle: false,
    bol_signature: true,
    takes_input: false
  }
];

// Mock Templates with Tasks
export const mockTemplates: Template[] = [
  {
    id: 1,
    template_version_id: 1,
    template_number: 'TEMP-001',
    name: 'Foundation Inspection',
    descriptive_name: 'Comprehensive foundation inspection template',
    discipline_code_id: 1,
    scope_id: 1,
    phase_id: 1,
    vendor_id: 1,
    hours: 8.0,
    rev: 'A',
    rev_date: '2024-01-01',
    takes_input: true,
    frequency: 'Weekly',
    duedate_frequency: 7,
    description: 'Foundation inspection checklist for construction projects',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    templateVersion: mockTemplateVersions[0],
    disciplineCode: mockDisciplineCodes[0],
    scope: mockScopes[0],
    phase: mockPhases[0],
    vendor: mockVendors[0],
    tasks: mockTasklists.filter(t => t.template_id === 1)
  },
  {
    id: 2,
    template_version_id: 1,
    template_number: 'TEMP-002',
    name: 'Structural Steel Inspection',
    descriptive_name: 'Structural steel erection and welding inspection',
    discipline_code_id: 1,
    scope_id: 1,
    phase_id: 2,
    vendor_id: 1,
    hours: 6.0,
    rev: 'A',
    rev_date: '2024-01-01',
    takes_input: true,
    frequency: 'Daily',
    duedate_frequency: 1,
    description: 'Structural steel inspection checklist',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    templateVersion: mockTemplateVersions[0],
    disciplineCode: mockDisciplineCodes[0],
    scope: mockScopes[0],
    phase: mockPhases[1],
    vendor: mockVendors[0],
    tasks: mockTasklists.filter(t => t.template_id === 2)
  }
];

// Mock Checksheets
export const mockChecksheets: Checksheet[] = [
  {
    id: 1,
    created_by: 1,
    name: 'Foundation Check 1',
    template_id: 1,
    tag_id: 1,
    project_id: 1,
    status: false,
    user_id: 2,
    status_date: '2024-01-20',
    description: 'Foundation inspection for section A',
    notes: 'Initial inspection completed, minor issues found',
    vendor_id: 1,
    checked_out: 0,
    duedate: '2024-01-25',
    overdue: false,
    is_void: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:00:00Z',
    project: mockProjects[0],
    template: mockTemplates[0],
    user: mockUsers[1],
    tag: mockTags[0],
    vendor: mockVendors[0]
  },
  {
    id: 2,
    created_by: 1,
    name: 'Structural Check 1',
    template_id: 2,
    tag_id: 2,
    project_id: 1,
    status: true,
    user_id: 2,
    status_date: '2024-01-22',
    description: 'Structural inspection for main frame',
    notes: 'All structural elements verified and approved',
    vendor_id: 2,
    checked_out: 0,
    duedate: '2024-01-28',
    overdue: false,
    is_void: false,
    created_at: '2024-01-18T11:00:00Z',
    updated_at: '2024-01-22T16:00:00Z',
    project: mockProjects[0],
    template: mockTemplates[1],
    user: mockUsers[1],
    tag: mockTags[1],
    vendor: mockVendors[1]
  }
];

// Mock Punchlists
export const mockPunchlists: Punchlist[] = [
  {
    id: 1,
    sequence: 1,
    name: 'Foundation Crack Repair',
    tag_id: 1,
    scope_id: 1,
    discipline_code_id: 1,
    description: 'Minor crack found in foundation wall',
    notes: 'Requires epoxy injection repair',
    originator_user_id: 2,
    created_by: 'SJ',
    punch_level: 'Medium',
    status: 'Open',
    open_date: '2024-01-20',
    due_date: '2024-01-27',
    project_id: 1,
    pl_reference: 'PL-001',
    hours_exp: 4.0,
    cost: 500.00,
    vendor_id: 1,
    checked_out: false,
    created_at: '2024-01-20T14:00:00Z',
    updated_at: '2024-01-20T14:00:00Z',
    project: mockProjects[0],
    tag: mockTags[0],
    scope: mockScopes[0],
    department: mockDisciplineCodes[0],
    originatorUser: mockUsers[1]
  },
  {
    id: 2,
    sequence: 2,
    name: 'Structural Beam Alignment',
    tag_id: 2,
    scope_id: 2,
    discipline_code_id: 2,
    description: 'Beam alignment needs adjustment',
    notes: 'Minor adjustment required for proper alignment',
    originator_user_id: 2,
    created_by: 'SJ',
    punch_level: 'Low',
    status: 'In Progress',
    open_date: '2024-01-22',
    due_date: '2024-01-29',
    project_id: 1,
    pl_reference: 'PL-002',
    hours_exp: 2.0,
    cost: 300.00,
    vendor_id: 2,
    checked_out: false,
    created_at: '2024-01-22T16:00:00Z',
    updated_at: '2024-01-22T16:00:00Z',
    project: mockProjects[0],
    tag: mockTags[1],
    scope: mockScopes[1],
    department: mockDisciplineCodes[1],
    originatorUser: mockUsers[1]
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  total_projects: 3,
  active_projects: 2,
  pending_checksheets: 1,
  open_punchlists: 2,
  recent_activities: [
    {
      id: 1,
      type: 'checksheet_completed',
      description: 'Foundation Check 1 completed by Sarah Johnson',
      timestamp: '2024-01-20T14:00:00Z',
      project: mockProjects[0]
    },
    {
      id: 2,
      type: 'punchlist_created',
      description: 'New punchlist created for Foundation Crack Repair',
      timestamp: '2024-01-20T14:00:00Z',
      project: mockProjects[0]
    },
    {
      id: 3,
      type: 'project_updated',
      description: 'Downtown Office Complex progress updated',
      timestamp: '2024-01-19T16:00:00Z',
      project: mockProjects[0]
    }
  ]
};

// Mock API Responses
export const mockApiResponses = {
  login: {
    user: mockUsers[0],
    token: 'mock_jwt_token_12345',
    expires_at: '2024-12-31T23:59:59Z'
  },
  projects: mockProjects,
  checksheets: mockChecksheets,
  punchlists: mockPunchlists,
  templates: mockTemplates,
  dashboard: mockDashboardStats
};

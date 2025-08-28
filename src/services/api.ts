import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LoginCredentials,
  AuthResponse,
  User,
  Project,
  Checksheet,
  Punchlist,
  Template,
  DashboardStats,
  ChecksheetStatus,
  ChecksheetHour,
  ChecksheetAttachment,
  FileUpload,
  ChecksheetFilter,
  Notification,
  Tasklist,
  SoftData,
  ChecksheetTaskResponse
} from '../types';
import { mockApiResponses, mockUsers, mockVendors, mockScopes, mockDisciplineCodes } from './mockData';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string = 'http://arbiter.contendoapps.local/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear storage
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
      }
    );
  }

  // Mock login - simulates API call
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.email === 'demo@arbiter.com' && credentials.password === 'password') {
      const response = mockApiResponses.login;
      await AsyncStorage.setItem('auth_token', response.token);
      await AsyncStorage.setItem('user_data', JSON.stringify(response.user));
      return response;
    } else {
      throw new Error('Invalid credentials. Use demo@arbiter.com / password');
    }
  }

  // Mock logout
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  // Mock get profile
  async getProfile(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const userData = await AsyncStorage.getItem('user_data');
    if (userData) {
      return JSON.parse(userData);
    }
    throw new Error('User not found');
  }

  // Advanced Reporting Methods

  // Weekly Reports
  async getWeeklyReports(projectId?: number, date?: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock weekly reports data
    return [
      {
        id: 1,
        project_id: projectId || 1,
        week_start_date: '2024-01-15',
        week_end_date: '2024-01-21',
        total_checksheets: 45,
        completed_checksheets: 38,
        total_punchlists: 12,
        resolved_punchlists: 8,
        total_hours: 156.5,
        notes: 'Good progress this week. All major milestones on track.',
        created_at: '2024-01-21T10:00:00Z',
        updated_at: '2024-01-21T10:00:00Z',
      }
    ];
  }

  async createWeeklyReport(data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Weekly report created successfully' };
  }

  async updateWeeklyReport(id: number, data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Weekly report updated successfully' };
  }

  // KPI Reports
  async getKPIReports(projectId?: number, dateRange?: { start: string; end: string }): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock KPI reports data
    return [
      {
        id: 1,
        project_id: projectId || 1,
        report_date: '2024-01-21',
        checksheets_completed: 156,
        checksheets_total: 180,
        completion_percentage: 87,
        punchlists_open: 23,
        punchlists_resolved: 45,
        punchlists_total: 68,
        hours_logged: 1247.5,
        hours_required: 1500,
        efficiency_score: 92,
        created_at: '2024-01-21T10:00:00Z',
        updated_at: '2024-01-21T10:00:00Z',
      }
    ];
  }

  async generateKPIReport(projectId: number, period: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: 'KPI report generated successfully' };
  }

  // Custom Check Reports
  async getCustomCheckReports(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock custom check reports data
    return [
      {
        id: 1,
        user_id: 1,
        name: 'Mechanical Systems Report',
        filters: JSON.stringify({ discipline: 'mechanical', status: 'completed' }),
        report_type: 'discipline',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      }
    ];
  }

  async createCustomCheckReport(data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Custom check report created successfully' };
  }

  async updateCustomCheckReport(id: number, data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'Custom check report updated successfully' };
  }

  async deleteCustomCheckReport(id: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'Custom check report deleted successfully' };
  }

  async runCustomCheckReport(id: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'Report generated successfully', data: [] };
  }

  // File Management
  async getFiles(projectId?: number, category?: string): Promise<FileUpload[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock files data
    return [
      {
        id: 1,
        file_name: 'Project_Specifications.pdf',
        file_path: '/files/specs/project_specs.pdf',
        file_size: 2048576,
        mime_type: 'application/pdf',
        uploaded_by: 1,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
      }
    ];
  }

  async uploadFile(file: any, projectId: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'File uploaded successfully' };
  }

  async deleteFile(fileId: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: 'File deleted successfully' };
  }

  async downloadFile(fileId: number): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, message: 'File download started' };
  }

  // Export Methods
  async exportWeeklyReport(id: number, format: string = 'pdf'): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'Report exported successfully', downloadUrl: 'mock-url' };
  }

  async exportKPIReport(id: number, format: string = 'excel'): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'KPI report exported successfully', downloadUrl: 'mock-url' };
  }

  async exportCustomCheckReport(id: number, format: string = 'pdf'): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, message: 'Custom report exported successfully', downloadUrl: 'mock-url' };
  }



  // Mock get projects
  async getProjects(page: number = 1, search?: string, status?: string): Promise<{ data: Project[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    let filteredProjects = [...mockApiResponses.projects];

    // Apply search filter
    if (search) {
      filteredProjects = filteredProjects.filter(project =>
        project.name?.toLowerCase().includes(search.toLowerCase()) ||
        project.number?.toString().includes(search) ||
        project.client?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status === 'active') {
      filteredProjects = filteredProjects.filter(project => project.is_active);
    } else if (status === 'inactive') {
      filteredProjects = filteredProjects.filter(project => !project.is_active);
    }

    return {
      data: filteredProjects,
      total: filteredProjects.length
    };
  }

  // Mock get single project
  async getProject(id: number): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = mockApiResponses.projects.find(p => p.id === id);
    if (project) {
      return project;
    }
    throw new Error('Project not found');
  }

  // Mock get checksheets with enhanced filtering
  async getChecksheets(
    page: number = 1,
    search?: string,
    status?: string,
    projectId?: number,
    templateId?: number,
    inspectorId?: number,
    vendorId?: number,
    dueDateFrom?: string,
    dueDateTo?: string,
    overdue?: boolean
  ): Promise<{ data: Checksheet[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    let filteredChecksheets = [...mockApiResponses.checksheets];

    // Apply search filter
    if (search) {
      filteredChecksheets = filteredChecksheets.filter(checksheet =>
        checksheet.project?.name?.toLowerCase().includes(search.toLowerCase()) ||
        checksheet.template?.name.toLowerCase().includes(search.toLowerCase()) ||
        checksheet.user?.first_name.toLowerCase().includes(search.toLowerCase()) ||
        checksheet.user?.last_name.toLowerCase().includes(search.toLowerCase()) ||
        checksheet.name?.toLowerCase().includes(search.toLowerCase()) ||
        checksheet.notes?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status === 'completed') {
      filteredChecksheets = filteredChecksheets.filter(checksheet => checksheet.status === true);
    } else if (status === 'pending') {
      filteredChecksheets = filteredChecksheets.filter(checksheet => checksheet.status === false);
    }

    // Apply project filter
    if (projectId) {
      filteredChecksheets = filteredChecksheets.filter(checksheet => checksheet.project_id === projectId);
    }

    // Apply template filter
    if (templateId) {
      filteredChecksheets = filteredChecksheets.filter(checksheet => checksheet.template_id === templateId);
    }

    // Apply inspector filter
    if (inspectorId) {
      filteredChecksheets = filteredChecksheets.filter(checksheet => checksheet.user_id === inspectorId);
    }

    // Apply vendor filter
    if (vendorId) {
      filteredChecksheets = filteredChecksheets.filter(checksheet => checksheet.vendor_id === vendorId);
    }

    // Apply due date range filter
    if (dueDateFrom) {
      filteredChecksheets = filteredChecksheets.filter(checksheet =>
        checksheet.duedate && new Date(checksheet.duedate) >= new Date(dueDateFrom)
      );
    }

    if (dueDateTo) {
      filteredChecksheets = filteredChecksheets.filter(checksheet =>
        checksheet.duedate && new Date(checksheet.duedate) <= new Date(dueDateTo)
      );
    }

    // Apply overdue filter
    if (overdue !== undefined) {
      filteredChecksheets = filteredChecksheets.filter(checksheet => checksheet.overdue === overdue);
    }

    return {
      data: filteredChecksheets,
      total: filteredChecksheets.length
    };
  }

  // Mock get single checksheet
  async getChecksheet(id: number): Promise<Checksheet> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const checksheet = mockApiResponses.checksheets.find(c => c.id === id);
    if (checksheet) {
      return checksheet;
    }
    throw new Error('Checksheet not found');
  }

  // Mock get punchlists with enhanced filtering
  async getPunchlists(
    page: number = 1,
    search?: string,
    status?: string,
    priority?: string,
    projectId?: number,
    scopeId?: number,
    disciplineId?: number,
    originatorId?: number,
    dueDateFrom?: string,
    dueDateTo?: string,
    costFrom?: number,
    costTo?: number
  ): Promise<{ data: Punchlist[], total: number }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    let filteredPunchlists = [...mockApiResponses.punchlists];

    // Apply search filter
    if (search) {
      filteredPunchlists = filteredPunchlists.filter(punchlist =>
        punchlist.name.toLowerCase().includes(search.toLowerCase()) ||
        punchlist.project?.name?.toLowerCase().includes(search.toLowerCase()) ||
        punchlist.originatorUser?.first_name.toLowerCase().includes(search.toLowerCase()) ||
        punchlist.originatorUser?.last_name.toLowerCase().includes(search.toLowerCase()) ||
        punchlist.description?.toLowerCase().includes(search.toLowerCase()) ||
        punchlist.pl_reference?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredPunchlists = filteredPunchlists.filter(punchlist => punchlist.status === status);
    }

    // Apply priority filter (using punch_level)
    if (priority && priority !== 'all') {
      filteredPunchlists = filteredPunchlists.filter(punchlist => punchlist.punch_level === priority);
    }

    // Apply project filter
    if (projectId) {
      filteredPunchlists = filteredPunchlists.filter(punchlist => punchlist.project_id === projectId);
    }

    // Apply scope filter
    if (scopeId) {
      filteredPunchlists = filteredPunchlists.filter(punchlist => punchlist.scope_id === scopeId);
    }

    // Apply discipline filter
    if (disciplineId) {
      filteredPunchlists = filteredPunchlists.filter(punchlist => punchlist.discipline_code_id === disciplineId);
    }

    // Apply originator filter
    if (originatorId) {
      filteredPunchlists = filteredPunchlists.filter(punchlist => punchlist.originator_user_id === originatorId);
    }

    // Apply due date range filter
    if (dueDateFrom) {
      filteredPunchlists = filteredPunchlists.filter(punchlist =>
        punchlist.due_date && new Date(punchlist.due_date) >= new Date(dueDateFrom)
      );
    }

    if (dueDateTo) {
      filteredPunchlists = filteredPunchlists.filter(punchlist =>
        punchlist.due_date && new Date(punchlist.due_date) <= new Date(dueDateTo)
      );
    }

    // Apply cost range filter
    if (costFrom !== undefined) {
      filteredPunchlists = filteredPunchlists.filter(punchlist =>
        punchlist.cost && punchlist.cost >= costFrom
      );
    }

    if (costTo !== undefined) {
      filteredPunchlists = filteredPunchlists.filter(punchlist =>
        punchlist.cost && punchlist.cost <= costTo
      );
    }

    return {
      data: filteredPunchlists,
      total: filteredPunchlists.length
    };
  }

  // Mock get single punchlist
  async getPunchlist(id: number): Promise<Punchlist> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const punchlist = mockApiResponses.punchlists.find(p => p.id === id);
    if (punchlist) {
      return punchlist;
    }
    throw new Error('Punchlist not found');
  }

  // Mock get templates
  async getTemplates(): Promise<Template[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockApiResponses.templates;
  }

  // Mock get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockApiResponses.dashboard;
  }

  // Mock update checksheet status
  async updateChecksheetStatus(checksheetId: number, status: boolean, userId: number): Promise<ChecksheetStatus> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newStatus: ChecksheetStatus = {
      id: Math.floor(Math.random() * 1000),
      checksheet_id: checksheetId,
      type: 'S',
      status: status ? 1 : 0,
      user_id: userId,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newStatus;
  }

  // Mock add checksheet hours
  async addChecksheetHours(checksheetId: number, hours: number, userId: number, notes?: string): Promise<ChecksheetHour> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newHours: ChecksheetHour = {
      id: Math.floor(Math.random() * 1000),
      checksheet_id: checksheetId,
      user_id: userId,
      hours: hours,
      date: new Date().toISOString().split('T')[0],
      notes: notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newHours;
  }

  // Mock upload file attachment
  async uploadChecksheetAttachment(checksheetId: number, file: FileUpload, userId: number): Promise<ChecksheetAttachment> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAttachment: ChecksheetAttachment = {
      id: Math.floor(Math.random() * 1000),
      checksheet_id: checksheetId,
      file_name: file.file_name,
      file_path: file.file_path,
      file_size: file.file_size,
      mime_type: file.mime_type,
      uploaded_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newAttachment;
  }

  // Mock get checksheet attachments
  async getChecksheetAttachments(checksheetId: number): Promise<ChecksheetAttachment[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Mock attachments
    return [
      {
        id: 1,
        checksheet_id: checksheetId,
        file_name: 'inspection_photo_1.jpg',
        file_path: '/uploads/checksheets/1/photo1.jpg',
        file_size: 2048576,
        mime_type: 'image/jpeg',
        uploaded_by: 2,
        created_at: '2024-01-20T14:00:00Z',
        updated_at: '2024-01-20T14:00:00Z'
      },
      {
        id: 2,
        checksheet_id: checksheetId,
        file_name: 'inspection_report.pdf',
        file_path: '/uploads/checksheets/1/report.pdf',
        file_size: 1048576,
        mime_type: 'application/pdf',
        uploaded_by: 2,
        created_at: '2024-01-20T14:00:00Z',
        updated_at: '2024-01-20T14:00:00Z'
      }
    ];
  }

  // Mock update punchlist status
  async updatePunchlistStatus(punchlistId: number, status: string, userId: number): Promise<Punchlist> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const punchlist = mockApiResponses.punchlists.find(p => p.id === punchlistId);
    if (!punchlist) {
      throw new Error('Punchlist not found');
    }

    const updatedPunchlist: Punchlist = {
      ...punchlist,
      status: status,
      updated_at: new Date().toISOString()
    };

    if (status === 'Closed') {
      updatedPunchlist.close_user_id = userId;
      updatedPunchlist.closed_date = new Date().toISOString().split('T')[0];
    }

    return updatedPunchlist;
  }

  // Mock get user notifications
  async getUserNotifications(userId: number): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
      {
        id: 1,
        user_id: userId,
        type: 'checksheet_assigned',
        title: 'New Checksheet Assigned',
        message: 'You have been assigned a new foundation inspection checksheet',
        read: false,
        created_at: '2024-01-20T14:00:00Z',
        updated_at: '2024-01-20T14:00:00Z'
      },
      {
        id: 2,
        user_id: userId,
        type: 'punchlist_created',
        title: 'New Punchlist Item',
        message: 'A new punchlist item has been created for your project',
        read: false,
        created_at: '2024-01-20T13:00:00Z',
        updated_at: '2024-01-20T13:00:00Z'
      }
    ];
  }

  // Mock mark notification as read
  async markNotificationAsRead(notificationId: number): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      id: notificationId,
      user_id: 1,
      type: 'checksheet_assigned',
      title: 'New Checksheet Assigned',
      message: 'You have been assigned a new foundation inspection checksheet',
      read: true,
      created_at: '2024-01-20T14:00:00Z',
      updated_at: new Date().toISOString()
    };
  }

  // Mock save checksheet filter
  async saveChecksheetFilter(userId: number, name: string, filters: string): Promise<ChecksheetFilter> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newFilter: ChecksheetFilter = {
      id: Math.floor(Math.random() * 1000),
      user_id: userId,
      name: name,
      filters: filters,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newFilter;
  }

  // Mock get user saved filters
  async getUserSavedFilters(userId: number): Promise<ChecksheetFilter[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
      {
        id: 1,
        user_id: userId,
        name: 'My Active Checksheets',
        filters: JSON.stringify({ status: 'pending', project_id: 1 }),
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        user_id: userId,
        name: 'Foundation Inspections',
        filters: JSON.stringify({ template_id: 1, status: 'all' }),
        created_at: '2024-01-10T09:00:00Z',
        updated_at: '2024-01-10T09:00:00Z'
      }
    ];
  }

  // Checksheet Completion Methods
  async getChecksheetTasks(checksheetId: number): Promise<Tasklist[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Find the checksheet and get its template tasks
    const checksheet = mockApiResponses.checksheets.find(c => c.id === checksheetId);
    if (!checksheet || !checksheet.template) {
      return [];
    }

    return checksheet.template.tasks || [];
  }

  async saveTaskResponse(checksheetId: number, taskResponse: ChecksheetTaskResponse): Promise<SoftData> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newSoftData: SoftData = {
      id: Math.floor(Math.random() * 1000),
      sid: checksheetId,
      uid: 1, // Mock user ID
      checksheet_id: checksheetId,
      type: 'S',
      task_id: taskResponse.taskId,
      number: 0,
      response: taskResponse.response,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newSoftData;
  }

  async getChecksheetResponses(checksheetId: number): Promise<SoftData[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock responses for the checksheet
    return [
      {
        id: 1,
        sid: checksheetId,
        uid: 1,
        checksheet_id: checksheetId,
        type: 'S',
        task_id: 1,
        number: 0,
        response: '1', // Pass
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 2,
        sid: checksheetId,
        uid: 1,
        checksheet_id: checksheetId,
        type: 'S',
        task_id: 2,
        number: 1,
        response: '28.5', // Text input value
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ];
  }

  async completeChecksheet(checksheetId: number, userId: number): Promise<Checksheet> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const checksheet = mockApiResponses.checksheets.find(c => c.id === checksheetId);
    if (!checksheet) {
      throw new Error('Checksheet not found');
    }

    const updatedChecksheet: Checksheet = {
      ...checksheet,
      status: true, // Mark as completed
      status_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return updatedChecksheet;
  }

  // Get filter options for dropdowns (enhanced version)
  async getFilterOptions() {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      projects: mockApiResponses.projects.map(p => ({ id: p.id, name: p.name })),
      templates: mockApiResponses.templates.map(t => ({ id: t.id, name: t.name })),
      inspectors: mockUsers.map(u => ({ id: u.id, name: `${u.first_name} ${u.last_name}` })),
      vendors: mockVendors.map(v => ({ id: v.id, name: v.name })),
      scopes: mockScopes.map(s => ({ id: s.id, name: s.name })),
      disciplines: mockDisciplineCodes.map(d => ({ id: d.id, name: d.name })),
      statuses: [
        { value: 'Open', label: 'Open' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Resolved', label: 'Resolved' },
        { value: 'Closed', label: 'Closed' }
      ],
      priorities: [
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' }
      ]
    };
  }
}

export const api = new ApiService();

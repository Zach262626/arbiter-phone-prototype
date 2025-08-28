// User Types - matches Laravel User model exactly
export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    email_verified_at?: string;
    password?: string;
    picture?: string;
    role_id: number;
    remember_token?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    role?: Role;
    userArbiterAccessLevel?: UserArbiterAccessLevel;
    userSignature?: UserSignature;
    userProjects?: UserProject[];
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface UserArbiterAccessLevel {
    id: number;
    user_id: number;
    arbiter_access_level_id: number;
    created_at: string;
    updated_at: string;
}

export interface UserSignature {
    id: number;
    user_id: number;
    signature_data: string;
    created_at: string;
    updated_at: string;
}

export interface UserProject {
    id: number;
    user_id: number;
    project_id: number;
    created_at: string;
    updated_at: string;
}

// Project Types - matches Laravel Project model exactly
export interface Project {
    id: number;
    client_id: number;
    name?: string;
    number?: number;
    description?: string;
    is_active: boolean;
    actual_hours_required: boolean;
    completion_date?: string;
    created_at: string;
    updated_at: string;
    client?: Client;
    groupOnes?: Group_1[];
    groupTwos?: Group_2[];
    groupThrees?: Group_3[];
    groupingAlias?: GroupingAlias;
    vendorProject?: VendorProject[];
    checkoutPeriod?: ProjectCheckoutPeriod;
    punchLevels?: ProjectPunchLevel[];
}

export interface Client {
    id: number;
    name: string;
    logo?: string;
    created_at: string;
    updated_at: string;
}

export interface Group_1 {
    id: number;
    project_id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Group_2 {
    id: number;
    project_id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Group_3 {
    id: number;
    project_id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface GroupingAlias {
    id: number;
    project_id: number;
    alias: string;
    created_at: string;
    updated_at: string;
}

export interface VendorProject {
    id: number;
    project_id: number;
    vendor_id: number;
    created_at: string;
    updated_at: string;
}

export interface ProjectCheckoutPeriod {
    id: number;
    project_id: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export interface ProjectPunchLevel {
    id: number;
    project_id: number;
    level: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

// Checksheet Types - matches Laravel Checksheet model exactly
export interface Checksheet {
    id: number;
    created_by?: number;
    name: string;
    template_id: number;
    tag_id: number;
    project_id: number;
    status: boolean;
    user_id?: number;
    status_date?: string;
    description?: string;
    notes?: string;
    vendor_id: number;
    checked_out?: number;
    duedate?: string;
    overdue: boolean;
    is_void?: boolean;
    created_at: string;
    updated_at: string;
    project?: Project;
    template?: Template;
    user?: User;
    tag?: Tag;
    vendor?: Vendor;
    createdBy?: User;
    lastStatus?: ChecksheetStatus;
    statuses?: ChecksheetStatus[];
    checksheetHours?: ChecksheetHour[];
    softdata?: SoftData[];
    checksheetCheckout?: ChecksheetCheckout;
    punches?: Punchlist[];
    checksheetAttachments?: ChecksheetAttachment[];
}

export interface ChecksheetStatus {
    id: number;
    checksheet_id?: number;
    mda_checksheet_id?: number;
    type: string;
    status: number;
    user_id: number;
    date: string;
    created_at: string;
    updated_at: string;
}

export interface ChecksheetHour {
    id: number;
    checksheet_id: number;
    user_id: number;
    hours: number;
    date: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface ChecksheetCheckout {
    id: number;
    sheet_id: number;
    user_id: number;
    type: string;
    checkout_date: string;
    return_date?: string;
    created_at: string;
    updated_at: string;
}

export interface ChecksheetAttachment {
    id: number;
    checksheet_id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: number;
    created_at: string;
    updated_at: string;
}

export interface SoftData {
    id: number;
    checksheet_id: number;
    type: string;
    number: number;
    value: string;
    created_at: string;
    updated_at: string;
}

// Punchlist Types - matches Laravel Punchlist model exactly
export interface Punchlist {
    id: number;
    sequence?: number;
    name: string;
    tag_id?: number;
    mda_checksheet_id?: number;
    scope_id: number;
    discipline_code_id: number;
    description?: string;
    notes?: string;
    originator_user_id: number;
    created_by?: string;
    punch_level: string;
    status: string;
    close_user_id?: number;
    actions?: string;
    action_user_id?: number;
    open_date: string;
    due_date?: string;
    closed_date?: string;
    cleared_date?: string;
    close_initials?: string;
    comments?: string;
    project_id: number;
    pl_reference?: string;
    hours_exp: number;
    cost?: number;
    vendor_id: number;
    checked_out?: boolean;
    created_at: string;
    updated_at: string;
    project?: Project;
    tag?: Tag;
    mda?: MDAChecksheet;
    scope?: Scope;
    department?: DisciplineCode;
    checkout?: PunchlistCheckout;
    originatorUser?: User;
    closeUser?: User;
    actionUser?: User;
}

export interface PunchlistCheckout {
    id: number;
    punch_id: number;
    user_id: number;
    checkout_date: string;
    return_date?: string;
    created_at: string;
    updated_at: string;
}

export interface Scope {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface DisciplineCode {
    id: number;
    code: string;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface MDAChecksheet {
    id: number;
    template_id: number;
    project_id: number;
    tag_id: number;
    status: string;
    created_by: number;
    created_at: string;
    updated_at: string;
}

// Template Types - matches Laravel Template model exactly
export interface Template {
    id: number;
    template_version_id: number;
    template_number: string;
    name: string;
    descriptive_name: string;
    discipline_code_id?: number;
    scope_id: number;
    phase_id: number;
    vendor_id: number;
    hours: number;
    description?: string;
    rev: number;
    rev_date: string;
    takes_input: boolean;
    frequency?: number;
    duedate_frequency?: number;
    created_at: string;
    updated_at: string;
    disciplineCode?: DisciplineCode;
    vendor?: Vendor;
    templateVersion?: TemplateVersion;
    scope?: Scope;
    phase?: Phase;
    tasks?: Tasklist[];
    templateAttributes?: TemplateAttribute[];
    tableTemplates?: TableTemplate[];
}

export interface TemplateVersion {
    id: number;
    version: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Phase {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Tasklist {
    id: number;
    template_id: number;
    ordinal: number;
    task_name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface TemplateAttribute {
    id: number;
    template_id: number;
    attribute_id: number;
    value: string;
    created_at: string;
    updated_at: string;
}

export interface TableTemplate {
    id: number;
    template_id: number;
    table_name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

// Tag Types - matches Laravel Tag model exactly
export interface Tag {
    id: number;
    created_by?: number;
    name: string;
    tagtype_id: number;
    project_id: number;
    group_1_id: number;
    group_2_id?: number;
    group_3_id?: number;
    reference_document: string;
    description: string;
    or_phase_id: number;
    non_crit: number;
    color?: string;
    created_at: string;
    updated_at: string;
    tagType?: TagType;
    project?: Project;
    group1?: Group_1;
    group2?: Group_2;
    group3?: Group_3;
}

export interface TagType {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

// Vendor Types
export interface Vendor {
    id: number;
    name: string;
    contact_person?: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at: string;
    updated_at: string;
}

// Authentication Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    expires_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Navigation Types
export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    ProjectDetails: { projectId: number };
    ChecksheetDetails: { checksheetId: number };
    PunchlistDetails: { punchlistId: number };
    ChecksheetCompletion: { checksheetId: number };
    WeeklyReport: { projectId?: number; date?: string };
    KPIReport: { projectId?: number; dateRange?: { start: string; end: string } };
    CustomCheckReport: { projectId?: number; filters?: any };
    FileManagement: { projectId?: number; type?: string };
};

export type MainTabParamList = {
    Dashboard: undefined;
    Projects: undefined;
    Checksheets: undefined;
    Punchlists: undefined;
    Reports: undefined;
    Profile: undefined;
};

export interface DashboardStats {
    total_projects: number;
    active_projects: number;
    pending_checksheets: number;
    open_punchlists: number;
    recent_activities: Array<{
        id: number;
        type: string;
        description: string;
        timestamp: string;
        project: Project;
    }>;
}

// Additional types for missing functionality
export interface FileUpload {
    id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: number;
    created_at: string;
    updated_at: string;
}

export interface ChecksheetFilter {
    id: number;
    user_id: number;
    name: string;
    filters: string;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: number;
    user_id: number;
    type: string;
    title: string;
    message: string;
    read: boolean;
    created_at: string;
    updated_at: string;
}

// Checksheet Completion Types
export interface Tasklist {
  id: number;
  task: string;
  template_id: number;
  ordinal: number;
  bol_subtitle: boolean;
  bol_signature: boolean;
  takes_input: boolean;
  template?: Template;
}

export interface SoftData {
  id: number;
  sid: number;
  uid: number;
  checksheet_id: number;
  type: string;
  task_id: number;
  number: number;
  response: string;
  created_at: string;
  updated_at: string;
  tempData?: TempSoftData[];
}

export interface TempSoftData {
  id: number;
  soft_data_id: number;
  field_name: string;
  field_value: string;
  created_at: string;
  updated_at: string;
}

export interface ChecksheetCompletionData {
  checksheetId: number;
  taskId: number;
  response: string;
  notes?: string;
  signature?: string;
  photos?: string[];
  timestamp: string;
}

export interface ChecksheetTaskResponse {
  taskId: number;
  response: '1' | '2' | '3' | string; // 1=Pass, 2=Fail, 3=NA, or text input
  textInputs?: { [key: string]: string };
  notes?: string;
  photos?: string[];
  signature?: string;
}

// Advanced Reporting Types
export interface WeeklyReport {
    id: number;
    project_id: number;
    week_start_date: string;
    week_end_date: string;
    total_checksheets: number;
    completed_checksheets: number;
    total_punchlists: number;
    resolved_punchlists: number;
    total_hours: number;
    notes?: string;
    attachments?: FileUpload[];
    created_at: string;
    updated_at: string;
}

export interface KPIReport {
    id: number;
    project_id: number;
    report_date: string;
    checksheets_completed: number;
    checksheets_total: number;
    completion_percentage: number;
    punchlists_open: number;
    punchlists_resolved: number;
    punchlists_total: number;
    hours_logged: number;
    hours_required: number;
    efficiency_score: number;
    created_at: string;
    updated_at: string;
}

export interface CustomCheckReport {
    id: number;
    user_id: number;
    name: string;
    filters: string;
    report_type: string;
    created_at: string;
    updated_at: string;
}

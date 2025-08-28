import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Button,
  useTheme,
  ActivityIndicator,
  DataTable,
  Chip,
  TextInput,
  Checkbox,
  Divider,
  List,
  FAB,
  Portal,
  Dialog,
  Searchbar,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, CustomCheckReport, Project, Checksheet } from '../types';

type CustomCheckReportNavigationProp = StackNavigationProp<RootStackParamList, 'CustomCheckReport'>;
type CustomCheckReportRouteProp = RouteProp<RootStackParamList, 'CustomCheckReport'>;

const CustomCheckReportScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedReports, setSavedReports] = useState<CustomCheckReport[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    projectId: '',
    status: '',
    template: '',
    inspector: '',
    vendor: '',
    dateFrom: '',
    dateTo: '',
    overdue: false,
  });
  
  const navigation = useNavigation<CustomCheckReportNavigationProp>();
  const route = useRoute<CustomCheckReportRouteProp>();
  const theme = useTheme();

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReports: CustomCheckReport[] = [
        {
          id: 1,
          user_id: 1,
          name: 'Mechanical Systems Report',
          filters: JSON.stringify({ discipline: 'mechanical', status: 'completed' }),
          report_type: 'discipline',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          user_id: 1,
          name: 'Overdue Checksheets',
          filters: JSON.stringify({ overdue: true, status: 'open' }),
          report_type: 'status',
          created_at: '2024-01-10T10:00:00Z',
          updated_at: '2024-01-10T10:00:00Z',
        },
        {
          id: 3,
          user_id: 1,
          name: 'Vendor Performance',
          filters: JSON.stringify({ vendor: 'ABC Construction', dateRange: 'last30days' }),
          report_type: 'vendor',
          created_at: '2024-01-05T10:00:00Z',
          updated_at: '2024-01-05T10:00:00Z',
        },
      ];
      
      setSavedReports(mockReports);
      
      // Mock project data
      const mockProject: Project = {
        id: 1,
        client_id: 1,
        name: 'Downtown Office Complex',
        number: 2024001,
        description: 'Modern office complex with sustainable design',
        is_active: true,
        actual_hours_required: true,
        completion_date: '2024-06-30',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };
      
      setProject(mockProject);
    } catch (error) {
      console.error('Failed to load saved reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedReports();
    setRefreshing(false);
  };

  const handleCreateReport = () => {
    setShowCreateDialog(true);
  };

  const handleSaveReport = () => {
    // Save report logic here
    setShowCreateDialog(false);
    // Reset filters
    setFilters({
      projectId: '',
      status: '',
      template: '',
      inspector: '',
      vendor: '',
      dateFrom: '',
      dateTo: '',
      overdue: false,
    });
  };

  const handleRunReport = (report: CustomCheckReport) => {
    // Run report logic here
    console.log('Running report:', report.name);
  };

  const handleEditReport = (report: CustomCheckReport) => {
    // Edit report logic here
    console.log('Editing report:', report.name);
  };

  const handleDeleteReport = (report: CustomCheckReport) => {
    // Delete report logic here
    console.log('Deleting report:', report.name);
  };

  const filteredReports = savedReports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading custom reports...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Custom Check Reports</Title>
          <Paragraph style={styles.headerSubtitle}>
            Create and manage custom checksheet reports
          </Paragraph>
        </View>

        <View style={styles.content}>
          {/* Search */}
          <Searchbar
            placeholder="Search saved reports..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          {/* Saved Reports */}
          {filteredReports.map((report) => (
            <Card key={report.id} style={styles.reportCard}>
              <Card.Content>
                <View style={styles.reportHeader}>
                  <View style={styles.reportInfo}>
                    <Title style={styles.reportTitle}>{report.name}</Title>
                    <Text style={styles.reportType}>{report.report_type} Report</Text>
                    <Text style={styles.reportDate}>
                      Created: {new Date(report.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.reportActions}>
                    <Button
                      mode="contained"
                      compact
                      onPress={() => handleRunReport(report)}
                      style={styles.actionButton}
                    >
                      Run
                    </Button>
                    <Button
                      mode="outlined"
                      compact
                      onPress={() => handleEditReport(report)}
                      style={styles.actionButton}
                    >
                      Edit
                    </Button>
                    <Button
                      mode="outlined"
                      compact
                      onPress={() => handleDeleteReport(report)}
                      style={[styles.actionButton, styles.deleteButton]}
                    >
                      Delete
                    </Button>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}

          {filteredReports.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Ionicons name="document-outline" size={48} color="#ccc" />
                <Title style={styles.emptyTitle}>No Reports Found</Title>
                <Paragraph style={styles.emptyText}>
                  {searchQuery ? 'No reports match your search.' : 'Create your first custom report to get started.'}
                </Paragraph>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Create Report Dialog */}
      <Portal>
        <Dialog visible={showCreateDialog} onDismiss={() => setShowCreateDialog(false)}>
          <Dialog.Title>Create Custom Report</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Report Name"
              value={filters.projectId}
              onChangeText={(text) => setFilters({ ...filters, projectId: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Status Filter"
              value={filters.status}
              onChangeText={(text) => setFilters({ ...filters, status: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Template Filter"
              value={filters.template}
              onChangeText={(text) => setFilters({ ...filters, template: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Inspector Filter"
              value={filters.inspector}
              onChangeText={(text) => setFilters({ ...filters, inspector: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Vendor Filter"
              value={filters.vendor}
              onChangeText={(text) => setFilters({ ...filters, vendor: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Date From"
              value={filters.dateFrom}
              onChangeText={(text) => setFilters({ ...filters, dateFrom: text })}
              style={styles.dialogInput}
            />
            <TextInput
              label="Date To"
              value={filters.dateTo}
              onChangeText={(text) => setFilters({ ...filters, dateTo: text })}
              style={styles.dialogInput}
            />
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={filters.overdue ? 'checked' : 'unchecked'}
                onPress={() => setFilters({ ...filters, overdue: !filters.overdue })}
              />
              <Text style={styles.checkboxLabel}>Show overdue only</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onPress={handleSaveReport}>Save Report</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* FAB for creating new report */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateReport}
        label="New Report"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  reportCard: {
    marginBottom: 16,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reportInfo: {
    flex: 1,
    marginRight: 16,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  reportType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
  },
  reportActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButton: {
    minWidth: 60,
  },
  deleteButton: {
    borderColor: '#ff4444',
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    lineHeight: 20,
  },
  dialogInput: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default CustomCheckReportScreen;

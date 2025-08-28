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
  Divider,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, WeeklyReport, Project } from '../types';

type WeeklyReportNavigationProp = StackNavigationProp<RootStackParamList, 'WeeklyReport'>;
type WeeklyReportRouteProp = RouteProp<RootStackParamList, 'WeeklyReport'>;

const WeeklyReportScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string>('current');
  
  const navigation = useNavigation<WeeklyReportNavigationProp>();
  const route = useRoute<WeeklyReportRouteProp>();
  const theme = useTheme();

  useEffect(() => {
    loadWeeklyReport();
  }, [selectedWeek]);

  const loadWeeklyReport = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReport: WeeklyReport = {
        id: 1,
        project_id: route.params?.projectId || 1,
        week_start_date: '2024-01-15',
        week_end_date: '2024-01-21',
        total_checksheets: 45,
        completed_checksheets: 38,
        total_punchlists: 12,
        resolved_punchlists: 8,
        total_hours: 156.5,
        notes: 'Good progress this week. All major milestones on track.',
        attachments: [],
        created_at: '2024-01-21T10:00:00Z',
        updated_at: '2024-01-21T10:00:00Z',
      };
      
      setWeeklyReport(mockReport);
      
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
      console.error('Failed to load weekly report:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeeklyReport();
    setRefreshing(false);
  };

  const getCompletionPercentage = () => {
    if (!weeklyReport) return 0;
    return Math.round((weeklyReport.completed_checksheets / weeklyReport.total_checksheets) * 100);
  };

  const getPunchlistResolutionRate = () => {
    if (!weeklyReport) return 0;
    return Math.round((weeklyReport.resolved_punchlists / weeklyReport.total_punchlists) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading weekly report...</Text>
      </View>
    );
  }

  if (!weeklyReport) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load weekly report</Text>
        <Button mode="contained" onPress={loadWeeklyReport}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Weekly Report</Title>
        <Paragraph style={styles.headerSubtitle}>
          {project?.name} • Week of {formatDate(weeklyReport.week_start_date)}
        </Paragraph>
      </View>

      <View style={styles.content}>
        {/* Week Selector */}
        <Card style={styles.weekSelectorCard}>
          <Card.Content>
            <View style={styles.weekSelector}>
              <Button
                mode={selectedWeek === 'previous' ? 'contained' : 'outlined'}
                onPress={() => setSelectedWeek('previous')}
                style={styles.weekButton}
              >
                Previous Week
              </Button>
              <Button
                mode={selectedWeek === 'current' ? 'contained' : 'outlined'}
                onPress={() => setSelectedWeek('current')}
                style={styles.weekButton}
              >
                Current Week
              </Button>
              <Button
                mode={selectedWeek === 'next' ? 'contained' : 'outlined'}
                onPress={() => setSelectedWeek('next')}
                style={styles.weekButton}
              >
                Next Week
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Summary Stats */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Progress Summary</Title>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{weeklyReport.total_checksheets}</Text>
                <Text style={styles.statLabel}>Total Checksheets</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{weeklyReport.completed_checksheets}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{getCompletionPercentage()}%</Text>
                <Text style={styles.statLabel}>Completion Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{weeklyReport.total_hours}</Text>
                <Text style={styles.statLabel}>Hours Logged</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Punchlist Summary */}
        <Card style={styles.punchlistCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Punchlist Status</Title>
            <View style={styles.punchlistStats}>
              <View style={styles.punchlistItem}>
                <View style={styles.punchlistHeader}>
                  <Text style={styles.punchlistLabel}>Open</Text>
                  <Text style={[styles.punchlistCount, { color: theme.colors.error }]}>
                    {weeklyReport.total_punchlists - weeklyReport.resolved_punchlists}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${((weeklyReport.total_punchlists - weeklyReport.resolved_punchlists) / weeklyReport.total_punchlists) * 100}%`,
                        backgroundColor: theme.colors.error 
                      }
                    ]} 
                  />
                </View>
              </View>
              <View style={styles.punchlistItem}>
                <View style={styles.punchlistHeader}>
                  <Text style={styles.punchlistLabel}>Resolved</Text>
                  <Text style={[styles.punchlistCount, { color: theme.colors.success }]}>
                    {weeklyReport.resolved_punchlists}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${getPunchlistResolutionRate()}%`,
                        backgroundColor: theme.colors.success 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Detailed Breakdown */}
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Detailed Breakdown</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Category</DataTable.Title>
                <DataTable.Title numeric>Planned</DataTable.Title>
                <DataTable.Title numeric>Completed</DataTable.Title>
                <DataTable.Title numeric>Progress</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Mechanical</DataTable.Cell>
                <DataTable.Cell numeric>15</DataTable.Cell>
                <DataTable.Cell numeric>12</DataTable.Cell>
                <DataTable.Cell numeric>80%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Electrical</DataTable.Cell>
                <DataTable.Cell numeric>12</DataTable.Cell>
                <DataTable.Cell numeric>10</DataTable.Cell>
                <DataTable.Cell numeric>83%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Plumbing</DataTable.Cell>
                <DataTable.Cell numeric>8</DataTable.Cell>
                <DataTable.Cell numeric>7</DataTable.Cell>
                <DataTable.Cell numeric>88%</DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Structural</DataTable.Cell>
                <DataTable.Cell numeric>10</DataTable.Cell>
                <DataTable.Cell numeric>9</DataTable.Cell>
                <DataTable.Cell numeric>90%</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Card.Content>
        </Card>

        {/* Notes */}
        {weeklyReport.notes && (
          <Card style={styles.notesCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Notes</Title>
              <Paragraph style={styles.notesText}>{weeklyReport.notes}</Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="download"
            style={styles.actionButton}
            onPress={() => {/* Export report */}}
          >
            Export Report
          </Button>
          <Button
            mode="outlined"
            icon="share"
            style={styles.actionButton}
            onPress={() => {/* Share report */}}
          >
            Share Report
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
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
  weekSelectorCard: {
    marginBottom: 16,
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  summaryCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  punchlistCard: {
    marginBottom: 16,
  },
  punchlistStats: {
    gap: 16,
  },
  punchlistItem: {
    gap: 8,
  },
  punchlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  punchlistLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  punchlistCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailsCard: {
    marginBottom: 16,
  },
  notesCard: {
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
});

export default WeeklyReportScreen;

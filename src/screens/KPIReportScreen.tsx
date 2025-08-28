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
  ProgressBar,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, KPIReport, Project } from '../types';

type KPIReportNavigationProp = StackNavigationProp<RootStackParamList, 'KPIReport'>;
type KPIReportRouteProp = RouteProp<RootStackParamList, 'KPIReport'>;

const KPIReportScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpiReport, setKpiReport] = useState<KPIReport | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  
  const navigation = useNavigation<KPIReportNavigationProp>();
  const route = useRoute<KPIReportRouteProp>();
  const theme = useTheme();

  useEffect(() => {
    loadKPIReport();
  }, [selectedPeriod]);

  const loadKPIReport = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReport: KPIReport = {
        id: 1,
        project_id: route.params?.projectId || 1,
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
      };
      
      setKpiReport(mockReport);
      
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
      console.error('Failed to load KPI report:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadKPIReport();
    setRefreshing(false);
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 75) return theme.colors.warning;
    return theme.colors.error;
  };

  const getEfficiencyLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading KPI report...</Text>
      </View>
    );
  }

  if (!kpiReport) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load KPI report</Text>
        <Button mode="contained" onPress={loadKPIReport}>
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
        <Title style={styles.headerTitle}>KPI Report</Title>
        <Paragraph style={styles.headerSubtitle}>
          {project?.name} • {formatDate(kpiReport.report_date)}
        </Paragraph>
      </View>

      <View style={styles.content}>
        {/* Period Selector */}
        <Card style={styles.periodSelectorCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Reporting Period</Title>
            <View style={styles.periodSelector}>
              <Button
                mode={selectedPeriod === 'week' ? 'contained' : 'outlined'}
                onPress={() => setSelectedPeriod('week')}
                style={styles.periodButton}
              >
                Week
              </Button>
              <Button
                mode={selectedPeriod === 'month' ? 'contained' : 'outlined'}
                onPress={() => setSelectedPeriod('month')}
                style={styles.periodButton}
              >
                Month
              </Button>
              <Button
                mode={selectedPeriod === 'quarter' ? 'contained' : 'outlined'}
                onPress={() => setSelectedPeriod('quarter')}
                style={styles.periodButton}
              >
                Quarter
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Overall Efficiency Score */}
        <Card style={styles.efficiencyCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Overall Efficiency Score</Title>
            <View style={styles.efficiencyContainer}>
              <View style={styles.efficiencyScore}>
                <Text style={[styles.scoreNumber, { color: getEfficiencyColor(kpiReport.efficiency_score) }]}>
                  {kpiReport.efficiency_score}
                </Text>
                <Text style={styles.scoreLabel}>/ 100</Text>
              </View>
              <View style={styles.efficiencyDetails}>
                <Text style={[styles.efficiencyLabel, { color: getEfficiencyColor(kpiReport.efficiency_score) }]}>
                  {getEfficiencyLabel(kpiReport.efficiency_score)}
                </Text>
                <ProgressBar
                  progress={kpiReport.efficiency_score / 100}
                  color={getEfficiencyColor(kpiReport.efficiency_score)}
                  style={styles.efficiencyBar}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Checksheet Performance */}
        <Card style={styles.performanceCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Checksheet Performance</Title>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceNumber}>{kpiReport.checksheets_completed}</Text>
                <Text style={styles.performanceLabel}>Completed</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceNumber}>{kpiReport.checksheets_total}</Text>
                <Text style={styles.performanceLabel}>Total</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceNumber}>{kpiReport.completion_percentage}%</Text>
                <Text style={styles.performanceLabel}>Completion Rate</Text>
              </View>
            </View>
            <ProgressBar
              progress={kpiReport.completion_percentage / 100}
              color={theme.colors.primary}
              style={styles.performanceBar}
            />
          </Card.Content>
        </Card>

        {/* Punchlist Performance */}
        <Card style={styles.punchlistCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Punchlist Performance</Title>
            <View style={styles.punchlistStats}>
              <View style={styles.punchlistRow}>
                <View style={styles.punchlistInfo}>
                  <Text style={styles.punchlistLabel}>Open</Text>
                  <Text style={[styles.punchlistCount, { color: theme.colors.error }]}>
                    {kpiReport.punchlists_open}
                  </Text>
                </View>
                <View style={styles.punchlistInfo}>
                  <Text style={styles.punchlistLabel}>Resolved</Text>
                  <Text style={[styles.punchlistCount, { color: theme.colors.success }]}>
                    {kpiReport.punchlists_resolved}
                  </Text>
                </View>
                <View style={styles.punchlistInfo}>
                  <Text style={styles.punchlistLabel}>Total</Text>
                  <Text style={styles.punchlistCount}>
                    {kpiReport.punchlists_total}
                  </Text>
                </View>
              </View>
              <View style={styles.resolutionRate}>
                <Text style={styles.resolutionLabel}>
                  Resolution Rate: {Math.round((kpiReport.punchlists_resolved / kpiReport.punchlists_total) * 100)}%
                </Text>
                <ProgressBar
                  progress={kpiReport.punchlists_resolved / kpiReport.punchlists_total}
                  color={theme.colors.success}
                  style={styles.resolutionBar}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Hours Performance */}
        <Card style={styles.hoursCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Hours Performance</Title>
            <View style={styles.hoursContainer}>
              <View style={styles.hoursRow}>
                <View style={styles.hoursItem}>
                  <Text style={styles.hoursLabel}>Logged</Text>
                  <Text style={styles.hoursNumber}>{kpiReport.hours_logged}</Text>
                </View>
                <View style={styles.hoursItem}>
                  <Text style={styles.hoursLabel}>Required</Text>
                  <Text style={styles.hoursNumber}>{kpiReport.hours_required}</Text>
                </View>
                <View style={styles.hoursItem}>
                  <Text style={styles.hoursLabel}>Utilization</Text>
                  <Text style={styles.hoursNumber}>
                    {Math.round((kpiReport.hours_logged / kpiReport.hours_required) * 100)}%
                  </Text>
                </View>
              </View>
              <ProgressBar
                progress={kpiReport.hours_logged / kpiReport.hours_required}
                color={theme.colors.secondary}
                style={styles.hoursBar}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Trend Analysis */}
        <Card style={styles.trendCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Trend Analysis</Title>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Metric</DataTable.Title>
                <DataTable.Title numeric>Previous</DataTable.Title>
                <DataTable.Title numeric>Current</DataTable.Title>
                <DataTable.Title numeric>Change</DataTable.Title>
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Completion Rate</DataTable.Cell>
                <DataTable.Cell numeric>82%</DataTable.Cell>
                <DataTable.Cell numeric>87%</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: theme.colors.success }}>+5%</Text>
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Efficiency Score</DataTable.Cell>
                <DataTable.Cell numeric>88</DataTable.Cell>
                <DataTable.Cell numeric>92</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: theme.colors.success }}>+4</Text>
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell>Resolution Rate</DataTable.Cell>
                <DataTable.Cell numeric>65%</DataTable.Cell>
                <DataTable.Cell numeric>66%</DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={{ color: theme.colors.success }}>+1%</Text>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </Card.Content>
        </Card>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="download"
            style={styles.actionButton}
            onPress={() => {/* Export KPI report */}}
          >
            Export Report
          </Button>
          <Button
            mode="outlined"
            icon="chart-line"
            style={styles.actionButton}
            onPress={() => {/* View detailed charts */}}
          >
            View Charts
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
  periodSelectorCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  periodButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  efficiencyCard: {
    marginBottom: 16,
  },
  efficiencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  efficiencyScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
    marginLeft: 4,
  },
  efficiencyDetails: {
    flex: 1,
  },
  efficiencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  efficiencyBar: {
    height: 8,
    borderRadius: 4,
  },
  performanceCard: {
    marginBottom: 16,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  performanceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  performanceBar: {
    height: 8,
    borderRadius: 4,
  },
  punchlistCard: {
    marginBottom: 16,
  },
  punchlistStats: {
    gap: 16,
  },
  punchlistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  punchlistInfo: {
    alignItems: 'center',
    flex: 1,
  },
  punchlistLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  punchlistCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resolutionRate: {
    gap: 8,
  },
  resolutionLabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  resolutionBar: {
    height: 8,
    borderRadius: 4,
  },
  hoursCard: {
    marginBottom: 16,
  },
  hoursContainer: {
    gap: 16,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hoursItem: {
    alignItems: 'center',
    flex: 1,
  },
  hoursLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  hoursNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  hoursBar: {
    height: 8,
    borderRadius: 4,
  },
  trendCard: {
    marginBottom: 16,
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

export default KPIReportScreen;

import React from 'react';
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
  List,
  Divider,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';

type ReportsNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ReportsScreen: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation<ReportsNavigationProp>();
  const theme = useTheme();

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const reportOptions = [
    {
      id: 'weekly',
      title: 'Weekly Reports',
      description: 'View and generate weekly project progress reports',
      icon: 'calendar-outline',
      route: 'WeeklyReport',
      color: theme.colors.primary,
    },
    {
      id: 'kpi',
      title: 'KPI Reports',
      description: 'Key Performance Indicators and metrics',
      icon: 'trending-up-outline',
      route: 'KPIReport',
      color: theme.colors.secondary,
    },
    {
      id: 'custom',
      title: 'Custom Check Reports',
      description: 'Create and view custom checksheet reports',
      icon: 'analytics-outline',
      route: 'CustomCheckReport',
      color: theme.colors.tertiary,
    },
    {
      id: 'files',
      title: 'File Management',
      description: 'Manage project files and attachments',
      icon: 'folder-outline',
      route: 'FileManagement',
      color: theme.colors.error,
    },
  ];

  const handleReportPress = (route: string) => {
    navigation.navigate(route as any, {});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading reports...</Text>
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
        <Title style={styles.headerTitle}>Reports & Analytics</Title>
        <Paragraph style={styles.headerSubtitle}>
          Access comprehensive project reports and analytics
        </Paragraph>
      </View>

      <View style={styles.content}>
        {reportOptions.map((option) => (
          <Card
            key={option.id}
            style={[styles.reportCard, { borderLeftColor: option.color }]}
            onPress={() => handleReportPress(option.route)}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={option.color}
                  />
                </View>
                <View style={styles.cardText}>
                  <Title style={styles.cardTitle}>{option.title}</Title>
                  <Paragraph style={styles.cardDescription}>
                    {option.description}
                  </Paragraph>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.disabled}
                />
              </View>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>Quick Stats</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Active Reports</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Completion Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
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
  reportCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardContent: {
    paddingVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  infoCard: {
    marginTop: 8,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  },
});

export default ReportsScreen;

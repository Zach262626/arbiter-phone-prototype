import React, { useEffect, useState } from 'react';
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
  Badge,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { api } from '../services/api';
import { DashboardStats, Notification } from '../types';

type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const DashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<DashboardNavigationProp>();
  const theme = useTheme();

  const loadDashboardData = async () => {
    try {
      const [dashboardData, notificationsData] = await Promise.all([
        api.getDashboardStats(),
        api.getUserNotifications(1) // Mock user ID
      ]);
      setStats(dashboardData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'checksheet_completed':
        return '✅';
      case 'punchlist_created':
        return '📝';
      case 'project_updated':
        return '📊';
      case 'punchlist_resolved':
        return '✅';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return theme.colors.error;
      case 'In Progress':
        return theme.colors.warning;
      case 'Resolved':
        return theme.colors.success;
      case 'Closed':
        return theme.colors.primary;
      default:
        return theme.colors.disabled;
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
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
      <View style={styles.content}>
        {/* Header with Notifications */}
        <View style={styles.header}>
          <View>
            <Title style={styles.welcomeTitle}>Welcome to Arbiter</Title>
            <Paragraph style={styles.welcomeSubtitle}>
              Construction Project Management Dashboard
            </Paragraph>
          </View>
          <View style={styles.notificationContainer}>
            <IconButton
              icon="bell"
              size={24}
              onPress={() => {/* Navigate to notifications */ }}
            />
            {unreadNotificationsCount > 0 && (
              <Badge style={styles.notificationBadge}>
                {unreadNotificationsCount}
              </Badge>
            )}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{stats?.total_projects || 0}</Title>
              <Paragraph style={styles.statLabel}>Total Projects</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{stats?.active_projects || 0}</Title>
              <Paragraph style={styles.statLabel}>Active Projects</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{stats?.pending_checksheets || 0}</Title>
              <Paragraph style={styles.statLabel}>Pending Checksheets</Paragraph>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Title style={styles.statNumber}>{stats?.open_punchlists || 0}</Title>
              <Paragraph style={styles.statLabel}>Open Punchlists</Paragraph>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Projects' as any)}
                style={styles.actionButton}
                compact
              >
                View Projects
              </Button>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Checksheets' as any)}
                style={styles.actionButton}
                compact
              >
                View Checksheets
              </Button>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Punchlists' as any)}
                style={styles.actionButton}
                compact
              >
                View Punchlists
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activities */}
        <Card style={styles.activitiesCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recent Activities</Title>
            {stats?.recent_activities.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
                <View style={styles.activityContent}>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <Text style={styles.activityProject}>
                    {activity.project?.name}
                  </Text>
                  <Text style={styles.activityTime}>
                    {formatDate(activity.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Notifications Preview */}
        {notifications.length > 0 && (
          <Card style={styles.notificationsCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Recent Notifications</Title>
              {notifications.slice(0, 3).map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    {!notification.read && (
                      <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />
                    )}
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {formatDate(notification.created_at)}
                  </Text>
                </View>
              ))}
              {notifications.length > 3 && (
                <Button
                  mode="text"
                  onPress={() => {/* Navigate to all notifications */ }}
                  style={styles.viewAllButton}
                >
                  View All Notifications
                </Button>
              )}
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  quickActionsCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    marginBottom: 8,
    minHeight: 36,
    minWidth: 100,
    maxWidth: '48%',
  },
  activitiesCard: {
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityProject: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationsCard: {
    marginBottom: 20,
  },
  notificationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  viewAllButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default DashboardScreen;

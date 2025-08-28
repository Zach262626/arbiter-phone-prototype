import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { Card, Title, Text, Button, Chip, ActivityIndicator, Divider, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { Project } from '../types';
import { api } from '../services/api';

type ProjectDetailsRouteProp = RouteProp<RootStackParamList, 'ProjectDetails'>;

const ProjectDetailsScreen: React.FC = () => {
  const route = useRoute<ProjectDetailsRouteProp>();
  const navigation = useNavigation();
  const { projectId } = route.params;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.getProject(projectId);
      setProject(data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to load project details',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadProjectDetails();
    setIsRefreshing(false);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#4CAF50' : '#F44336';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading project details...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorTitle}>Project Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The project you're looking for doesn't exist or has been removed.
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Project Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.projectHeader}>
            <View style={styles.projectInfo}>
              <Title style={styles.projectName}>{project.name}</Title>
              <Text style={styles.projectNumber}>#{project.number}</Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(project.is_active) }}
              style={[styles.statusChip, { borderColor: getStatusColor(project.is_active) }]}
            >
              {getStatusText(project.is_active)}
            </Chip>
          </View>

          {project.description && (
            <Text style={styles.projectDescription}>{project.description}</Text>
          )}
        </Card.Content>
      </Card>

      {/* Project Details */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Project Details</Title>

          <List.Item
            title="Project Name"
            description={project.name}
            left={(props) => <List.Icon {...props} icon="folder" />}
          />

          <Divider />

          <List.Item
            title="Project Number"
            description={project.number}
            left={(props) => <List.Icon {...props} icon="tag" />}
          />

          <Divider />

          <List.Item
            title="Status"
            description={getStatusText(project.is_active)}
            left={(props) => <List.Icon {...props} icon="check-circle" />}
            right={() => (
              <Chip
                mode="outlined"
                textStyle={{ color: getStatusColor(project.is_active) }}
                style={[styles.statusChip, { borderColor: getStatusColor(project.is_active) }]}
              >
                {getStatusText(project.is_active)}
              </Chip>
            )}
          />

          {project.completion_date && (
            <>
              <Divider />
              <List.Item
                title="Completion Date"
                description={formatDate(project.completion_date)}
                left={(props) => <List.Icon {...props} icon="calendar" />}
              />
            </>
          )}

          {project.actual_hours_required && (
            <>
              <Divider />
              <List.Item
                title="Estimated Hours"
                description={`${project.actual_hours_required} hours`}
                left={(props) => <List.Icon {...props} icon="clock" />}
              />
            </>
          )}

          <Divider />

          <List.Item
            title="Created"
            description={formatDate(project.created_at)}
            left={(props) => <List.Icon {...props} icon="plus-circle" />}
          />

          <Divider />

          <List.Item
            title="Last Updated"
            description={formatDate(project.updated_at)}
            left={(props) => <List.Icon {...props} icon="update" />}
          />
        </Card.Content>
      </Card>

      {/* Client Information */}
      {project.client && (
        <Card style={styles.clientCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Client Information</Title>

            <List.Item
              title="Client Name"
              description={project.client.name}
              left={(props) => <List.Icon {...props} icon="business" />}
            />

            {project.client.contact_person && (
              <>
                <Divider />
                <List.Item
                  title="Contact Person"
                  description={project.client.contact_person}
                  left={(props) => <List.Icon {...props} icon="account" />}
                />
              </>
            )}

            {project.client.email && (
              <>
                <Divider />
                <List.Item
                  title="Email"
                  description={project.client.email}
                  left={(props) => <List.Icon {...props} icon="email" />}
                />
              </>
            )}

            {project.client.phone && (
              <>
                <Divider />
                <List.Item
                  title="Phone"
                  description={project.client.phone}
                  left={(props) => <List.Icon {...props} icon="phone" />}
                />
              </>
            )}

            {project.client.address && (
              <>
                <Divider />
                <List.Item
                  title="Address"
                  description={project.client.address}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                />
              </>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => {
                // TODO: Navigate to project checksheets
                Alert.alert('Coming Soon', 'View project checksheets functionality will be available soon!');
              }}
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              icon="checkmark-circle"
              compact
            >
              View Checksheets
            </Button>

            <Button
              mode="contained"
              onPress={() => {
                // TODO: Navigate to project punchlists
                Alert.alert('Coming Soon', 'View project punchlists functionality will be available soon!');
              }}
              style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
              icon="list"
              compact
            >
              View Punchlists
            </Button>
          </View>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => {
                // TODO: Navigate to project reports
                Alert.alert('Coming Soon', 'View project reports functionality will be available soon!');
              }}
              style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
              icon="chart-bar"
              compact
            >
              View Reports
            </Button>

            <Button
              mode="contained"
              onPress={() => {
                // TODO: Edit project functionality
                Alert.alert('Coming Soon', 'Edit project functionality will be available soon!');
              }}
              style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
              icon="pencil"
              compact
            >
              Edit Project
            </Button>
          </View>
        </Card.Content>
      </Card>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#007AFF',
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 24,
    marginBottom: 4,
  },
  projectNumber: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'monospace',
  },
  projectDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  detailsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  clientCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    gap: 8,
  },
  actionButton: {
    marginBottom: 8,
    minHeight: 36,
    minWidth: 120,
  },
});

export default ProjectDetailsScreen;

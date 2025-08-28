import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  List,
  Chip,
  ActivityIndicator,
  useTheme,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Checksheet } from '../types';
import { api } from '../services/api';

type ChecksheetDetailsRouteProp = RouteProp<RootStackParamList, 'ChecksheetDetails'>;
type ChecksheetDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ChecksheetDetails'>;

const ChecksheetDetailsScreen: React.FC = () => {
  const [checksheet, setChecksheet] = useState<Checksheet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation<ChecksheetDetailsNavigationProp>();
  const route = useRoute<ChecksheetDetailsRouteProp>();
  const theme = useTheme();

  const { checksheetId } = route.params;

  useEffect(() => {
    loadChecksheetDetails();
  }, [checksheetId]);

  const loadChecksheetDetails = async () => {
    try {
      setIsLoading(true);
      const data = await api.getChecksheet(checksheetId);
      setChecksheet(data);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to load checksheet details',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadChecksheetDetails();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: boolean) => {
    return status ? '#4CAF50' : '#FF9800';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Completed' : 'Pending';
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
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading checksheet details...</Text>
      </View>
    );
  }

  if (!checksheet) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorTitle}>Checksheet Not Found</Text>
        <Text style={styles.errorSubtitle}>
          The checksheet you're looking for doesn't exist or has been removed.
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
      {/* Checksheet Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.checksheetHeader}>
            <View style={styles.checksheetInfo}>
              <Title style={styles.checksheetName}>{checksheet.name}</Title>
              <Text style={styles.projectName}>
                {checksheet.project?.name || 'Unknown Project'}
              </Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(checksheet.status) }}
              style={[styles.statusChip, { borderColor: getStatusColor(checksheet.status) }]}
            >
              {getStatusText(checksheet.status)}
            </Chip>
          </View>

          {checksheet.description && (
            <Text style={styles.checksheetDescription}>{checksheet.description}</Text>
          )}
        </Card.Content>
      </Card>

      {/* Checksheet Details */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Checksheet Details</Title>

          <List.Item
            title="Checksheet Name"
            description={checksheet.name}
            left={(props) => <List.Icon {...props} icon="checkmark-circle" />}
          />

          <List.Item
            title="Template"
            description={checksheet.template?.name || 'N/A'}
            left={(props) => <List.Icon {...props} icon="file-document" />}
          />

          <List.Item
            title="Project"
            description={checksheet.project?.name || 'N/A'}
            left={(props) => <List.Icon {...props} icon="folder" />}
          />

          <List.Item
            title="Inspector"
            description={checksheet.user ? `${checksheet.user.first_name} ${checksheet.user.last_name}` : 'Unassigned'}
            left={(props) => <List.Icon {...props} icon="account" />}
          />

          {checksheet.vendor && (
            <List.Item
              title="Vendor"
              description={checksheet.vendor.name}
              left={(props) => <List.Icon {...props} icon="briefcase" />}
            />
          )}

          {checksheet.duedate && (
            <List.Item
              title="Due Date"
              description={formatDate(checksheet.duedate)}
              left={(props) => <List.Icon {...props} icon="calendar" />}
            />
          )}

          {checksheet.status_date && (
            <List.Item
              title="Status Date"
              description={formatDate(checksheet.status_date)}
              left={(props) => <List.Icon {...props} icon="clock" />}
            />
          )}
        </Card.Content>
      </Card>

      {/* Tag Information */}
      {checksheet.tag && (
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Tag Information</Title>

            <List.Item
              title="Tag Name"
              description={checksheet.tag.name}
              left={(props) => <List.Icon {...props} icon="tag" />}
            />

            <List.Item
              title="Tag Type"
              description={checksheet.tag.tagType?.name || 'N/A'}
              left={(props) => <List.Icon {...props} icon="tag-multiple" />}
            />

            <List.Item
              title="Reference Document"
              description={checksheet.tag.reference_document}
              left={(props) => <List.Icon {...props} icon="file-document" />}
            />

            <List.Item
              title="Description"
              description={checksheet.tag.description}
              left={(props) => <List.Icon {...props} icon="information" />}
            />
          </Card.Content>
        </Card>
      )}

      {/* Notes */}
      {checksheet.notes && (
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Notes</Title>
            <Text style={styles.notesText}>{checksheet.notes}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Actions */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Actions</Title>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => {
                // Navigate to edit checksheet
              }}
              style={styles.actionButton}
              icon="pencil"
              compact
            >
              Edit Checksheet
            </Button>

            <Button
              mode="outlined"
              onPress={() => {
                // Navigate to add hours
              }}
              style={styles.actionButton}
              icon="clock"
              compact
            >
              Add Hours
            </Button>

            <Button
              mode="outlined"
              onPress={() => {
                // Navigate to attachments
              }}
              style={styles.actionButton}
              icon="attachment"
              compact
            >
              View Attachments
            </Button>

            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate('ChecksheetCompletion' as any, { checksheetId: checksheet.id });
              }}
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              icon="check-circle"
              compact
            >
              Complete Checksheet
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
    marginTop: 16,
  },
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  checksheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checksheetInfo: {
    flex: 1,
    marginRight: 16,
  },
  checksheetName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    color: '#666',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  checksheetDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  detailsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notesText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
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
});

export default ChecksheetDetailsScreen;

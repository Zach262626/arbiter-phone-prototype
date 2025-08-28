import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  ScrollView,
} from 'react-native';
import { Card, Title, Text, Searchbar, Chip, ActivityIndicator, FAB, Button, Dialog, Portal, TextInput, Divider, Menu, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Checksheet, ChecksheetStatus, ChecksheetHour, ChecksheetAttachment } from '../types';
import { api } from '../services/api';

type ChecksheetsNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface FilterOption {
  id: number;
  name: string;
}

const ChecksheetsScreen: React.FC = () => {
  const [checksheets, setChecksheets] = useState<Checksheet[]>([]);
  const [filteredChecksheets, setFilteredChecksheets] = useState<Checksheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedInspector, setSelectedInspector] = useState<number | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [dueDateFrom, setDueDateFrom] = useState<string>('');
  const [dueDateTo, setDueDateTo] = useState<string>('');
  const [showOverdueOnly, setShowOverdueOnly] = useState<boolean>(false);

  // Filter options
  const [filterOptions, setFilterOptions] = useState<{
    projects: FilterOption[];
    templates: FilterOption[];
    inspectors: FilterOption[];
    vendors: FilterOption[];
  }>({ projects: [], templates: [], inspectors: [], vendors: [] });

  // UI states
  const [statusDialogVisible, setStatusDialogVisible] = useState(false);
  const [hoursDialogVisible, setHoursDialogVisible] = useState(false);
  const [filterDialogVisible, setFilterDialogVisible] = useState(false);
  const [selectedChecksheet, setSelectedChecksheet] = useState<Checksheet | null>(null);
  const [newStatus, setNewStatus] = useState<boolean>(false);
  const [newHours, setNewHours] = useState<string>('');
  const [hoursNotes, setHoursNotes] = useState<string>('');

  const navigation = useNavigation<ChecksheetsNavigationProp>();

  useEffect(() => {
    loadChecksheets();
    loadFilterOptions();
  }, []);

  useEffect(() => {
    filterChecksheets();
  }, [checksheets, searchQuery, selectedStatus, selectedProject, selectedTemplate, selectedInspector, selectedVendor, dueDateFrom, dueDateTo, showOverdueOnly]);

  const loadFilterOptions = async () => {
    try {
      const options = await api.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const loadChecksheets = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      }

      const response = await api.getChecksheets(
        page,
        searchQuery,
        selectedStatus === 'all' ? undefined : selectedStatus,
        selectedProject || undefined,
        selectedTemplate || undefined,
        selectedInspector || undefined,
        selectedVendor || undefined,
        dueDateFrom || undefined,
        dueDateTo || undefined,
        showOverdueOnly || undefined
      );

      if (append) {
        setChecksheets(prev => [...prev, ...response.data]);
      } else {
        setChecksheets(response.data);
      }

      setHasMore(response.total > (page * 10));
      setCurrentPage(page);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to load checksheets',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    await loadChecksheets(1, false);
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      loadChecksheets(currentPage + 1, true);
    }
  };

  const filterChecksheets = () => {
    let filtered = checksheets;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(checksheet =>
        checksheet.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checksheet.template?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checksheet.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checksheet.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus === 'completed') {
      filtered = filtered.filter(checksheet => checksheet.status === true);
    } else if (selectedStatus === 'pending') {
      filtered = filtered.filter(checksheet => checksheet.status === false);
    }

    // Filter by project
    if (selectedProject) {
      filtered = filtered.filter(checksheet => checksheet.project_id === selectedProject);
    }

    // Filter by template
    if (selectedTemplate) {
      filtered = filtered.filter(checksheet => checksheet.template_id === selectedTemplate);
    }

    // Filter by inspector
    if (selectedInspector) {
      filtered = filtered.filter(checksheet => checksheet.user_id === selectedInspector);
    }

    // Filter by vendor
    if (selectedVendor) {
      filtered = filtered.filter(checksheet => checksheet.vendor_id === selectedVendor);
    }

    // Filter by due date range
    if (dueDateFrom) {
      filtered = filtered.filter(checksheet =>
        checksheet.duedate && new Date(checksheet.duedate) >= new Date(dueDateFrom)
      );
    }

    if (dueDateTo) {
      filtered = filtered.filter(checksheet =>
        checksheet.duedate && new Date(checksheet.duedate) <= new Date(dueDateTo)
      );
    }

    // Filter by overdue
    if (showOverdueOnly) {
      filtered = filtered.filter(checksheet => checksheet.overdue === true);
    }

    setFilteredChecksheets(filtered);
  };

  const clearAllFilters = () => {
    setSelectedStatus('all');
    setSelectedProject(null);
    setSelectedTemplate(null);
    setSelectedInspector(null);
    setSelectedVendor(null);
    setDueDateFrom('');
    setDueDateTo('');
    setShowOverdueOnly(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedProject) count++;
    if (selectedTemplate) count++;
    if (selectedInspector) count++;
    if (selectedVendor) count++;
    if (dueDateFrom) count++;
    if (dueDateTo) count++;
    if (showOverdueOnly) count++;
    return count;
  };

  const getStatusColor = (status: boolean) => {
    return status ? '#4CAF50' : '#FF9800';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Completed' : 'Pending';
  };

  const handleStatusUpdate = async () => {
    if (!selectedChecksheet) return;

    try {
      await api.updateChecksheetStatus(selectedChecksheet.id, newStatus, 1);

      setChecksheets(prev => prev.map(c =>
        c.id === selectedChecksheet.id
          ? { ...c, status: newStatus }
          : c
      ));

      setStatusDialogVisible(false);
      setSelectedChecksheet(null);
      Alert.alert('Success', 'Checksheet status updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update checksheet status');
    }
  };

  const handleHoursAdd = async () => {
    if (!selectedChecksheet || !newHours) return;

    try {
      const hours = parseFloat(newHours);
      if (isNaN(hours) || hours <= 0) {
        Alert.alert('Error', 'Please enter a valid number of hours');
        return;
      }

      await api.addChecksheetHours(selectedChecksheet.id, hours, 1, hoursNotes);

      setHoursDialogVisible(false);
      setSelectedChecksheet(null);
      setNewHours('');
      setHoursNotes('');
      Alert.alert('Success', 'Hours added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add hours');
    }
  };

  const renderChecksheetItem = ({ item }: { item: Checksheet }) => (
    <Card style={styles.checksheetCard} onPress={() => navigation.navigate('ChecksheetDetails' as any, { checksheetId: item.id })}>
      <Card.Content>
        <View style={styles.checksheetHeader}>
          <Title style={styles.checksheetName}>{item.name}</Title>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(item.status) }}
            style={{ borderColor: getStatusColor(item.status) }}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>

        <View style={styles.checksheetInfo}>
          <Text style={styles.projectName}>
            <Text style={styles.label}>Project: </Text>
            {item.project?.name || 'N/A'}
          </Text>
          <Text style={styles.templateName}>
            <Text style={styles.label}>Template: </Text>
            {item.template?.name || 'N/A'}
          </Text>
          <Text style={styles.inspectorName}>
            <Text style={styles.label}>Inspector: </Text>
            {item.user ? `${item.user.first_name} ${item.user.last_name}` : 'Unassigned'}
          </Text>
          {item.duedate && (
            <Text style={styles.dueDate}>
              <Text style={styles.label}>Due Date: </Text>
              {new Date(item.duedate).toLocaleDateString()}
            </Text>
          )}
          {item.overdue && (
            <Text style={[styles.dueDate, { color: '#F44336', fontWeight: 'bold' }]}>
              ⚠️ OVERDUE
            </Text>
          )}
        </View>

        {item.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            <Text style={styles.label}>Notes: </Text>
            {item.notes}
          </Text>
        )}

        <View style={styles.checksheetActions}>
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedChecksheet(item);
              setNewStatus(!item.status);
              setStatusDialogVisible(true);
            }}
            style={styles.actionButton}
            compact
          >
            {item.status ? 'Mark Pending' : 'Mark Complete'}
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedChecksheet(item);
              setHoursDialogVisible(true);
            }}
            style={styles.actionButton}
            compact
          >
            Add Hours
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedChecksheet(item);
              // Navigate to attachments or show attachment dialog
            }}
            style={styles.actionButton}
            compact
          >
            Attachments
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate('ChecksheetCompletion' as any, { checksheetId: item.id });
            }}
            style={[styles.actionButton, styles.completeButton]}
            icon="check-circle"
            compact
          >
            Complete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No checksheets found</Text>
      <Text style={styles.emptySubtitle}>
        {getActiveFilterCount() > 0
          ? 'Try adjusting your filters or search criteria'
          : 'No checksheets have been created yet'
        }
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading checksheets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filters Header */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search checksheets..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <View style={styles.filtersRow}>
          <Button
            mode="outlined"
            onPress={() => setFilterDialogVisible(true)}
            icon="filter-variant"
            style={styles.advancedFilterButton}
            compact
          >
            Filters ({getActiveFilterCount()})
          </Button>
        </View>
      </View>

      {/* Checksheets List */}
      <FlatList
        data={filteredChecksheets}
        renderItem={renderChecksheetItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Advanced Filters Dialog */}
      <Portal>
        <Dialog visible={filterDialogVisible} onDismiss={() => setFilterDialogVisible(false)}>
          <Dialog.Title>Filters</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={styles.filterScrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                <Chip
                  selected={selectedStatus === 'all'}
                  onPress={() => setSelectedStatus('all')}
                  style={styles.filterOptionChip}
                >
                  All
                </Chip>
                <Chip
                  selected={selectedStatus === 'pending'}
                  onPress={() => setSelectedStatus('pending')}
                  style={styles.filterOptionChip}
                >
                  Pending
                </Chip>
                <Chip
                  selected={selectedStatus === 'completed'}
                  onPress={() => setSelectedStatus('completed')}
                  style={styles.filterOptionChip}
                >
                  Completed
                </Chip>
                <Chip
                  selected={showOverdueOnly}
                  onPress={() => setShowOverdueOnly(!showOverdueOnly)}
                  style={[styles.filterOptionChip, showOverdueOnly && { backgroundColor: '#F44336' }]}
                >
                  Overdue
                </Chip>
              </ScrollView>

              <Text style={styles.filterSectionTitle}>Project</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                <Chip
                  selected={selectedProject === null}
                  onPress={() => setSelectedProject(null)}
                  style={styles.filterOptionChip}
                >
                  All Projects
                </Chip>
                {filterOptions.projects && filterOptions.projects.map(project => (
                  <Chip
                    key={project.id}
                    selected={selectedProject === project.id}
                    onPress={() => setSelectedProject(project.id)}
                    style={styles.filterOptionChip}
                  >
                    {project.name}
                  </Chip>
                ))}
              </ScrollView>

              <Text style={styles.filterSectionTitle}>Template</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                <Chip
                  selected={selectedTemplate === null}
                  onPress={() => setSelectedTemplate(null)}
                  style={styles.filterOptionChip}
                >
                  All Templates
                </Chip>
                {filterOptions.templates && filterOptions.templates.map(template => (
                  <Chip
                    key={template.id}
                    selected={selectedTemplate === template.id}
                    onPress={() => setSelectedTemplate(template.id)}
                    style={styles.filterOptionChip}
                  >
                    {template.name}
                  </Chip>
                ))}
              </ScrollView>

              <Text style={styles.filterSectionTitle}>Inspector</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                <Chip
                  selected={selectedInspector === null}
                  onPress={() => setSelectedInspector(null)}
                  style={styles.filterOptionChip}
                >
                  All Inspectors
                </Chip>
                {filterOptions.inspectors && filterOptions.inspectors.map(inspector => (
                  <Chip
                    key={inspector.id}
                    selected={selectedInspector === inspector.id}
                    onPress={() => setSelectedInspector(inspector.id)}
                    style={styles.filterOptionChip}
                  >
                    {inspector.name}
                  </Chip>
                ))}
              </ScrollView>

              <Text style={styles.filterSectionTitle}>Vendor</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                <Chip
                  selected={selectedVendor === null}
                  onPress={() => setSelectedVendor(null)}
                  style={styles.filterOptionChip}
                >
                  All Vendors
                </Chip>
                {filterOptions.vendors && filterOptions.vendors.map(vendor => (
                  <Chip
                    key={vendor.id}
                    selected={selectedVendor === vendor.id}
                    onPress={() => setSelectedVendor(vendor.id)}
                    style={styles.filterOptionChip}
                  >
                    {vendor.name}
                  </Chip>
                ))}
              </ScrollView>

              <Text style={styles.filterSectionTitle}>Due Date Range</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  label="From Date (YYYY-MM-DD)"
                  value={dueDateFrom}
                  onChangeText={setDueDateFrom}
                  style={styles.dateInput}
                  placeholder="2024-01-01"
                />
                <TextInput
                  label="To Date (YYYY-MM-DD)"
                  value={dueDateTo}
                  onChangeText={setDueDateTo}
                  style={styles.dateInput}
                  placeholder="2024-12-31"
                />
              </View>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={clearAllFilters}>Clear All</Button>
            <Button onPress={() => setFilterDialogVisible(false)}>Apply</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Status Update Dialog */}
      <Portal>
        <Dialog visible={statusDialogVisible} onDismiss={() => setStatusDialogVisible(false)}>
          <Dialog.Title>Update Checksheet Status</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to mark this checksheet as{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {newStatus ? 'completed' : 'pending'}
              </Text>?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setStatusDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleStatusUpdate}>Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Hours Dialog */}
      <Portal>
        <Dialog visible={hoursDialogVisible} onDismiss={() => setHoursDialogVisible(false)}>
          <Dialog.Title>Add Hours</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Hours"
              value={newHours}
              onChangeText={setNewHours}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Notes (optional)"
              value={hoursNotes}
              onChangeText={setHoursNotes}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setHoursDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleHoursAdd}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* FAB for creating new checksheet */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {/* Navigate to create checksheet */ }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    elevation: 2,
  },
  searchBar: {
    marginBottom: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  filtersContainer: {
    flex: 1,
    marginRight: 10,
  },
  filterChip: {
    marginRight: 8,
  },
  advancedFilterButton: {
    alignSelf: 'center',
  },
  listContainer: {
    padding: 16,
  },
  checksheetCard: {
    marginBottom: 16,
    elevation: 2,
  },
  checksheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checksheetName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  checksheetInfo: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#666',
  },
  projectName: {
    fontSize: 16,
    marginBottom: 4,
  },
  templateName: {
    fontSize: 16,
    marginBottom: 4,
  },
  inspectorName: {
    fontSize: 16,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 16,
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  checksheetActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 4,
    marginTop: 12,
  },
  actionButton: {
    marginHorizontal: 2,
    marginBottom: 8,
    minHeight: 36,
    minWidth: 80,
    maxWidth: '48%',
  },
  completeButton: {
    backgroundColor: '#4CAF50', // A green color for completion
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  dateInputContainer: {
    marginTop: 16,
  },
  dateInput: {
    marginBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterOptionChip: {
    marginRight: 8,
  },
  filterScrollView: {
    maxHeight: 400, // Increased height for better scrolling
  },
});

export default ChecksheetsScreen;

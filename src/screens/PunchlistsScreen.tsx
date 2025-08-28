import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    ScrollView,
} from 'react-native';
import { Card, Title, Text, Searchbar, Chip, ActivityIndicator, FAB, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Punchlist } from '../types';
import { api } from '../services/api';

type PunchlistsNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface FilterOption {
    id: number;
    name: string;
}

const PunchlistsScreen: React.FC = () => {
    const [punchlists, setPunchlists] = useState<Punchlist[]>([]);
    const [filteredPunchlists, setFilteredPunchlists] = useState<Punchlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filter states
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedPriority, setSelectedPriority] = useState<string>('all');
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [selectedScope, setSelectedScope] = useState<number | null>(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState<number | null>(null);
    const [selectedOriginator, setSelectedOriginator] = useState<number | null>(null);
    const [dueDateFrom, setDueDateFrom] = useState<string>('');
    const [dueDateTo, setDueDateTo] = useState<string>('');
    const [costFrom, setCostFrom] = useState<string>('');
    const [costTo, setCostTo] = useState<string>('');

    // Filter options
    const [filterOptions, setFilterOptions] = useState<{
        projects: FilterOption[];
        scopes: FilterOption[];
        disciplines: FilterOption[];
        originators: FilterOption[];
    }>({ projects: [], scopes: [], disciplines: [], originators: [] });

    // UI states
    const [statusDialogVisible, setStatusDialogVisible] = useState(false);
    const [filterDialogVisible, setFilterDialogVisible] = useState(false);
    const [selectedPunchlist, setSelectedPunchlist] = useState<Punchlist | null>(null);
    const [newStatus, setNewStatus] = useState<string>('');
    const [statusNotes, setStatusNotes] = useState<string>('');

    const navigation = useNavigation<PunchlistsNavigationProp>();

    useEffect(() => {
        loadPunchlists();
        loadFilterOptions();
    }, []);

    useEffect(() => {
        filterPunchlists();
    }, [punchlists, searchQuery, selectedStatus, selectedPriority, selectedProject, selectedScope, selectedDiscipline, selectedOriginator, dueDateFrom, dueDateTo, costFrom, costTo]);

    const loadFilterOptions = async () => {
        try {
            const options = await api.getFilterOptions();
            setFilterOptions(options);
        } catch (error) {
            console.error('Failed to load filter options:', error);
        }
    };

    const loadPunchlists = async (page: number = 1, append: boolean = false) => {
        try {
            if (page === 1) {
                setIsLoading(true);
            }

            const response = await api.getPunchlists(
                page,
                searchQuery,
                selectedStatus === 'all' ? undefined : selectedStatus,
                selectedPriority === 'all' ? undefined : selectedPriority,
                selectedProject || undefined,
                selectedScope || undefined,
                selectedDiscipline || undefined,
                selectedOriginator || undefined,
                dueDateFrom || undefined,
                dueDateTo || undefined,
                costFrom ? parseFloat(costFrom) : undefined,
                costTo ? parseFloat(costTo) : undefined
            );

            if (append) {
                setPunchlists(prev => [...prev, ...response.data]);
            } else {
                setPunchlists(response.data);
            }

            setHasMore(response.total > (page * 10));
            setCurrentPage(page);
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to load punchlists',
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
        await loadPunchlists(1, false);
    };

    const loadMore = () => {
        if (hasMore && !isLoading) {
            loadPunchlists(currentPage + 1, true);
        }
    };

    const filterPunchlists = () => {
        let filtered = punchlists;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(punchlist =>
                punchlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                punchlist.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                punchlist.project?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                punchlist.originatorUser?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                punchlist.originatorUser?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                punchlist.pl_reference?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(punchlist => punchlist.status === selectedStatus);
        }

        // Filter by priority
        if (selectedPriority !== 'all') {
            filtered = filtered.filter(punchlist => punchlist.punch_level === selectedPriority);
        }

        // Filter by project
        if (selectedProject) {
            filtered = filtered.filter(punchlist => punchlist.project_id === selectedProject);
        }

        // Filter by scope
        if (selectedScope) {
            filtered = filtered.filter(punchlist => punchlist.scope_id === selectedScope);
        }

        // Filter by discipline
        if (selectedDiscipline) {
            filtered = filtered.filter(punchlist => punchlist.discipline_code_id === selectedDiscipline);
        }

        // Filter by originator
        if (selectedOriginator) {
            filtered = filtered.filter(punchlist => punchlist.originator_user_id === selectedOriginator);
        }

        // Filter by due date range
        if (dueDateFrom) {
            filtered = filtered.filter(punchlist =>
                punchlist.due_date && new Date(punchlist.due_date) >= new Date(dueDateFrom)
            );
        }

        if (dueDateTo) {
            filtered = filtered.filter(punchlist =>
                punchlist.due_date && new Date(punchlist.due_date) <= new Date(dueDateTo)
            );
        }

        // Filter by cost range
        if (costFrom) {
            const costFromNum = parseFloat(costFrom);
            if (!isNaN(costFromNum)) {
                filtered = filtered.filter(punchlist =>
                    punchlist.cost && punchlist.cost >= costFromNum
                );
            }
        }

        if (costTo) {
            const costToNum = parseFloat(costTo);
            if (!isNaN(costToNum)) {
                filtered = filtered.filter(punchlist =>
                    punchlist.cost && punchlist.cost <= costToNum
                );
            }
        }

        setFilteredPunchlists(filtered);
    };

    const clearAllFilters = () => {
        setSelectedStatus('all');
        setSelectedPriority('all');
        setSelectedProject(null);
        setSelectedScope(null);
        setSelectedDiscipline(null);
        setSelectedOriginator(null);
        setDueDateFrom('');
        setDueDateTo('');
        setCostFrom('');
        setCostTo('');
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (selectedStatus !== 'all') count++;
        if (selectedPriority !== 'all') count++;
        if (selectedProject) count++;
        if (selectedScope) count++;
        if (selectedDiscipline) count++;
        if (selectedOriginator) count++;
        if (dueDateFrom) count++;
        if (dueDateTo) count++;
        if (costFrom) count++;
        if (costTo) count++;
        return count;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return '#F44336';
            case 'In Progress': return '#FF9800';
            case 'Resolved': return '#4CAF50';
            case 'Closed': return '#9E9E9E';
            default: return '#666';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return '#F44336';
            case 'Medium': return '#FF9800';
            case 'Low': return '#4CAF50';
            default: return '#666';
        }
    };

    const getStatusText = (status: string) => status;
    const getPriorityText = (priority: string) => priority;

    const handleStatusUpdate = async () => {
        if (!selectedPunchlist || !newStatus) return;

        try {
            // Update local state immediately for better UX
            setPunchlists(prev => prev.map(p =>
                p.id === selectedPunchlist.id
                    ? { ...p, status: newStatus }
                    : p
            ));

            setStatusDialogVisible(false);
            setSelectedPunchlist(null);
            setNewStatus('');
            Alert.alert('Success', 'Punchlist status updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update punchlist status');
        }
    };

    const renderPunchlistItem = ({ item }: { item: Punchlist }) => (
        <Card style={styles.punchlistCard} onPress={() => navigation.navigate('PunchlistDetails' as any, { punchlistId: item.id })}>
            <Card.Content>
                <View style={styles.punchlistHeader}>
                    <Title style={styles.punchlistName}>{item.name}</Title>
                    <View style={styles.statusContainer}>
                        <Chip
                            mode="outlined"
                            textStyle={{ color: getStatusColor(item.status) }}
                            style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
                        >
                            {getStatusText(item.status)}
                        </Chip>
                        <Chip
                            mode="outlined"
                            textStyle={{ color: getPriorityColor(item.punch_level) }}
                            style={[styles.priorityChip, { borderColor: getPriorityColor(item.punch_level) }]}
                        >
                            {getPriorityText(item.punch_level)}
                        </Chip>
                    </View>
                </View>

                <View style={styles.punchlistInfo}>
                    <Text style={styles.projectName}>
                        <Text style={styles.label}>Project: </Text>
                        {item.project?.name || 'N/A'}
                    </Text>
                    <Text style={styles.scopeName}>
                        <Text style={styles.label}>Scope: </Text>
                        {item.scope?.name || 'N/A'}
                    </Text>
                    <Text style={styles.disciplineName}>
                        <Text style={styles.label}>Discipline: </Text>
                        {item.department?.name || 'N/A'}
                    </Text>
                    <Text style={styles.originatorName}>
                        <Text style={styles.label}>Originator: </Text>
                        {item.originatorUser ? `${item.originatorUser.first_name} ${item.originatorUser.last_name}` : 'N/A'}
                    </Text>
                    {item.due_date && (
                        <Text style={styles.dueDate}>
                            <Text style={styles.label}>Due Date: </Text>
                            {new Date(item.due_date).toLocaleDateString()}
                        </Text>
                    )}
                    {item.cost && (
                        <Text style={styles.cost}>
                            <Text style={styles.label}>Estimated Cost: </Text>
                            ${item.cost.toFixed(2)}
                        </Text>
                    )}
                    {item.hours_exp && (
                        <Text style={styles.hours}>
                            <Text style={styles.label}>Estimated Hours: </Text>
                            {item.hours_exp} hours
                        </Text>
                    )}
                </View>

                {item.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        <Text style={styles.label}>Description: </Text>
                        {item.description}
                    </Text>
                )}

                <View style={styles.punchlistActions}>
                    <Button
                        mode="outlined"
                        onPress={() => {
                            setSelectedPunchlist(item);
                            setNewStatus('');
                            setStatusDialogVisible(true);
                        }}
                        style={styles.actionButton}
                        compact
                    >
                        Update Status
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => {
                            // Navigate to punchlist details or show more actions
                        }}
                        style={styles.actionButton}
                        compact
                    >
                        View Details
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );

    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No punchlists found</Text>
            <Text style={styles.emptySubtitle}>
                {getActiveFilterCount() > 0
                    ? 'Try adjusting your filters or search criteria'
                    : 'No punchlists have been created yet'
                }
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading punchlists...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search and Filters Header */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search punchlists..."
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

            {/* Punchlists List */}
            <FlatList
                data={filteredPunchlists}
                renderItem={renderPunchlistItem}
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
                                    All Status
                                </Chip>
                                <Chip
                                    selected={selectedStatus === 'Open'}
                                    onPress={() => setSelectedStatus('Open')}
                                    style={styles.filterOptionChip}
                                >
                                    Open
                                </Chip>
                                <Chip
                                    selected={selectedStatus === 'In Progress'}
                                    onPress={() => setSelectedStatus('In Progress')}
                                    style={styles.filterOptionChip}
                                >
                                    In Progress
                                </Chip>
                                <Chip
                                    selected={selectedStatus === 'Resolved'}
                                    onPress={() => setSelectedStatus('Resolved')}
                                    style={styles.filterOptionChip}
                                >
                                    Resolved
                                </Chip>
                                <Chip
                                    selected={selectedStatus === 'Closed'}
                                    onPress={() => setSelectedStatus('Closed')}
                                    style={styles.filterOptionChip}
                                >
                                    Closed
                                </Chip>
                            </ScrollView>

                            <Text style={styles.filterSectionTitle}>Priority</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                                <Chip
                                    selected={selectedPriority === 'all'}
                                    onPress={() => setSelectedPriority('all')}
                                    style={styles.filterOptionChip}
                                >
                                    All Priority
                                </Chip>
                                <Chip
                                    selected={selectedPriority === 'High'}
                                    onPress={() => setSelectedPriority('High')}
                                    style={[styles.filterOptionChip, { borderColor: '#F44336' }]}
                                >
                                    High
                                </Chip>
                                <Chip
                                    selected={selectedPriority === 'Medium'}
                                    onPress={() => setSelectedPriority('Medium')}
                                    style={[styles.filterOptionChip, { borderColor: '#FF9800' }]}
                                >
                                    Medium
                                </Chip>
                                <Chip
                                    selected={selectedPriority === 'Low'}
                                    onPress={() => setSelectedPriority('Low')}
                                    style={styles.filterOptionChip}
                                >
                                    Low
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

                            <Text style={styles.filterSectionTitle}>Scope</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                                <Chip
                                    selected={selectedScope === null}
                                    onPress={() => setSelectedScope(null)}
                                    style={styles.filterOptionChip}
                                >
                                    All Scopes
                                </Chip>
                                {filterOptions.scopes && filterOptions.scopes.map(scope => (
                                    <Chip
                                        key={scope.id}
                                        selected={selectedScope === scope.id}
                                        onPress={() => setSelectedScope(scope.id)}
                                        style={styles.filterOptionChip}
                                    >
                                        {scope.name}
                                    </Chip>
                                ))}
                            </ScrollView>

                            <Text style={styles.filterSectionTitle}>Discipline</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                                <Chip
                                    selected={selectedDiscipline === null}
                                    onPress={() => setSelectedDiscipline(null)}
                                    style={styles.filterOptionChip}
                                >
                                    All Disciplines
                                </Chip>
                                {filterOptions.disciplines && filterOptions.disciplines.map(discipline => (
                                    <Chip
                                        key={discipline.id}
                                        selected={selectedDiscipline === discipline.id}
                                        onPress={() => setSelectedDiscipline(discipline.id)}
                                        style={styles.filterOptionChip}
                                    >
                                        {discipline.name}
                                    </Chip>
                                ))}
                            </ScrollView>

                            <Text style={styles.filterSectionTitle}>Originator</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptionsContainer}>
                                <Chip
                                    selected={selectedOriginator === null}
                                    onPress={() => setSelectedOriginator(null)}
                                    style={styles.filterOptionChip}
                                >
                                    All Originators
                                </Chip>
                                {filterOptions.originators && filterOptions.originators.map(originator => (
                                    <Chip
                                        key={originator.id}
                                        selected={selectedOriginator === originator.id}
                                        onPress={() => setSelectedOriginator(originator.id)}
                                        style={styles.filterOptionChip}
                                    >
                                        {originator.name}
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

                            <Text style={styles.filterSectionTitle}>Cost Range</Text>
                            <View style={styles.costInputContainer}>
                                <TextInput
                                    label="From Cost ($)"
                                    value={costFrom}
                                    onChangeText={setCostFrom}
                                    style={styles.costInput}
                                    placeholder="0.00"
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    label="To Cost ($)"
                                    value={costTo}
                                    onChangeText={setCostTo}
                                    style={styles.costInput}
                                    placeholder="10000.00"
                                    keyboardType="numeric"
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
                    <Dialog.Title>Update Punchlist Status</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="New Status"
                            value={newStatus}
                            onChangeText={setNewStatus}
                            style={styles.input}
                            placeholder="Enter new status"
                        />
                        <TextInput
                            label="Notes (optional)"
                            value={statusNotes}
                            onChangeText={setStatusNotes}
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                            placeholder="Add notes about the status change"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setStatusDialogVisible(false)}>Cancel</Button>
                        <Button onPress={handleStatusUpdate}>Update</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* FAB for creating new punchlist */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {/* Navigate to create punchlist */ }}
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
        marginBottom: 8,
    },
    filtersContainer: {
        flex: 1,
    },
    filterChip: {
        marginRight: 8,
    },
    advancedFilterButton: {
        alignSelf: 'center',
    },
    priorityFiltersContainer: {
        marginTop: 8,
    },
    listContainer: {
        padding: 16,
    },
    punchlistCard: {
        marginBottom: 16,
        elevation: 2,
    },
    punchlistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    punchlistName: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 12,
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusChip: {
        marginBottom: 8,
    },
    priorityChip: {
        marginBottom: 8,
    },
    punchlistInfo: {
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
    },
    projectName: {
        fontSize: 16,
        marginBottom: 4,
    },
    scopeName: {
        fontSize: 16,
        marginBottom: 4,
    },
    disciplineName: {
        fontSize: 16,
        marginBottom: 4,
    },
    originatorName: {
        fontSize: 16,
        marginBottom: 4,
    },
    dueDate: {
        fontSize: 16,
        marginBottom: 4,
    },
    cost: {
        fontSize: 16,
        marginBottom: 4,
    },
    hours: {
        fontSize: 16,
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    punchlistActions: {
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
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 16,
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
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    filterOptionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    filterOptionChip: {
        marginRight: 8,
        marginBottom: 8,
    },
    dateInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dateInput: {
        flex: 1,
        marginRight: 8,
    },
    costInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    costInput: {
        flex: 1,
        marginRight: 8,
    },
    input: {
        marginBottom: 16,
    },
    filterScrollView: {
        maxHeight: 400, // Increased height for better scrolling
    },
});

export default PunchlistsScreen;

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    ScrollView,
} from 'react-native';
import {
    Card,
    Title,
    Paragraph,
    Text,
    Searchbar,
    Chip,
    FAB,
    useTheme,
    ActivityIndicator,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { api } from '../services/api';
import { Project } from '../types';

type ProjectsNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ProjectsScreen: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const navigation = useNavigation<ProjectsNavigationProp>();
    const theme = useTheme();

    const loadProjects = async () => {
        try {
            const response = await api.getProjects(1, searchQuery, selectedStatus === 'all' ? undefined : selectedStatus);
            setProjects(response.data);
            setFilteredProjects(response.data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadProjects();
        setRefreshing(false);
    };

    useEffect(() => {
        loadProjects();
    }, [searchQuery, selectedStatus]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
    };

    const handleProjectPress = (project: Project) => {
        navigation.navigate('ProjectDetails', { projectId: project.id });
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? theme.colors.primary : theme.colors.error;
    };

    const getStatusText = (isActive: boolean) => {
        return isActive ? 'Active' : 'Inactive';
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'TBD';
        return new Date(dateString).toLocaleDateString();
    };

    const renderProjectItem = ({ item }: { item: Project }) => (
        <Card
            style={styles.projectCard}
            onPress={() => handleProjectPress(item)}
        >
            <Card.Content>
                <View style={styles.projectHeader}>
                    <View style={styles.projectInfo}>
                        <Title style={styles.projectName}>{item.name}</Title>
                        <Text style={styles.projectNumber}>{item.number}</Text>
                    </View>
                    <Chip
                        mode="outlined"
                        textStyle={{ color: getStatusColor(item.is_active) }}
                        style={[
                            styles.statusChip,
                            { borderColor: getStatusColor(item.is_active) }
                        ]}
                    >
                        {getStatusText(item.is_active)}
                    </Chip>
                </View>

                {item.description && (
                    <Paragraph style={styles.projectDescription}>
                        {item.description}
                    </Paragraph>
                )}

                <View style={styles.projectDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Client:</Text>
                        <Text style={styles.detailValue}>{item.client?.name || 'N/A'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Completion Date:</Text>
                        <Text style={styles.detailValue}>{formatDate(item.completion_date)}</Text>
                    </View>

                    {item.actual_hours_required && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Hours Required:</Text>
                            <Text style={styles.detailValue}>{item.actual_hours_required.toLocaleString()}</Text>
                        </View>
                    )}
                </View>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading projects...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search and Filters */}
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search projects..."
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Chip
                            selected={selectedStatus === 'all'}
                            onPress={() => handleStatusFilter('all')}
                            style={styles.filterChip}
                        >
                            All
                        </Chip>
                        <Chip
                            selected={selectedStatus === 'active'}
                            onPress={() => handleStatusFilter('active')}
                            style={styles.filterChip}
                        >
                            Active
                        </Chip>
                        <Chip
                            selected={selectedStatus === 'inactive'}
                            onPress={() => handleStatusFilter('inactive')}
                            style={styles.filterChip}
                        >
                            Inactive
                        </Chip>
                    </ScrollView>
                </View>
            </View>

            {/* Projects List */}
            <FlatList
                data={filteredProjects}
                renderItem={renderProjectItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No projects found</Text>
                        <Text style={styles.emptySubtext}>
                            {searchQuery ? 'Try adjusting your search terms' : 'No projects available'}
                        </Text>
                    </View>
                }
            />

            {/* FAB for adding new project */}
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                    // TODO: Implement add project functionality
                    console.log('Add project pressed');
                }}
            />
        </View>
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
    header: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchBar: {
        marginBottom: 16,
        elevation: 2,
    },
    filterContainer: {
        marginBottom: 8,
    },
    filterChip: {
        marginRight: 8,
    },
    listContainer: {
        padding: 16,
    },
    projectCard: {
        marginBottom: 16,
        elevation: 2,
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    projectNumber: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'monospace',
    },
    statusChip: {
        alignSelf: 'flex-start',
    },
    projectDescription: {
        marginBottom: 16,
        color: '#555',
        lineHeight: 20,
    },
    projectDetails: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
        textAlign: 'right',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default ProjectsScreen;

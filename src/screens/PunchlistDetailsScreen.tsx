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
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Punchlist } from '../types';
import { api } from '../services/api';

type PunchlistDetailsRouteProp = RouteProp<RootStackParamList, 'PunchlistDetails'>;
type PunchlistDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'PunchlistDetails'>;

const PunchlistDetailsScreen: React.FC = () => {
    const [punchlist, setPunchlist] = useState<Punchlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const navigation = useNavigation<PunchlistDetailsNavigationProp>();
    const route = useRoute<PunchlistDetailsRouteProp>();
    const theme = useTheme();

    const { punchlistId } = route.params;

    useEffect(() => {
        loadPunchlistDetails();
    }, [punchlistId]);

    const loadPunchlistDetails = async () => {
        try {
            setIsLoading(true);
            const data = await api.getPunchlist(punchlistId);
            setPunchlist(data);
        } catch (error) {
            Alert.alert(
                'Error',
                'Failed to load punchlist details',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadPunchlistDetails();
        setIsRefreshing(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open':
                return '#F44336';
            case 'In Progress':
                return '#FF9800';
            case 'Resolved':
                return '#4CAF50';
            case 'Closed':
                return '#2196F3';
            default:
                return '#666';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return '#F44336';
            case 'Medium':
                return '#FF9800';
            case 'Low':
                return '#4CAF50';
            default:
                return '#666';
        }
    };

    const getStatusText = (status: string) => {
        return status;
    };

    const getPriorityText = (priority: string) => {
        return priority;
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
                <Text style={styles.loadingText}>Loading punchlist details...</Text>
            </View>
        );
    }

    if (!punchlist) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={64} color="#F44336" />
                <Text style={styles.errorTitle}>Punchlist Not Found</Text>
                <Text style={styles.errorSubtitle}>
                    The punchlist you're looking for doesn't exist or has been removed.
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
            {/* Punchlist Header */}
            <Card style={styles.headerCard}>
                <Card.Content>
                    <View style={styles.punchlistHeader}>
                        <View style={styles.punchlistInfo}>
                            <Title style={styles.punchlistTitle}>{punchlist.name}</Title>
                            <Text style={styles.projectName}>
                                {punchlist.project?.name || 'Unknown Project'}
                            </Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Chip
                                mode="outlined"
                                textStyle={{ color: getStatusColor(punchlist.status) }}
                                style={[styles.statusChip, { borderColor: getStatusColor(punchlist.status) }]}
                            >
                                {getStatusText(punchlist.status)}
                            </Chip>
                            <Chip
                                mode="outlined"
                                textStyle={{ color: getPriorityColor(punchlist.punch_level) }}
                                style={[styles.priorityChip, { borderColor: getPriorityColor(punchlist.punch_level) }]}
                            >
                                {getPriorityText(punchlist.punch_level)}
                            </Chip>
                        </View>
                    </View>

                    {punchlist.description && (
                        <Text style={styles.punchlistDescription}>{punchlist.description}</Text>
                    )}
                </Card.Content>
            </Card>

            {/* Punchlist Details */}
            <Card style={styles.detailsCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Punchlist Details</Title>

                    <List.Item
                        title="Punchlist Name"
                        description={punchlist.name}
                        left={(props) => <List.Icon {...props} icon="format-list-checks" />}
                    />

                    <List.Item
                        title="Project"
                        description={punchlist.project?.name || 'N/A'}
                        left={(props) => <List.Icon {...props} icon="folder" />}
                    />

                    <List.Item
                        title="Scope"
                        description={punchlist.scope?.name || 'N/A'}
                        left={(props) => <List.Icon {...props} icon="target" />}
                    />

                    <List.Item
                        title="Discipline"
                        description={punchlist.department?.name || 'N/A'}
                        left={(props) => <List.Icon {...props} icon="account-group" />}
                    />

                    <List.Item
                        title="Originator"
                        description={punchlist.originatorUser ? `${punchlist.originatorUser.first_name} ${punchlist.originatorUser.last_name}` : 'Unknown'}
                        left={(props) => <List.Icon {...props} icon="account" />}
                    />

                    <List.Item
                        title="Open Date"
                        description={formatDate(punchlist.open_date)}
                        left={(props) => <List.Icon {...props} icon="calendar" />}
                    />

                    {punchlist.due_date && (
                        <List.Item
                            title="Due Date"
                            description={formatDate(punchlist.due_date)}
                            left={(props) => <List.Icon {...props} icon="clock" />}
                        />
                    )}

                    {punchlist.closed_date && (
                        <List.Item
                            title="Closed Date"
                            description={formatDate(punchlist.closed_date)}
                            left={(props) => <List.Icon {...props} icon="check-circle" />}
                        />
                    )}

                    {punchlist.pl_reference && (
                        <List.Item
                            title="Reference"
                            description={punchlist.pl_reference}
                            left={(props) => <List.Icon {...props} icon="tag" />}
                        />
                    )}
                </Card.Content>
            </Card>

            {/* Cost and Hours */}
            <Card style={styles.detailsCard}>
                <Card.Content>
                    <Title style={styles.sectionTitle}>Cost & Hours</Title>

                    <List.Item
                        title="Hours Estimated"
                        description={`${punchlist.hours_exp} hours`}
                        left={(props) => <List.Icon {...props} icon="clock" />}
                    />

                    {punchlist.cost && (
                        <List.Item
                            title="Estimated Cost"
                            description={`$${punchlist.cost.toFixed(2)}`}
                            left={(props) => <List.Icon {...props} icon="currency-usd" />}
                        />
                    )}
                </Card.Content>
            </Card>

            {/* Notes and Comments */}
            {punchlist.notes && (
                <Card style={styles.detailsCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Notes</Title>
                        <Text style={styles.notesText}>{punchlist.notes}</Text>
                    </Card.Content>
                </Card>
            )}

            {punchlist.comments && (
                <Card style={styles.detailsCard}>
                    <Card.Content>
                        <Title style={styles.sectionTitle}>Comments</Title>
                        <Text style={styles.notesText}>{punchlist.comments}</Text>
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
                                // Navigate to edit punchlist
                            }}
                            style={styles.actionButton}
                            icon="pencil"
                        >
                            Edit Punchlist
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => {
                                // Navigate to update status
                            }}
                            style={styles.actionButton}
                            icon="update"
                        >
                            Update Status
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => {
                                // Navigate to add comments
                            }}
                            style={styles.actionButton}
                            icon="comment"
                        >
                            Add Comment
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
    punchlistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    punchlistInfo: {
        flex: 1,
        marginRight: 16,
    },
    punchlistTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    projectName: {
        fontSize: 16,
        color: '#666',
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    statusChip: {
        marginBottom: 8,
    },
    priorityChip: {
        alignSelf: 'flex-start',
    },
    punchlistDescription: {
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
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
        marginBottom: 8,
    },
});

export default PunchlistDetailsScreen;

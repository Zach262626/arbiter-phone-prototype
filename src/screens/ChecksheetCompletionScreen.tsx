import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Alert,
    TextInput as RNTextInput,
} from 'react-native';
import {
    Card,
    Title,
    Text,
    Button,
    RadioButton,
    TextInput,
    useTheme,
    ActivityIndicator,
    Chip,
    Divider,
    IconButton,
    Portal,
    Dialog,
    Paragraph,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Checksheet, Tasklist, SoftData, ChecksheetTaskResponse } from '../types';
import { api } from '../services/api';

type ChecksheetCompletionRouteProp = RouteProp<RootStackParamList, 'ChecksheetCompletion'>;
type ChecksheetCompletionNavigationProp = StackNavigationProp<RootStackParamList, 'ChecksheetCompletion'>;

const ChecksheetCompletionScreen: React.FC = () => {
    const [checksheet, setChecksheet] = useState<Checksheet | null>(null);
    const [tasks, setTasks] = useState<Tasklist[]>([]);
    const [responses, setResponses] = useState<{ [taskId: number]: ChecksheetTaskResponse }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [photoDialogVisible, setPhotoDialogVisible] = useState(false);
    const [signatureDialogVisible, setSignatureDialogVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Tasklist | null>(null);
    const [notes, setNotes] = useState('');

    const navigation = useNavigation<ChecksheetCompletionNavigationProp>();
    const route = useRoute<ChecksheetCompletionRouteProp>();
    const theme = useTheme();

    const { checksheetId } = route.params;

    useEffect(() => {
        loadChecksheetData();
    }, [checksheetId]);

    const loadChecksheetData = async () => {
        try {
            setLoading(true);
            const [checksheetData, tasksData, responsesData] = await Promise.all([
                api.getChecksheet(checksheetId),
                api.getChecksheetTasks(checksheetId),
                api.getChecksheetResponses(checksheetId)
            ]);

            setChecksheet(checksheetData);
            setTasks(tasksData);

            // Initialize responses from existing data
            const initialResponses: { [taskId: number]: ChecksheetTaskResponse } = {};
            responsesData.forEach(response => {
                initialResponses[response.task_id] = {
                    taskId: response.task_id,
                    response: response.response,
                    notes: '',
                    photos: [],
                    signature: ''
                };
            });
            setResponses(initialResponses);
        } catch (error) {
            Alert.alert('Error', 'Failed to load checksheet data');
        } finally {
            setLoading(false);
        }
    };

    const handleTaskResponse = (taskId: number, response: '1' | '2' | '3') => {
        setResponses(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                taskId,
                response,
                textInputs: prev[taskId]?.textInputs || {}
            }
        }));
    };

    const handleTextInput = (taskId: number, inputIndex: number, value: string) => {
        setResponses(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                taskId,
                textInputs: {
                    ...prev[taskId]?.textInputs,
                    [inputIndex]: value
                }
            }
        }));
    };

    const handleNotesChange = (taskId: number, notes: string) => {
        setResponses(prev => ({
            ...prev,
            [taskId]: {
                ...prev[taskId],
                taskId,
                notes
            }
        }));
    };

    const handlePhotoCapture = (taskId: number) => {
        setSelectedTask(tasks.find(t => t.id === taskId) || null);
        setPhotoDialogVisible(true);
    };

    const handleSignatureCapture = (taskId: number) => {
        setSelectedTask(tasks.find(t => t.id === taskId) || null);
        setSignatureDialogVisible(true);
    };

    const saveTaskResponse = async (taskId: number) => {
        const response = responses[taskId];
        if (!response) return;

        try {
            await api.saveTaskResponse(checksheetId, response);
            Alert.alert('Success', 'Task response saved successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to save task response');
        }
    };

    const completeChecksheet = async () => {
        try {
            setSaving(true);

            // Save all responses
            for (const taskId of Object.keys(responses)) {
                await api.saveTaskResponse(checksheetId, responses[parseInt(taskId)]);
            }

            // Mark checksheet as complete
            await api.completeChecksheet(checksheetId, 1);

            Alert.alert(
                'Success',
                'Checksheet completed successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to complete checksheet');
        } finally {
            setSaving(false);
        }
    };

    const getResponseText = (response: string) => {
        switch (response) {
            case '1': return 'Pass';
            case '2': return 'Fail';
            case '3': return 'N/A';
            default: return response;
        }
    };

    const getResponseColor = (response: string) => {
        switch (response) {
            case '1': return '#4CAF50';
            case '2': return '#F44336';
            case '3': return '#FF9800';
            default: return '#666';
        }
    };

    const renderTaskItem = (task: Tasklist, index: number) => {
        const response = responses[task.id];
        const hasTextInputs = task.task.includes('__');
        const textInputCount = (task.task.match(/__/g) || []).length;

        return (
            <Card key={task.id} style={styles.taskCard}>
                <Card.Content>
                    {/* Task Header */}
                    <View style={styles.taskHeader}>
                        {task.bol_subtitle ? (
                            <Title style={styles.subtitleHeader}>{task.task}</Title>
                        ) : (
                            <View style={styles.taskRow}>
                                <Text style={styles.taskNumber}>{index + 1}</Text>
                                <Text style={styles.taskText}>{task.task}</Text>
                            </View>
                        )}
                    </View>

                    {/* Task Content */}
                    {!task.bol_subtitle && (
                        <>
                            {/* Text Inputs */}
                            {hasTextInputs && (
                                <View style={styles.textInputsContainer}>
                                    {Array.from({ length: textInputCount }, (_, i) => {
                                        const inputKey = i + 1;
                                        const currentValue = response?.textInputs?.[inputKey] || '';

                                        return (
                                            <View key={inputKey} style={styles.textInputRow}>
                                                <Text style={styles.inputLabel}>Input {inputKey}:</Text>
                                                <TextInput
                                                    mode="outlined"
                                                    value={currentValue}
                                                    onChangeText={(value) => handleTextInput(task.id, inputKey, value)}
                                                    style={styles.textInput}
                                                    placeholder="Enter value"
                                                />
                                            </View>
                                        );
                                    })}
                                </View>
                            )}

                            {/* Radio Buttons */}
                            {!hasTextInputs && (
                                <View style={styles.radioContainer}>
                                    <Text style={styles.radioLabel}>Select response:</Text>
                                    <RadioButton.Group
                                        onValueChange={(value) => handleTaskResponse(task.id, value as '1' | '2' | '3')}
                                        value={response?.response || ''}
                                    >
                                        <View style={styles.radioRow}>
                                            <RadioButton.Item label="Pass" value="1" />
                                            <RadioButton.Item label="Fail" value="2" />
                                            <RadioButton.Item label="N/A" value="3" />
                                        </View>
                                    </RadioButton.Group>
                                </View>
                            )}

                            {/* Notes */}
                            <View style={styles.notesContainer}>
                                <Text style={styles.notesLabel}>Notes:</Text>
                                <TextInput
                                    mode="outlined"
                                    value={response?.notes || ''}
                                    onChangeText={(value) => handleNotesChange(task.id, value)}
                                    placeholder="Add notes..."
                                    multiline
                                    numberOfLines={3}
                                    style={styles.notesInput}
                                />
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.actionButtons}>
                                <Button
                                    mode="outlined"
                                    onPress={() => handlePhotoCapture(task.id)}
                                    icon="camera"
                                    style={styles.actionButton}
                                    compact
                                >
                                    Photo
                                </Button>

                                {task.bol_signature && (
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleSignatureCapture(task.id)}
                                        icon="pencil"
                                        style={styles.actionButton}
                                        compact
                                    >
                                        Sign
                                    </Button>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={() => saveTaskResponse(task.id)}
                                    style={styles.actionButton}
                                    compact
                                >
                                    Save
                                </Button>
                            </View>

                            {/* Current Response Display */}
                            {response?.response && (
                                <View style={styles.responseDisplay}>
                                    <Chip
                                        mode="outlined"
                                        textStyle={{ color: getResponseColor(response.response) }}
                                        style={{ borderColor: getResponseColor(response.response) }}
                                    >
                                        {getResponseText(response.response)}
                                    </Chip>
                                </View>
                            )}
                        </>
                    )}
                </Card.Content>
            </Card>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading checksheet...</Text>
            </View>
        );
    }

    if (!checksheet || !tasks.length) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={64} color="#F44336" />
                <Text style={styles.errorTitle}>Checksheet Not Found</Text>
                <Text style={styles.errorSubtitle}>
                    The checksheet you're looking for doesn't exist or has no tasks.
                </Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const completedTasks = Object.keys(responses).length;
    const totalTasks = tasks.filter(t => !t.bol_subtitle).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <View style={styles.container}>
            {/* Header */}
            <Card style={styles.headerCard}>
                <Card.Content>
                    <Title style={styles.checksheetTitle}>{checksheet.name}</Title>
                    <Text style={styles.projectName}>
                        Project: {checksheet.project?.name || 'N/A'}
                    </Text>
                    <Text style={styles.templateName}>
                        Template: {checksheet.template?.name || 'N/A'}
                    </Text>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            Progress: {completedTasks} of {totalTasks} tasks completed
                        </Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                        <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                    </View>
                </Card.Content>
            </Card>

            {/* Tasks List */}
            <ScrollView style={styles.tasksContainer}>
                {tasks.map((task, index) => renderTaskItem(task, index))}
            </ScrollView>

            {/* Complete Button */}
            <View style={styles.completeButtonContainer}>
                <Button
                    mode="contained"
                    onPress={completeChecksheet}
                    disabled={saving || progress < 100}
                    loading={saving}
                    style={styles.completeButton}
                    icon="check-circle"
                >
                    {saving ? 'Completing...' : 'Complete Checksheet'}
                </Button>
                {progress < 100 && (
                    <Text style={styles.completeNote}>
                        Complete all tasks before finishing the checksheet
                    </Text>
                )}
            </View>

            {/* Photo Dialog */}
            <Portal>
                <Dialog visible={photoDialogVisible} onDismiss={() => setPhotoDialogVisible(false)}>
                    <Dialog.Title>Take Photo</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Photo capture functionality will be implemented here.
                            Task: {selectedTask?.task}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setPhotoDialogVisible(false)}>Close</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Signature Dialog */}
            <Portal>
                <Dialog visible={signatureDialogVisible} onDismiss={() => setSignatureDialogVisible(false)}>
                    <Dialog.Title>Capture Signature</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            Signature capture functionality will be implemented here.
                            Task: {selectedTask?.task}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setSignatureDialogVisible(false)}>Close</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    headerCard: {
        margin: 16,
        elevation: 2,
    },
    checksheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    projectName: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    templateName: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    progressContainer: {
        marginTop: 16,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    progressPercentage: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
    },
    tasksContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    taskCard: {
        marginBottom: 16,
        elevation: 2,
    },
    taskHeader: {
        marginBottom: 16,
    },
    subtitleHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
        textAlign: 'center',
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    taskNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginRight: 12,
        minWidth: 30,
    },
    taskText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        lineHeight: 24,
    },
    textInputsContainer: {
        marginBottom: 16,
    },
    textInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginRight: 12,
        minWidth: 80,
    },
    textInput: {
        flex: 1,
    },
    radioContainer: {
        marginBottom: 16,
    },
    radioLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    radioRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    notesContainer: {
        marginBottom: 16,
    },
    notesLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    notesInput: {
        backgroundColor: '#fff',
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
        minWidth: 80,
        maxWidth: '48%',
    },
    responseDisplay: {
        alignItems: 'center',
    },
    completeButtonContainer: {
        padding: 16,
        backgroundColor: '#fff',
        elevation: 4,
    },
    completeButton: {
        marginBottom: 8,
    },
    completeNote: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default ChecksheetCompletionScreen;

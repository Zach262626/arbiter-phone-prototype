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
  Paragraph,
  Text,
  Button,
  useTheme,
  ActivityIndicator,
  DataTable,
  Chip,
  Searchbar,
  FAB,
  Portal,
  Dialog,
  TextInput,
  List,
  IconButton,
  Menu,
  Divider,
} from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, FileUpload, Project } from '../types';

type FileManagementNavigationProp = StackNavigationProp<RootStackParamList, 'FileManagement'>;
type FileManagementRouteProp = RouteProp<RootStackParamList, 'FileManagement'>;

interface FileCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const FileManagementScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileUpload | null>(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  
  const navigation = useNavigation<FileManagementNavigationProp>();
  const route = useRoute<FileManagementRouteProp>();
  const theme = useTheme();

  const fileCategories: FileCategory[] = [
    { id: 'all', name: 'All Files', icon: 'folder', count: 0 },
    { id: 'documents', name: 'Documents', icon: 'document', count: 0 },
    { id: 'images', name: 'Images', icon: 'image', count: 0 },
    { id: 'drawings', name: 'Drawings', icon: 'construct', count: 0 },
    { id: 'reports', name: 'Reports', icon: 'analytics', count: 0 },
    { id: 'attachments', name: 'Attachments', icon: 'attach', count: 0 },
  ];

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    // Update category counts
    const updatedCategories = fileCategories.map(category => {
      if (category.id === 'all') {
        category.count = files.length;
      } else {
        category.count = files.filter(file => 
          file.mime_type.includes(category.id.slice(0, -1)) || 
          (category.id === 'documents' && file.mime_type.includes('pdf')) ||
          (category.id === 'drawings' && file.mime_type.includes('dwg')) ||
          (category.id === 'reports' && file.mime_type.includes('xlsx'))
        ).length;
      }
      return category;
    });
    // Note: In a real app, you'd use setState here
  }, [files]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockFiles: FileUpload[] = [
        {
          id: 1,
          file_name: 'Project_Specifications.pdf',
          file_path: '/files/specs/project_specs.pdf',
          file_size: 2048576,
          mime_type: 'application/pdf',
          uploaded_by: 1,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          file_name: 'Site_Plan.dwg',
          file_path: '/files/drawings/site_plan.dwg',
          file_size: 5120000,
          mime_type: 'application/acad',
          uploaded_by: 1,
          created_at: '2024-01-14T10:00:00Z',
          updated_at: '2024-01-14T10:00:00Z',
        },
        {
          id: 3,
          file_name: 'Progress_Report.xlsx',
          file_path: '/files/reports/progress_report.xlsx',
          file_size: 1024000,
          mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploaded_by: 1,
          created_at: '2024-01-13T10:00:00Z',
          updated_at: '2024-01-13T10:00:00Z',
        },
        {
          id: 4,
          file_name: 'Site_Photo_1.jpg',
          file_path: '/files/images/site_photo_1.jpg',
          file_size: 1536000,
          mime_type: 'image/jpeg',
          uploaded_by: 1,
          created_at: '2024-01-12T10:00:00Z',
          updated_at: '2024-01-12T10:00:00Z',
        },
        {
          id: 5,
          file_name: 'Safety_Checklist.pdf',
          file_path: '/files/attachments/safety_checklist.pdf',
          file_size: 512000,
          mime_type: 'application/pdf',
          uploaded_by: 1,
          created_at: '2024-01-11T10:00:00Z',
          updated_at: '2024-01-11T10:00:00Z',
        },
      ];
      
      setFiles(mockFiles);
      
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
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFiles();
    setRefreshing(false);
  };

  const handleUploadFile = () => {
    setShowUploadDialog(true);
  };

  const handleCreateFolder = () => {
    setShowCreateFolderDialog(true);
  };

  const handleFileAction = (file: FileUpload, action: string) => {
    setSelectedFile(file);
    setShowFileMenu(false);
    
    switch (action) {
      case 'download':
        // Download file logic
        Alert.alert('Download', `Downloading ${file.file_name}`);
        break;
      case 'preview':
        // Preview file logic
        Alert.alert('Preview', `Previewing ${file.file_name}`);
        break;
      case 'share':
        // Share file logic
        Alert.alert('Share', `Sharing ${file.file_name}`);
        break;
      case 'delete':
        // Delete file logic
        Alert.alert('Delete', `Deleting ${file.file_name}`);
        break;
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('image')) return 'image';
    if (mimeType.includes('dwg')) return 'construct';
    if (mimeType.includes('xlsx') || mimeType.includes('xls')) return 'table';
    if (mimeType.includes('docx') || mimeType.includes('doc')) return 'file-document';
    return 'document';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'documents' && file.mime_type.includes('pdf')) ||
      (selectedCategory === 'images' && file.mime_type.includes('image')) ||
      (selectedCategory === 'drawings' && file.mime_type.includes('dwg')) ||
      (selectedCategory === 'reports' && (file.mime_type.includes('xlsx') || file.mime_type.includes('pdf'))) ||
      (selectedCategory === 'attachments' && file.mime_type.includes('pdf'));
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading files...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Title style={styles.headerTitle}>File Management</Title>
          <Paragraph style={styles.headerSubtitle}>
            {project?.name} • {files.length} files
          </Paragraph>
        </View>

        <View style={styles.content}>
          {/* Search */}
          <Searchbar
            placeholder="Search files..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {fileCategories.map((category) => (
              <Chip
                key={category.id}
                selected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={styles.categoryChip}
                icon={category.icon}
              >
                {category.name} ({category.count})
              </Chip>
            ))}
          </ScrollView>

          {/* Files List */}
          {filteredFiles.map((file) => (
            <Card key={file.id} style={styles.fileCard}>
              <Card.Content>
                <View style={styles.fileRow}>
                  <View style={styles.fileInfo}>
                    <View style={styles.fileHeader}>
                      <Ionicons
                        name={getFileIcon(file.mime_type) as any}
                        size={24}
                        color={theme.colors.primary}
                        style={styles.fileIcon}
                      />
                      <View style={styles.fileDetails}>
                        <Title style={styles.fileName}>{file.file_name}</Title>
                        <Text style={styles.fileMeta}>
                          {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.fileActions}>
                    <IconButton
                      icon="dots-vertical"
                      size={20}
                      onPress={() => {
                        setSelectedFile(file);
                        setShowFileMenu(true);
                      }}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}

          {filteredFiles.length === 0 && (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Ionicons name="folder-outline" size={48} color="#ccc" />
                <Title style={styles.emptyTitle}>No Files Found</Title>
                <Paragraph style={styles.emptyText}>
                  {searchQuery ? 'No files match your search.' : 'Upload your first file to get started.'}
                </Paragraph>
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* File Action Menu */}
      <Portal>
        <Dialog visible={showFileMenu} onDismiss={() => setShowFileMenu(false)}>
          <Dialog.Title>File Actions</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title="Download"
              left={(props) => <List.Icon {...props} icon="download" />}
              onPress={() => selectedFile && handleFileAction(selectedFile, 'download')}
            />
            <List.Item
              title="Preview"
              left={(props) => <List.Icon {...props} icon="eye" />}
              onPress={() => selectedFile && handleFileAction(selectedFile, 'preview')}
            />
            <List.Item
              title="Share"
              left={(props) => <List.Icon {...props} icon="share" />}
              onPress={() => selectedFile && handleFileAction(selectedFile, 'share')}
            />
            <Divider />
            <List.Item
              title="Delete"
              left={(props) => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
              onPress={() => selectedFile && handleFileAction(selectedFile, 'delete')}
              titleStyle={{ color: theme.colors.error }}
            />
          </Dialog.Content>
        </Dialog>
      </Portal>

      {/* Upload Dialog */}
      <Portal>
        <Dialog visible={showUploadDialog} onDismiss={() => setShowUploadDialog(false)}>
          <Dialog.Title>Upload File</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="File Name"
              style={styles.dialogInput}
            />
            <Button
              mode="outlined"
              icon="file-upload"
              onPress={() => {/* File picker logic */}}
              style={styles.uploadButton}
            >
              Select File
            </Button>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowUploadDialog(false)}>Cancel</Button>
            <Button onPress={() => setShowUploadDialog(false)}>Upload</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Create Folder Dialog */}
      <Portal>
        <Dialog visible={showCreateFolderDialog} onDismiss={() => setShowCreateFolderDialog(false)}>
          <Dialog.Title>Create Folder</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Folder Name"
              style={styles.dialogInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCreateFolderDialog(false)}>Cancel</Button>
            <Button onPress={() => setShowCreateFolderDialog(false)}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* FAB for file actions */}
      <FAB.Group
        open={false}
        visible
        icon="plus"
        actions={[
          {
            icon: 'file-upload',
            label: 'Upload File',
            onPress: handleUploadFile,
          },
          {
            icon: 'folder-plus',
            label: 'Create Folder',
            onPress: handleCreateFolder,
          },
        ]}
        onStateChange={() => {}}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  searchBar: {
    marginBottom: 16,
    elevation: 2,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  fileCard: {
    marginBottom: 12,
    elevation: 2,
  },
  fileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
    color: '#666',
  },
  fileActions: {
    marginLeft: 8,
  },
  emptyCard: {
    marginTop: 32,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    lineHeight: 20,
  },
  dialogInput: {
    marginBottom: 16,
  },
  uploadButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default FileManagementScreen;

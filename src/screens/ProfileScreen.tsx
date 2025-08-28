import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Card, Title, Text, Button, Avatar, Divider, List, Switch, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getRoleText = (roleId: number) => {
    switch (roleId) {
      case 1:
        return 'Administrator';
      case 2:
        return 'Creator';
      case 3:
        return 'Member';
      case 4:
        return 'Developer';
      default:
        return 'Unknown';
    }
  };

  const getRoleColor = (roleId: number) => {
    switch (roleId) {
      case 1:
        return '#F44336';
      case 2:
        return '#FF9800';
      case 3:
        return '#4CAF50';
      case 4:
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            {user.picture ? (
              <Image source={{ uri: user.picture }} style={styles.avatar} />
            ) : (
              <Avatar.Text
                size={80}
                label={`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}
                style={styles.avatar}
              />
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Title style={styles.userName}>
              {user.first_name} {user.last_name}
            </Title>
            <Text style={styles.userEmail}>{user.email}</Text>
            
            <View style={styles.roleContainer}>
              <Chip
                mode="outlined"
                textStyle={{ color: getRoleColor(user.role_id) }}
                style={[styles.roleChip, { borderColor: getRoleColor(user.role_id) }]}
              >
                {getRoleText(user.role_id)}
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Personal Information</Title>
          
          <List.Item
            title="Full Name"
            description={`${user.first_name} ${user.last_name}`}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
          
          <Divider />
          
          <List.Item
            title="Email"
            description={user.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          
          {user.phone && (
            <>
              <Divider />
              <List.Item
                title="Phone"
                description={user.phone}
                left={(props) => <List.Icon {...props} icon="phone" />}
              />
            </>
          )}
          
          {user.location && (
            <>
              <Divider />
              <List.Item
                title="Location"
                description={user.location}
                left={(props) => <List.Icon {...props} icon="map-marker" />}
              />
            </>
          )}
          
          <Divider />
          
          <List.Item
            title="Member Since"
            description={new Date(user.created_at).toLocaleDateString()}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
        </Card.Content>
      </Card>

      {/* Settings */}
      <Card style={styles.settingsCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Settings</Title>
          
          <List.Item
            title="Push Notifications"
            description="Receive notifications for updates"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
              />
            )}
          />
          
          <Divider />
          
          <List.Item
            title="Change Password"
            description="Update your password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            onPress={() => {
              // TODO: Implement change password functionality
              Alert.alert('Coming Soon', 'Change password functionality will be available soon!');
            }}
          />
          
          <Divider />
          
          <List.Item
            title="Privacy Policy"
            description="View our privacy policy"
            left={(props) => <List.Icon {...props} icon="shield" />}
            onPress={() => {
              // TODO: Implement privacy policy view
              Alert.alert('Coming Soon', 'Privacy policy will be available soon!');
            }}
          />
          
          <Divider />
          
          <List.Item
            title="Terms of Service"
            description="View our terms of service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            onPress={() => {
              // TODO: Implement terms of service view
              Alert.alert('Coming Soon', 'Terms of service will be available soon!');
            }}
          />
        </Card.Content>
      </Card>

      {/* App Information */}
      <Card style={styles.appInfoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Information</Title>
          
          <List.Item
            title="Version"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
          
          <Divider />
          
          <List.Item
            title="Build"
            description="2024.1.0"
            left={(props) => <List.Icon {...props} icon="code-tags" />}
          />
          
          <Divider />
          
          <List.Item
            title="About"
            description="Arbiter Mobile - Project Management System"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            onPress={() => {
              // TODO: Implement about view
              Alert.alert('About', 'Arbiter Mobile v1.0.0\n\nA mobile companion for the Arbiter project management system.');
            }}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#F44336"
          icon="logout"
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#007AFF',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  roleContainer: {
    marginTop: 8,
  },
  roleChip: {
    alignSelf: 'center',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  settingsCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  appInfoCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});

export default ProfileScreen;

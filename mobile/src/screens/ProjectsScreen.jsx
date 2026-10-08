import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as projectApi from '../api/projects.api';
import { ProjectCard } from '../components/common/ProjectCard';
import { FilterChips } from '../components/common/FilterChips';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Not Started', value: 'NOT_STARTED' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Create Project Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedStatus) params.status = selectedStatus;

      const res = await projectApi.getProjects(params);
      setProjects(res.data || []);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedStatus]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProjects();
  };

  const handleCreateProject = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Project name is required');
      return;
    }

    try {
      setSaving(true);
      await projectApi.createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setName('');
      setDescription('');
      setModalVisible(false);
      fetchProjects();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />

      {/* Search & Filter Header */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search projects..."
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <FilterChips
          options={STATUS_OPTIONS}
          selectedValue={selectedStatus}
          onSelect={setSelectedStatus}
        />
      </View>

      {/* Projects FlatList */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() =>
              navigation.navigate('ProjectDetail', {
                projectId: item.id,
                projectName: item.name,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Projects Found</Text>
            <Text style={styles.emptySubtitle}>
              {search || selectedStatus
                ? 'Try adjusting your search filters'
                : 'Tap the + button below to create your first project'}
            </Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* Create Project Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Project</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Project Name *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Website Redesign"
                placeholderTextColor={COLORS.textMuted}
                style={styles.input}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Brief project summary..."
                placeholderTextColor={COLORS.textMuted}
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={saving}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.disabledBtn]}
                onPress={handleCreateProject}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.saveText}>Create Project</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  searchBarContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.bgCard,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.bgInputBorder,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderTopWidth: 1,
    borderColor: COLORS.borderLight,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    ...FONTS.medium,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.bgInputBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  cancelText: {
    color: COLORS.textSecondary,
    ...FONTS.semiBold,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  saveText: {
    color: '#ffffff',
    ...FONTS.bold,
  },
});

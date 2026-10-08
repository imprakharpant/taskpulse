import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import * as projectApi from '../api/projects.api';
import * as taskApi from '../api/tasks.api';
import { TaskItem } from '../components/common/TaskItem';
import { FilterChips } from '../components/common/FilterChips';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { COLORS, FONTS, RADIUS, SPACING, PROJECT_STATUS_CONFIG } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const TASK_STATUS_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const ProjectDetailScreen = ({ route, navigation }) => {
  const { projectId } = route.params;

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        projectApi.getProjectById(projectId),
        taskApi.getTasks({
          projectId,
          ...(statusFilter ? { status: statusFilter } : {}),
        }),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data || []);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to fetch project details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch when screen is focused (e.g. after adding/editing a task)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation, fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await taskApi.updateTask(task.id, { status: nextStatus });
      fetchData();
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not update task status');
    }
  };

  const handleDeleteTask = (task) => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await taskApi.deleteTask(task.id);
              fetchData();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const handleDeleteProject = () => {
    Alert.alert(
      'Delete Project',
      'This will delete the project and all of its tasks. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: async () => {
            try {
              await projectApi.deleteProject(projectId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  const statusCfg = project ? PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.NOT_STARTED : null;

  return (
    <View style={styles.container}>
      <OfflineBanner />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleStatus={handleToggleStatus}
            onEdit={(task) =>
              navigation.navigate('TaskForm', {
                projectId,
                task,
                isEditing: true,
              })
            }
            onDelete={handleDeleteTask}
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
        ListHeaderComponent={
          project ? (
            <View style={styles.headerCard}>
              <View style={styles.headerTop}>
                <View style={[styles.badge, { backgroundColor: statusCfg.bg, borderColor: statusCfg.border }]}>
                  <Text style={[styles.badgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                </View>
                <TouchableOpacity onPress={handleDeleteProject} style={styles.deleteProjBtn}>
                  <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                </TouchableOpacity>
              </View>

              <Text style={styles.projectName}>{project.name}</Text>

              {project.description ? (
                <Text style={styles.projectDesc}>{project.description}</Text>
              ) : null}

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="checkbox-outline" size={14} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</Text>
                </View>
                {project.endDate ? (
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
                    <Text style={styles.metaText}>Due {new Date(project.endDate).toLocaleDateString()}</Text>
                  </View>
                ) : null}
              </View>

              {/* Tasks Section Filter Title */}
              <View style={styles.filterSection}>
                <Text style={styles.tasksSectionTitle}>Tasks</Text>
                <FilterChips
                  options={TASK_STATUS_OPTIONS}
                  selectedValue={statusFilter}
                  onSelect={setStatusFilter}
                />
              </View>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={44} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Tasks Found</Text>
            <Text style={styles.emptySubtitle}>
              {statusFilter
                ? 'No tasks match this filter'
                : 'Tap the + button to add a task to this project'}
            </Text>
          </View>
        }
      />

      {/* FAB: Add Task */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('TaskForm', {
            projectId,
            isEditing: false,
          })
        }
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 90,
  },
  headerCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    ...FONTS.semiBold,
  },
  deleteProjBtn: {
    padding: 4,
  },
  projectName: {
    fontSize: 20,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: SPACING.xs,
  },
  projectDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.regular,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51,65,85,0.4)',
    marginBottom: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  filterSection: {
    marginTop: SPACING.xs,
  },
  tasksSectionTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: SPACING.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginTop: SPACING.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
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
});

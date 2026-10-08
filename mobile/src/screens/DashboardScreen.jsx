import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as dashboardApi from '../api/dashboard.api';
import { StatCard } from '../components/common/StatCard';
import { ProjectCard } from '../components/common/ProjectCard';
import { TaskItem } from '../components/common/TaskItem';
import { LoadingScreen } from '../components/common/LoadingScreen';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { Ionicons } from '@expo/vector-icons';

export const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    try {
      setError('');
      const res = await dashboardApi.getDashboardSummary();
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading && !refreshing) {
    return <LoadingScreen />;
  }

  const stats = data?.stats || {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  };

  const recentProjects = data?.recentProjects || [];
  const urgentTasks = data?.urgentTasks || [];

  return (
    <View style={styles.container}>
      <OfflineBanner />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Metric Cards Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              icon="folder"
              color={COLORS.primary}
            />
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              icon="checkbox"
              color={COLORS.info}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Completed"
              value={stats.completedTasks}
              icon="checkmark-circle"
              color={COLORS.success}
            />
            <StatCard
              title="Pending"
              value={stats.pendingTasks}
              icon="time"
              color={COLORS.warning}
            />
          </View>
          {stats.overdueTasks > 0 && (
            <View style={styles.statsRowSingle}>
              <StatCard
                title="Overdue Tasks"
                value={stats.overdueTasks}
                icon="warning"
                color={COLORS.danger}
                subtitle="Requires attention"
              />
            </View>
          )}
        </View>

        {/* Recent Projects Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProjectsStack')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentProjects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No projects yet. Create your first project!</Text>
          </View>
        ) : (
          recentProjects.slice(0, 3).map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onPress={() =>
                navigation.navigate('ProjectsStack', {
                  screen: 'ProjectDetail',
                  params: { projectId: proj.id, projectName: proj.name },
                })
              }
            />
          ))
        )}

        {/* Urgent / Upcoming Tasks Section */}
        {urgentTasks.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>High Priority & Due Soon</Text>
            </View>
            {urgentTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleStatus={() => {}}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  welcome: {
    fontSize: 13,
    color: COLORS.textSecondary,
    ...FONTS.medium,
  },
  userName: {
    fontSize: 22,
    color: COLORS.textPrimary,
    ...FONTS.extraBold,
    marginTop: 2,
  },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(244,63,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(244,63,94,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder,
    borderWidth: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginLeft: SPACING.xs,
    flex: 1,
    ...FONTS.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  viewAllText: {
    fontSize: 13,
    color: COLORS.primaryLight,
    ...FONTS.semiBold,
  },
  statsGrid: {
    gap: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statsRowSingle: {
    flexDirection: 'row',
  },
  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});

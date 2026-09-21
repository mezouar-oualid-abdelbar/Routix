import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import theme from "../styles/theme";
import useActivityStore from "../store/activityStore";
import { getLogsInRange, getLastCompletedDates } from "../database/activityLogs";
import { buildTodayEntries, getProgressSummary } from "../utils/todayEntries";
import { LOG_STATUS } from "../constants/logStatus";
import {
  addDays,
  getMonthDays,
  getWeekDays,
  getYearMonths,
  isSameDay,
  todayKey,
} from "../utils/dates";

const MODES = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
];

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

const MARKERS = {
  empty: { glyph: "○", color: theme.colors.disabled },
  pending: { glyph: "○", color: theme.colors.warning },
  partial: { glyph: "◐", color: theme.colors.info },
  done: { glyph: "✓", color: theme.colors.success },
};

function groupByDate(logs) {
  const map = {};
  logs.forEach((log) => {
    (map[log.logDate] = map[log.logDate] || []).push(log);
  });
  return map;
}

// Entries for one day: due definitions joined with their logs, plus logs
// of soft-deleted activities (history stays visible via title snapshot).
// lastDoneByActivityId anchors interval schedules (completions before `date`).
function getDayEntries(activities, dayLogs, date, lastDoneByActivityId = {}) {
  const logsByActivityId = {};
  (dayLogs ?? []).forEach((log) => {
    logsByActivityId[log.activityId] = log;
  });
  const entries = buildTodayEntries(activities, logsByActivityId, date, lastDoneByActivityId);

  const knownIds = new Set(activities.map((a) => String(a.id)));
  (dayLogs ?? [])
    .filter((log) => !knownIds.has(String(log.activityId)))
    .forEach((log) =>
      entries.push({
        activity: {
          id: log.activityId,
          title: log.activityTitle ?? "Deleted activity",
          type: "normal",
          typeData: null,
        },
        log,
        status: log.status,
        progress: log.progress,
      }),
    );

  return entries;
}

function markerFor(entries) {
  if (entries.length === 0) return "empty";
  if (entries.every((e) => e.status === LOG_STATUS.COMPLETED)) return "done";
  if (
    entries.some(
      (e) =>
        e.status === LOG_STATUS.COMPLETED ||
        e.status === LOG_STATUS.IN_PROGRESS,
    )
  )
    return "partial";
  return "pending";
}

export default function StatusScreen() {
  const activities = useActivityStore((state) => state.activities);
  const loadActivities = useActivityStore((state) => state.loadActivities);

  const [mode, setMode] = useState("week");
  const [anchor, setAnchor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [logs, setLogs] = useState([]);
  const [preAnchors, setPreAnchors] = useState({});
  const [nonce, setNonce] = useState(0);

  const stripDates = useMemo(() => {
    if (mode === "month") return getMonthDays(anchor);
    if (mode === "year") return getYearMonths(anchor);
    return getWeekDays(anchor);
  }, [mode, anchor]);

  const range = useMemo(() => {
    if (mode === "year") {
      const y = anchor.getFullYear();
      return { start: `${y}-01-01`, end: `${y}-12-31` };
    }
    const keys = stripDates.map(todayKey);
    return { start: keys[0], end: keys[keys.length - 1] };
  }, [mode, anchor, stripDates]);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
      setNonce((n) => n + 1);
    }, [loadActivities]),
  );

  useEffect(() => {
    let alive = true;
    getLogsInRange(range.start, range.end).then((rows) => {
      if (alive) setLogs(rows);
    });
    getLastCompletedDates(range.start).then((map) => {
      if (alive) setPreAnchors(map);
    });
    return () => {
      alive = false;
    };
  }, [range.start, range.end, nonce]);

  const logsByDate = useMemo(() => groupByDate(logs), [logs]);

  // Keep the selection inside the visible strip.
  useEffect(() => {
    if (!stripDates.some((d) => isSameDay(d, selectedDate))) {
      const today = new Date();
      setSelectedDate(
        stripDates.find((d) => isSameDay(d, today)) ?? stripDates[0],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, anchor]);

  // One ascending pass: per-day entries with rolling interval anchors
  // (completions strictly before each day) + period statistics up to today.
  const { entriesByDate, stats } = useMemo(() => {
    const anchors = { ...preAnchors };
    const today = todayKey(new Date());
    const entriesByDate = {};
    let completed = 0;
    let inProgress = 0;
    let pending = 0;

    const dates =
      mode === "year"
        ? stripDates.flatMap((monthStart) => getMonthDays(monthStart))
        : stripDates;

    dates.forEach((date) => {
      const key = todayKey(date);
      const entries = getDayEntries(activities, logsByDate[key], date, anchors);
      entriesByDate[key] = entries;

      (logsByDate[key] ?? []).forEach((log) => {
        if (
          log.status === LOG_STATUS.COMPLETED &&
          (!anchors[log.activityId] || anchors[log.activityId] < log.logDate)
        ) {
          anchors[log.activityId] = log.logDate;
        }
      });

      if (key > today) return;
      entries.forEach((entry) => {
        if (entry.status === LOG_STATUS.COMPLETED) completed += 1;
        else if (entry.status === LOG_STATUS.IN_PROGRESS) inProgress += 1;
        else pending += 1;
      });
    });

    const total = completed + inProgress + pending;
    return {
      entriesByDate,
      stats: {
        completed,
        inProgress,
        pending,
        total,
        percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    };
  }, [activities, logsByDate, stripDates, mode, preAnchors]);

  const selectedKey = todayKey(selectedDate);
  const selectedEntries = entriesByDate[selectedKey] ?? [];
  const selectedDone = selectedEntries.filter(
    (e) => e.status === LOG_STATUS.COMPLETED,
  ).length;
  const selectedPercent =
    selectedEntries.length > 0
      ? Math.round((selectedDone / selectedEntries.length) * 100)
      : 0;

  const shiftAnchor = (direction) => {
    if (mode === "week") setAnchor(addDays(anchor, direction * 7));
    else if (mode === "month")
      setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1));
    else setAnchor(new Date(anchor.getFullYear() + direction, 0, 1));
  };

  const rangeLabel = () => {
    if (mode === "week") {
      const first = stripDates[0];
      const last = stripDates[stripDates.length - 1];
      const sameMonth = first.getMonth() === last.getMonth();
      const opts = { month: "short", day: "numeric" };
      return sameMonth
        ? `${first.toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${last.getDate()}`
        : `${first.toLocaleDateString(undefined, opts)} – ${last.toLocaleDateString(undefined, opts)}`;
    }
    if (mode === "month")
      return anchor.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    return String(anchor.getFullYear());
  };

  const openMonth = (monthStart) => {
    setMode("month");
    setAnchor(monthStart);
    setSelectedDate(monthStart);
  };

  const renderStripCell = (date) => {
    const key = todayKey(date);
    const isMonthCell = mode === "year";
    const selected = isSameDay(date, selectedDate);
    const label = isMonthCell
      ? date.toLocaleDateString(undefined, { month: "short" })
      : date.getDate();

    let marker = null;
    let monthPercent = null;
    if (isMonthCell) {
      const prefix = key.slice(0, 7);
      const monthLogs = logs.filter((l) => l.logDate.startsWith(prefix));
      const done = monthLogs.filter((l) => l.status === LOG_STATUS.COMPLETED).length;
      monthPercent = monthLogs.length > 0 ? Math.round((done / monthLogs.length) * 100) : null;
    } else {
      marker = MARKERS[markerFor(entriesByDate[key] ?? [])];
    }

    return (
      <TouchableOpacity
        key={key}
        style={[styles.cell, selected && styles.cellSelected]}
        onPress={() =>
          isMonthCell ? openMonth(date) : setSelectedDate(date)
        }
      >
        {!isMonthCell && (
          <Text style={[styles.cellDay, selected && styles.cellTextSelected]}>
            {DAY_LETTERS[(date.getDay() + 6) % 7]}
          </Text>
        )}
        <Text style={[styles.cellLabel, selected && styles.cellTextSelected]}>
          {label}
        </Text>
        {marker ? (
          <Text style={[styles.cellMarker, { color: marker.color }]}>
            {marker.glyph}
          </Text>
        ) : (
          <Text style={[styles.cellMarker, selected && styles.cellTextSelected]}>
            {monthPercent == null ? "—" : `${monthPercent}%`}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderEntry = (entry) => {
    const summary = getProgressSummary(entry);
    return (
      <View key={`${entry.activity.id}`} style={styles.entryRow}>
        <Text style={styles.entryTitle}>{entry.activity.title}</Text>
        {summary.detail ? (
          <Text style={styles.entryDetail}>
            {summary.detail} • {summary.percent}%
          </Text>
        ) : null}
      </View>
    );
  };

  const section = (title, items) =>
    items.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map(renderEntry)}
      </View>
    ) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Status</Text>

        <View style={styles.modeRow}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.value}
              style={[styles.chip, mode === m.value && styles.chipActive]}
              onPress={() => setMode(m.value)}
            >
              <Text style={[styles.chipText, mode === m.value && styles.chipTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.rangeRow}>
          <TouchableOpacity onPress={() => shiftAnchor(-1)} style={styles.arrow}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.rangeLabel}>{rangeLabel()}</Text>
          <TouchableOpacity onPress={() => shiftAnchor(1)} style={styles.arrow}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Completion</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${stats.percent}%` }]} />
          </View>
          <Text style={styles.percent}>{stats.percent}%</Text>
          <View style={styles.countRow}>
            <Text style={styles.count}>Completed {stats.completed}</Text>
            <Text style={styles.count}>In Progress {stats.inProgress}</Text>
            <Text style={styles.count}>Pending {stats.pending}</Text>
          </View>
        </View>

        <View style={styles.strip}>
          {mode === "month" ? (
            <FlatList
              data={stripDates}
              keyExtractor={(d) => todayKey(d)}
              numColumns={7}
              scrollEnabled={false}
              renderItem={({ item }) => renderStripCell(item)}
            />
          ) : (
            <View style={styles.stripRow}>{stripDates.map(renderStripCell)}</View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>
            {selectedDate.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.percentSmall}>{selectedPercent}% done</Text>
          {section(
            "Completed",
            selectedEntries.filter((e) => e.status === LOG_STATUS.COMPLETED),
          )}
          {section(
            "In Progress",
            selectedEntries.filter((e) => e.status === LOG_STATUS.IN_PROGRESS),
          )}
          {section(
            "Pending",
            selectedEntries.filter((e) => e.status === LOG_STATUS.PENDING),
          )}
          {selectedEntries.length === 0 ? (
            <Text style={styles.empty}>Nothing scheduled this day.</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  header: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  modeRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chip: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
  },
  chipTextActive: {
    color: theme.colors.textInverse,
    fontWeight: theme.fontWeights.bold,
  },
  rangeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },
  arrow: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  arrowText: {
    fontSize: theme.fontSizes.xl,
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.bold,
  },
  rangeLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  cardLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  barTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  percent: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  percentSmall: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  countRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },
  count: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  strip: {
    marginBottom: theme.spacing.md,
  },
  stripRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  cell: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  cellSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  cellDay: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  cellLabel: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
  },
  cellMarker: {
    fontSize: theme.fontSizes.sm,
    marginTop: 2,
  },
  cellTextSelected: {
    color: theme.colors.textInverse,
  },
  section: {
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: theme.spacing.xs,
  },
  entryRow: {
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  entryTitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  entryDetail: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  empty: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
});

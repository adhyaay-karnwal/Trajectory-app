import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    // All conversations (shared database)
    const convos = await ctx.db
      .query('conversations')
      .collect();

    const totalChats = convos.length;

    // ── Daily activity map ───────────────────────────────────────────────────
    const dailyMap: Record<string, number> = {};
    for (const c of convos) {
      const key = toDateKey(c.lastMessageAt);
      dailyMap[key] = (dailyMap[key] ?? 0) + 1;
    }

    // Build 371-cell flat array (53 weeks × 7 days, oldest first)
    const todayMs = new Date().setHours(0, 0, 0, 0);
    const flatCounts: number[] = [];
    for (let i = 370; i >= 0; i--) {
      const ms = todayMs - i * 86_400_000;
      flatCounts.push(dailyMap[toDateKey(ms)] ?? 0);
    }

    // Map raw counts → 0-4 intensity
    const flatIntensity = flatCounts.map((n) =>
      n === 0 ? 0 : n === 1 ? 2 : n <= 3 ? 3 : 4
    );

    // Reshape into [week][day] — 53 cols × 7 rows
    const heatmap: number[][] = [];
    for (let w = 0; w < 53; w++) {
      heatmap.push(flatIntensity.slice(w * 7, w * 7 + 7));
    }

    // ── Streak ───────────────────────────────────────────────────────────────
    let streak = 0;
    for (let i = flatCounts.length - 1; i >= 0; i--) {
      if (flatCounts[i] > 0) streak++;
      else break;
    }

    // ── Active days (last 30) ────────────────────────────────────────────────
    const activeDays = flatCounts.slice(-30).filter((v) => v > 0).length;

    // ── This month vs last month ─────────────────────────────────────────────
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const thisMonth = convos.filter((c) => c.lastMessageAt >= thisMonthStart).length;
    const lastMonth = convos.filter(
      (c) => c.lastMessageAt >= lastMonthStart && c.lastMessageAt < thisMonthStart
    ).length;

    // ── This week vs last week ───────────────────────────────────────────────
    const dayOfWeek = now.getDay();
    const mondayOffset = (dayOfWeek + 6) % 7;
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - mondayOffset);
    thisMonday.setHours(0, 0, 0, 0);
    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    const thisWeek = convos.filter((c) => c.lastMessageAt >= thisMonday.getTime()).length;
    const lastWeek = convos.filter(
      (c) => c.lastMessageAt >= lastMonday.getTime() && c.lastMessageAt < thisMonday.getTime()
    ).length;

    // ── Best day / week / month ──────────────────────────────────────────────
    const byDow: number[] = Array(7).fill(0);
    const byWeek: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    for (const c of convos) {
      const d = new Date(c.lastMessageAt);
      byDow[d.getDay()]++;
      // ISO week key: YYYY-Www
      const jan1 = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86_400_000 + jan1.getDay() + 1) / 7);
      const wKey = `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
      byWeek[wKey] = (byWeek[wKey] ?? 0) + 1;
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      byMonth[mKey] = (byMonth[mKey] ?? 0) + 1;
    }

    const bestDowIdx = byDow.indexOf(Math.max(...byDow));
    const bestDay = convos.length > 0 ? DAY_NAMES[bestDowIdx] : '—';

    const bestWeekKey = Object.entries(byWeek).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const bestWeek = bestWeekKey
      ? (() => {
          const [yr, wk] = bestWeekKey.split('-W');
          const jan1 = new Date(Number(yr), 0, 1);
          const startMs = jan1.getTime() + (Number(wk) - 1) * 7 * 86_400_000;
          const start = new Date(startMs);
          const end = new Date(startMs + 6 * 86_400_000);
          return `${start.getDate()} – ${end.getDate()} ${MONTH_NAMES[end.getMonth()]}`;
        })()
      : '—';

    const bestMonthKey = Object.entries(byMonth).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const bestMonth = bestMonthKey
      ? (() => {
          const [yr, mo] = bestMonthKey.split('-');
          return `${MONTH_NAMES[Number(mo) - 1]} (${yr})`;
        })()
      : '—';

    // ── User stats (pro formas, properties, reports) ─────────────────────────
    const stats = await ctx.db
      .query('userStats')
      .first();

    return {
      totalChats,
      heatmap,
      streak,
      activeDays,
      thisMonth,
      lastMonth,
      thisWeek,
      lastWeek,
      bestDay,
      bestWeek,
      bestMonth,
      missionCount: stats?.missionCount ?? 0,
      planetsAnalyzed: stats?.planetsAnalyzed ?? 0,
      reportsGenerated: stats?.reportsGenerated ?? 0,
      totalAnalyses: stats?.totalAnalyses ?? 0,
      // Feature visit counts from userStats
      chatVisits: stats?.chatVisits ?? 0,
      vaultVisits: stats?.vaultVisits ?? 0,
      missionVisits: stats?.missionVisits ?? 0,
      trajectoryVisits: stats?.trajectoryVisits ?? 0,
      launchVisits: stats?.launchVisits ?? 0,
    };
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

// Increment feature visit count (optimized - no new rows per visit)
export const trackFeatureVisit = mutation({
  args: {
    feature: v.union(
      v.literal('chat'),
      v.literal('vault'),
      v.literal('mission'),
      v.literal('trajectory'),
      v.literal('launch')
    ),
  },
  handler: async (ctx, args) => {
    const fieldMap: Record<string, string> = {
      chat: 'chatVisits',
      vault: 'vaultVisits',
      mission: 'missionVisits',
      trajectory: 'trajectoryVisits',
      launch: 'launchVisits',
    };
    const field = fieldMap[args.feature];

    const existing = await ctx.db
      .query('userStats')
      .first();

    if (existing) {
      const currentValue = (existing as Record<string, unknown>)[field] as number | undefined;
      await ctx.db.patch(existing._id, { [field]: (currentValue ?? 0) + 1 });
    } else {
      await ctx.db.insert('userStats', {
        missionCount: 0,
        planetsAnalyzed: 0,
        reportsGenerated: 0,
        totalAnalyses: 0,
        chatVisits: args.feature === 'chat' ? 1 : 0,
        vaultVisits: args.feature === 'vault' ? 1 : 0,
        missionVisits: args.feature === 'mission' ? 1 : 0,
        trajectoryVisits: args.feature === 'trajectory' ? 1 : 0,
        launchVisits: args.feature === 'launch' ? 1 : 0,
      });
    }
  },
});

export const incrementStat = mutation({
  args: {
    field: v.union(
      v.literal('missionCount'),
      v.literal('planetsAnalyzed'),
      v.literal('reportsGenerated'),
      v.literal('totalAnalyses')
    ),
    by: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const delta = args.by ?? 1;

    const existing = await ctx.db
      .query('userStats')
      .first();

    if (existing) {
      const currentValue = (existing as any)[args.field] as number | undefined;
      await ctx.db.patch(existing._id, { [args.field]: (currentValue ?? 0) + delta });
    } else {
      await ctx.db.insert('userStats', {
        missionCount: args.field === 'missionCount' ? delta : 0,
        planetsAnalyzed: args.field === 'planetsAnalyzed' ? delta : 0,
        reportsGenerated: args.field === 'reportsGenerated' ? delta : 0,
        totalAnalyses: args.field === 'totalAnalyses' ? delta : 0,
        chatVisits: 0,
        vaultVisits: 0,
        missionVisits: 0,
        trajectoryVisits: 0,
        launchVisits: 0,
      });
    }
  },
});
